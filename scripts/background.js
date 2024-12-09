chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.action.onClicked.addListener(tab => {
  chrome.tabs.create({url: "source/index.html"});
});
