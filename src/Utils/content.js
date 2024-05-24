chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "log") {
    console.log("Received log message.");
    console.log(request.data);
  }
  if (request.message === "getGameData") {
    console.log("Received getGameData message.");
    const allGames = {};

    // Loop through all keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Check if the key includes the specific game state identifier
      if (key.includes("games-state-wordleV2")) {
        // Retrieve the value associated with the key
        const value = localStorage.getItem(key);
        // console.log(key, value);
        // Store the value in the object with the key
        allGames[key] = JSON.parse(value); // Parsing the JSON to convert string back to object
      }
    }

    sendResponse(allGames);
  }

  if (request.message === "submitGameData") {
    // Retrieve the data from the request
    const data = request.data;
    console.log("received submitGameData message.");

    // Store the data in localStorage
    localStorage.setItem(
      `games-state-wordleV2-${Date.now()}`,
      JSON.stringify(data)
    );

    //prepare the data to be sent to the server
    //add timestamp to the data
    data.timestamp = Math.floor(Date.now() / 1000);
    //adust legacy data's timestamp too
    data.game_data.setLegacyStats.timestamp = data.timestamp;
    //calculate row count based on the length of the boardState non empty values in the array
    data.game_data.currentRowIndex = data.game_data.boardState.filter(
      (row) => row.length > 0
    ).length;

    //make the numbers actually numbers
    data.game_data.setLegacyStats.guesses = Object.fromEntries(
      Object.entries(data.game_data.setLegacyStats.guesses).map(([k, v]) => [
        k,
        Number(v),
      ])
    );

    data.game_data.setLegacyStats.gamesPlayed = parseInt(
      data.game_data.setLegacyStats.gamesPlayed
    );
    data.game_data.setLegacyStats.currentStreak = parseInt(
      data.game_data.setLegacyStats.currentStreak
    );
    data.game_data.setLegacyStats.gamesWon = parseInt(
      data.game_data.setLegacyStats.gamesWon
    );
    data.game_data.setLegacyStats.maxStreak = parseInt(
      data.game_data.setLegacyStats.maxStreak
    );

    // console.log(data);

    //fire off the fetch request to the server
    fetch("https://www.nytimes.com/svc/games/state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      includeCredentials: true,
      credentials: "include",
      body: JSON.stringify(data),
    }).then((response) => {
      console.log(response);
      sendResponse("Data submitted successfully");
      //show alert
      alert("Data submitted successfully");
      //reload the page
      window.location.reload();
    });
    // Send a response back to confirm the data submission
  }
});
