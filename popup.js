document.addEventListener('DOMContentLoaded', async function() {
    try {
        let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

        if (!tab.url.includes('wordle')) {
            document.getElementById('notWordleMessage').style.display = 'block';
            return;
        }

        chrome.tabs.sendMessage(tab.id, {type: "fetchLocalStorage"}, function(response) {
            if (response && response.gameData) {
                document.getElementById('stats').style.display = 'block';

                const data = JSON.parse(response.gameData);
                
                document.getElementById('darkMode').checked = data.settings.darkMode;
                document.getElementById('averageGuesses').value = data.stats.averageGuesses;
                document.getElementById('currentStreak').value = data.stats.currentStreak;
                document.getElementById('gamesPlayed').value = data.stats.gamesPlayed;
                document.getElementById('gamesWon').value = data.stats.gamesWon;

                // Populate guesses
                for (const key in data.stats.guesses) {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.id = `guess-${key}`;
                    input.value = data.stats.guesses[key];

                    const label = document.createElement('label');
                    label.textContent = `Guess ${key}: `;
                    label.appendChild(input);

                    document.getElementById('guesses').appendChild(label);
                }

                document.getElementById('hasPlayed').checked = data.stats.hasPlayed;
                document.getElementById('isOnStreak').checked = data.stats.isOnStreak;
                document.getElementById('maxStreak').value = data.stats.maxStreak;
                document.getElementById('winPercentage').value = data.stats.winPercentage;

                // Populate board state
                data.game.boardState.forEach((state, index) => {
                    const input = document.createElement('input');
                    input.classList.add('mt-1');
                    input.type = 'text';
                    input.value = state;
                    input.id = `boardState-${index}`;

                    document.getElementById('boardState').appendChild(input);
                });
            }
        });
    } catch (error) {
        console.error("Error:", error);
    }
});

document.getElementById('save').addEventListener('click', async function() {
    try {
        let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

        if (tab.url.includes('wordle')) {
            chrome.tabs.sendMessage(tab.id, {type: "fetchLocalStorage"}, function(response) {
                if (response && response.gameData) {
                    const existingData = JSON.parse(response.gameData);

                    existingData.settings.darkMode = document.getElementById('darkMode').checked;
                    existingData.stats.averageGuesses = parseInt(document.getElementById('averageGuesses').value);
                    existingData.stats.currentStreak = parseInt(document.getElementById('currentStreak').value);
                    existingData.stats.gamesPlayed = parseInt(document.getElementById('gamesPlayed').value);
                    existingData.stats.gamesWon = parseInt(document.getElementById('gamesWon').value);

                    // Update guesses
                    for (const key of ['1', '2', '3', '4', '5', '6', 'fail']) {
                        existingData.stats.guesses[key] = parseInt(document.getElementById(`guess-${key}`).value);
                    }

                    existingData.stats.hasPlayed = document.getElementById('hasPlayed').checked;
                    existingData.stats.isOnStreak = document.getElementById('isOnStreak').checked;
                    existingData.stats.maxStreak = parseInt(document.getElementById('maxStreak').value);
                    existingData.stats.winPercentage = parseInt(document.getElementById('winPercentage').value);

                    // Update board state
                    for (let i = 0; i < 6; i++) {
                        existingData.game.boardState[i] = document.getElementById(`boardState-${i}`).value;
                    }
                    
                    existingData.game.boardState.currentRowIndex = existingData.game.boardState.filter(row => row !== "").length;

                    chrome.tabs.sendMessage(tab.id, {
                        type: "setLocalStorage", 
                        gameData: JSON.stringify(existingData)
                    }, function(saveResponse) {
                        if (saveResponse && saveResponse.status === "done") {
                            alert("Data saved successfully!");
                            //refresh the page to see the changes
                            chrome.tabs.reload(tab.id);
                        }
                    });
                }
            });
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

document.getElementById('navigateToWordle').addEventListener('click', async function() {
    //opens a new tab with the wordle game
    chrome.tabs.create({url: 'https://www.nytimes.com/games/wordle'});
});
