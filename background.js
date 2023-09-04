chrome.runtime.onInstalled.addListener(function() {
    console.log('Wordle Stats Editor Installed.');
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && !changeInfo.url.startsWith('chrome://')) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: urlChanged,
        args: [changeInfo.url]
      }).catch(error => {
        //ignore since we are not injecting into all pages
      });
    }
  });
  
  function urlChanged(url) {
    console.log('URL changed to', url);
  }