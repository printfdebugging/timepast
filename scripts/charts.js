function createReport (listContainer, listData) {
    listContainer.innerHTML = ''; // Clear existing content (if any)
    listData.sort((a, b) => {
        const dateComparison = new Date(a.date) - new Date(b.date);
        return dateComparison !== 0 ? dateComparison : a.text.localeCompare(b.text);
    });
    listData.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item.text; // Main item text
        listContainer.appendChild(listItem);

        // Add subpoints if available
        if (item.subpoints.length > 0) {
            const sublist = document.createElement('ul'); // Nested list for subpoints
            sublist.style.listStyleType = "circle"; // Optional: Change bullet style for subpoints

            item.subpoints.forEach(subpoint => {
                const sublistItem = document.createElement('li');
                sublistItem.textContent = subpoint; // Subpoint text
                sublist.appendChild(sublistItem);
            });

            listItem.appendChild(sublist); // Append sublist to the main list item
        }
    });
}

function createChart (parentContainer, chartID, chartData) {
    const existingChart = document.getElementById(chartID);
    if (existingChart) {
        existingChart.remove();
    }

    const chartElement = document.createElement("canvas");
    chartElement.id = chartID;
    chartElement.classList.add("chart");
    parentContainer.appendChild(chartElement);

    new Chart(chartElement, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getUserCalendars(accessToken) {
    const requestURL = "https://www.googleapis.com/calendar/v3/users/me/calendarList"
    const requestHeaders = new Headers()
    requestHeaders.append('Authorization', 'Bearer ' + accessToken)

    const driveRequest = new Request(requestURL, {
        method: "GET",
        headers: requestHeaders
    });

    return fetch(driveRequest).then((response) => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw response.status;
        }
    });
}

function getPrimaryCalendarEventsList(accessToken) {
    const requestURL = `https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true`
    const requestHeaders = new Headers()
    requestHeaders.append('Authorization', 'Bearer ' + accessToken)

    const driveRequest = new Request(requestURL, {
        method: "GET",
        headers: requestHeaders
    });

    return fetch(driveRequest).then((response) => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw response.status;
        }
    });
}


function createEventsObjectForCharts(primaryCalendarEventsList) {
    const events = primaryCalendarEventsList.items;
    // Array to store event objects
    const eventObjects = [];

    // Helper function to adjust date for local timezone
    function getLocalDate(dateTime) {
        const date = new Date(dateTime);
        const timezoneOffset = date.getTimezoneOffset(); // Get timezone offset in minutes
        date.setMinutes(date.getMinutes() - timezoneOffset); // Adjust for the offset
        return date.toISOString().split("T")[0]; // Extract only the date in YYYY-MM-DD format
    }

    // Step 1: Create objects for each event
    events.forEach(event => {
        const { summary, start, end, description } = event;

        const match = summary.match(/^\[([^\]]+)]/);
        const tag = match ? match[1] : "Unknown"; // Capture the first tag

        // Remove the [tag] from the summary (keep the rest of the summary)
        const remainingSummary = summary.replace(/^\[([^\]]+)]\s*/, "").trim();

        // Calculate the duration in hours
        const startTime = new Date(start.dateTime);
        const endTime = new Date(end.dateTime);
        const durationInHours = (endTime - startTime) / (1000 * 60 * 60);

        // Get the event date in local time
        const date = getLocalDate(start.dateTime);

        // Create and push the event object
        eventObjects.push({
            tag,
            date,
            duration: durationInHours,
            summary: remainingSummary,
            description: description
        });
    });

    // Step 2: Create a map for each unique tag
    const tagEventMap = new Map();

    eventObjects.forEach(event => {
        const { tag } = event;
        if (!tagEventMap.has(tag)) {
            tagEventMap.set(tag, []);
        }
        tagEventMap.get(tag).push(event);
    });

    // Step 3: Sort arrays in the map by date
    for (const [tag, events] of tagEventMap.entries()) {
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return tagEventMap;
}

let chartDataset = {
    // label: ""
    // data: [],
    strokeColor: "none",
    borderWidth: 1,
    pointRadius: 2,
    tension: 0.4,
    fill: true
}

function loadWeeklyReport(eventsMap) {
    const weeklyReportChartContainer = document.getElementById("weeklyReportChart");
    const weeklyDatePicker = document.getElementById("weeklyDatePicker");

    const weeklyReportChartData = {
        labels: [], // Will store the ISO dates of the week
        datasets: [],
    };

    function updateWeeklyChart(date) {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // Saturday

        // Generate labels as ISO dates for each day of the week
        const reportData = [];
        weeklyReportChartData.labels = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            weeklyReportChartData.labels.push(day.toISOString().split('T')[0]); // Format as YYYY-MM-DD
        }

        // Reset datasets and process events for the week
        weeklyReportChartData.datasets = [];
        processEventsForRange(eventsMap, startOfWeek, endOfWeek, weeklyReportChartData, false, reportData);

        // Create the chart
        createChart(weeklyReportChartContainer, "weekly-chart", weeklyReportChartData);
        // Load the weekly report
        const listContainer = document.getElementById('weekly-report');
        createReport(listContainer, reportData)
    }

    // Set default date to today
    weeklyDatePicker.value = new Date().toISOString().split('T')[0];
    weeklyDatePicker.addEventListener('change', (e) => updateWeeklyChart(new Date(e.target.value)));
    updateWeeklyChart(new Date());

}

function loadMonthlyReport(eventsMap) {
    const monthlyReportChartContainer = document.getElementById("monthlyReportChart");
    const monthlyDatePicker = document.getElementById("monthlyDatePicker");

    const monthlyReportChartData = {
        labels: Array.from({ length: 31 }, (_, i) => i + 1), // Days of the month
        datasets: [],
    };

    function updateMonthlyChart(date) {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Last day of the month

        const reportData = [];
        monthlyReportChartData.datasets = [];
        processEventsForRange(eventsMap, startOfMonth, endOfMonth, monthlyReportChartData, false, reportData);
        createChart(monthlyReportChartContainer, "monthly-chart", monthlyReportChartData);

        const listContainer = document.getElementById('monthly-report');
        createReport(listContainer, reportData)
    }

    // Set default date to today
    monthlyDatePicker.value = new Date().toISOString().split('T')[0];
    monthlyDatePicker.addEventListener('change', (e) => updateMonthlyChart(new Date(e.target.value)));
    updateMonthlyChart(new Date());
}

function loadAnnualReport(eventsMap) {
    const annualReportChartContainer = document.getElementById("annualReportChart");
    const annualDatePicker = document.getElementById("annualDatePicker");

    const annualReportChartData = {
        labels: [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ],
        datasets: [],
    };

    function updateAnnualChart(date) {
        const startOfYear = new Date(date.getFullYear(), 0, 1); // January 1st
        const endOfYear = new Date(date.getFullYear(), 11, 31); // December 31st

        const reportData = [];
        annualReportChartData.datasets = [];
        processEventsForRange(eventsMap, startOfYear, endOfYear, annualReportChartData, true, reportData);
        createChart(annualReportChartContainer, "annual-chart", annualReportChartData);

        const listContainer = document.getElementById('annual-report');
        createReport(listContainer, reportData)
    }

    // Set default date to today
    annualDatePicker.value = new Date().toISOString().split('T')[0];
    annualDatePicker.addEventListener('change', (e) => updateAnnualChart(new Date(e.target.value)));
    updateAnnualChart(new Date());
}

function normalizeToMidnight(date) {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0); // Reset time to midnight
    return normalizedDate;
}

function processEventsForRange(eventsMap, startDate, endDate, chartData, groupByMonth, eventReport) {
    for (const [tag, events] of eventsMap) {
        let tagDataset = structuredClone(chartDataset);
        tagDataset.label = tag;
        tagDataset.data = Array(chartData.labels.length).fill(0);

        let hasSomeData = false;

        for (const event of events) {
            const eventDate = new Date(event.date);
            const normalizedEventDate = normalizeToMidnight(eventDate);
            const normalizedStartDate = normalizeToMidnight(startDate);
            const normalizedEndDate = normalizeToMidnight(endDate);
            if (normalizedEventDate >= normalizedStartDate && normalizedEventDate <= normalizedEndDate) {
                let index;

                if (groupByMonth) {
                    index = eventDate.getMonth(); // Group by month
                    if (event.duration != 0) {
                        eventReport.push({
                            date: event.date,
                            text: `${event.summary} (${event.duration} hr)`,
                            subpoints: [] // for annual report, just give the highlights or it will get really tedious
                        })
                    }
                } else if (chartData.labels.length === 7) {
                    index = eventDate.getDay(); // Group by day of the week
                    if (event.duration != 0) {
                        eventReport.push({
                            date: event.date,
                            text: `${event.summary} (${event.duration} hr)`,
                            subpoints: event.description ? event.description.split('\n') : [] // Subpoints from description
                        })
                    }
                } else {
                    index = eventDate.getDate() - 1; // Group by day of the month
                    if (event.duration != 0) {
                        eventReport.push({
                            date: event.date,
                            text: `${event.summary} (${event.duration} hr)`,
                            subpoints: event.description ? event.description.split('\n') : [] // Subpoints from description
                        })
                    }
                }

                tagDataset.data[index] += event.duration;
                if (event.duration != 0) hasSomeData = true;
            }
        }

        if (hasSomeData) chartData.datasets.push(tagDataset);
    }
}

function loadChartsnReports(eventsMap) {
    loadWeeklyReport(eventsMap)
    loadMonthlyReport(eventsMap)
    loadAnnualReport(eventsMap)
}

function logError(error) {
    console.error(`Error: ${error}`);
}

function copyText() {
    const textBox = document.getElementById("text-box");
    textBox.select();
    textBox.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    alert("Text copied to clipboard");
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("ondomcontentload listener")
    getAccessToken()
        .then(getPrimaryCalendarEventsList)
        .then(createEventsObjectForCharts)
        .then(loadChartsnReports)
        .catch(logError);
})
