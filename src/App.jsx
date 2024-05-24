import { useState, useContext, useEffect } from "react";
import { SubmitNewStats } from "./Components/SubmitNewStats";
import { NotWordleTab } from "./Components/NotWordleTab";
import { Disclaimer } from "./Components/Disclaimer";
import { StatsContext } from "./Components/useStats";
import "./App.css";

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
        <p>Loading... Open me in a second. Or play a game first.</p>
      )}
      <Disclaimer />
    </div>
  );
}

export default App;
