import { get, useForm } from "react-hook-form";
import { useState } from "react";

export const SubmitNewStats = ({ gameData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      if (gameData) {
        return {
          game_data: {
            ...gameData[Object.keys(gameData).find((key) => key.includes("/"))]
              ?.states[0].data,
          },
          game: "wordleV2",
          puzzle_id: gameData
            ? gameData[Object.keys(gameData).find((key) => key.includes("/"))]
                ?.states[0].puzzleId
            : "",
          schema_version: gameData
            ? gameData[Object.keys(gameData).find((key) => key.includes("/"))]
                ?.states[0].schemaVersion
            : "",
          user_id: Number(getUserFromGame(gameData)),
        };
      }
    },
  });

  const getUserFromGame = (gameData) => {
    if (gameData) {
      return Object.keys(gameData)
        .find((key) => key.includes("/"))
        .split("/")[1];
    }
  };

  const [advanced, showAdvanced] = useState(false);

  const onSubmit = (data) => {
    //send it to content.js to be submitted
    console.log(data);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: "submitGameData",
        data: data,
      });
    });
  };

  // DEBUGGING CODE
  // if (gameData) {
  //   return (
  //     <div>
  //       {/* {JSON.stringify(Object.keys(gameData))} */}
  //       {/* return the key with the slash in it */}
  //       {JSON.stringify(
  //         gameData[Object.keys(gameData).find((key) => key.includes("/"))] ||
  //           null
  //       )}
  //     </div>
  //   );
  // }

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        borderRadius: "1rem",
        width: "fit-content",
        margin: "auto",
        minWidth: "80%",
      }}
    >
      <span
        style={{
          alignSelf: "end",
        }}
      >
        {/* {import.meta.env.MODE === "development" &&
          gameData &&
          (JSON.stringify(Object.values(gameData)[0]?.states[0]) || "")} */}
        {/* {import.meta.env.MODE === "development" &&
          gameData &&
          (JSON.stringify(Object.values(gameData)[0]?.states[0]) || "")} */}
        {gameData
          ? `User ID: ${getUserFromGame(gameData)}`
          : "No user found. Login to your NYT account and play a game."}
      </span>
      {errors.user_id && <span>This field is required</span>}
      <h2>Game Data</h2>
      <label>Board State (Enter guesses)</label>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        {["", "", "", "", "", ""].map((value, index) => (
          <div key={index}>
            <label>Guess {index + 1}</label>{" "}
            <input
              defaultValue={value}
              {...register(`game_data.boardState.${index}`)}
            />
          </div>
        ))}
      </div>
      {errors.game_data?.currentRowIndex && <span>This field is required</span>}

      <label>Game Status</label>
      {/* dropdown with ["IN_PROGRESS", "WIN", "FAIL"]  */}
      <select {...register("game_data.status")}>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="WIN">WON</option>
        <option value="FAIL">LOST</option>
      </select>
      {errors.game_data?.status && <span>This field is required</span>}

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <label>Hard Mode</label>
        <input type="checkbox" {...register("game_data.hardMode")} />

        <label>Is Playing Archive</label>
        <input type="checkbox" {...register("game_data.isPlayingArchive")} />
      </div>
      <h2>Legacy Statistics</h2>
      <label>Games Played</label>
      <input
        type="number"
        defaultValue={300}
        {...register("game_data.setLegacyStats.gamesPlayed", {
          required: true,
        })}
      />
      {errors.game_data?.setLegacyStats?.gamesPlayed && (
        <span>This field is required</span>
      )}

      <label>Games Won</label>
      <input
        type="number"
        defaultValue={40}
        {...register("game_data.setLegacyStats.gamesWon", { required: true })}
      />
      {errors.game_data?.setLegacyStats?.gamesWon && (
        <span>This field is required</span>
      )}

      <h2>Guess Distribution</h2>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        {Object.entries({ 1: 650, 2: 0, 3: 1, 4: 1, 5: 0, 6: 1, fail: 0 }).map(
          ([key, value]) => (
            <div key={key}>
              <label>Guesses on Attempt {key} </label>
              <input
                type="number"
                {...register(`game_data.setLegacyStats.guesses.${key}`)}
              />
            </div>
          )
        )}
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        <label>Current Streak</label>
        <input
          type="number"
          defaultValue={40}
          {...register("game_data.setLegacyStats.currentStreak")}
        />

        <label>Max Streak</label>
        <input
          type="number"
          defaultValue={2}
          {...register("game_data.setLegacyStats.maxStreak")}
        />

        <label>Last Won Day Offset</label>
        <input
          type="number"
          defaultValue={1052}
          {...register("game_data.setLegacyStats.lastWonDayOffset")}
        />
      </div>

      {/* advanced div hidden by default */}
      {/* button to show advanced section */}
      <button
        type="button"
        style={{
          width: "fit-content",
          margin: "auto",
          padding: "0.5rem",
          cursor: "pointer",
          borderRadius: "0.5rem",
          border: "none",
          backgroundColor: "#d3d3d2",
          color: "white",
        }}
        onClick={() => {
          showAdvanced(!advanced);
        }}
      >
        Advanced
      </button>

      <div
        style={{
          display: advanced ? "grid" : "none",
          gap: "1rem",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        <label>Puzzle ID</label>
        <input
          {...register("puzzle_id", {
            required: true,
          })}
        />
        {errors.puzzle_id && <span>This field is required</span>}

        <label>Schema Version</label>
        <input
          {...register("schema_version", {
            required: true,
          })}
        />
        {errors.schema_version && <span>This field is required</span>}
      </div>

      <input type="submit" />
    </form>
  );
};
