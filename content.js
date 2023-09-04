// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "fetchLocalStorage") {
        const darkModeValue = localStorage.getItem('nyt-wordle-darkmode');
        const gameDataValue = localStorage.getItem('nyt-wordle-moogle/ANON');
        sendResponse({
            darkMode: darkModeValue,
            gameData: gameDataValue
        });
    } else if (request.type === "setLocalStorage") {
        localStorage.setItem('nyt-wordle-darkmode', request.darkMode);
        localStorage.setItem('nyt-wordle-moogle/ANON', request.gameData);
        sendResponse({status: "done"});
    }
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url.includes('www.nytimes.com/games/wordle/')) {
        chrome.pageAction.show(tabId);
    }
});
