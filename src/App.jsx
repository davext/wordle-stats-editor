import { useContext, useEffect, useState } from "react";
import "./App.css";
import { Disclaimer } from "./Components/Disclaimer";
import { NotWordleTab } from "./Components/NotWordleTab";
import { SubmitNewStats } from "./Components/SubmitNewStats";
import { StatsContext } from "./Components/useStats";

function App() {
  //check if current tab is wordle or not
  const [isWordle, setIsWordle] = useState(false);
  const [gameData, setGameData] = useState(null);

  const { stats } = useContext(StatsContext);

  console.log(stats);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      //send console to content.js
      // chrome.tabs.sendMessage(tabs[0].id, { message: "log", data: url });
      if (url.includes("https://www.nytimes.com/games/wordle/index.html")) {
        setIsWordle(true);
      }
    });
  }, []);

  useEffect(() => {
    //send message to content.js to get game data
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: "getGameData" },
        (response) => {
          setGameData(response);
          console.log("Received game data from localstorage.");
          // console.log(response);
        }
      );
    });
  }, []);

  if (!isWordle) {
    return (
      <div className="App">
        <NotWordleTab />
        <Disclaimer />
      </div>
    );
  }

  return (
    <div className="App">
      {gameData ? (
        <SubmitNewStats gameData={gameData} />
      ) : (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading Wordle data...</p>
          <p className="loading-subtext">
            If loading persists, try refreshing the page or signing out and back
            in.
            <br />
            <span className="blame-text">(blame NYT for this 🙄)</span>
          </p>
        </div>
      )}
      <Disclaimer />
    </div>
  );
}

export default App;
