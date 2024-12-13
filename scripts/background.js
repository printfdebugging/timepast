browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({
        url: "/source/index.html"
    })
})
