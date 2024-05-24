export const NotWordleTab = () => {
  return (
    <div
      style={{
        minWidth: "300px",
      }}
    >
      <p>
        It looks like you're not on the Wordle tab. Go to Wordle to edit the
        stats.
      </p>
      <button
        onClick={() => {
          //check if wordle tab is open and go to it otherwise open a new tab
          chrome.tabs.query(
            { url: "*://www.nytimes.com/games/wordle/*" },
            (tabs) => {
              if (tabs.length > 0) {
                chrome.tabs.update(tabs[0].id, { active: true });
              } else {
                chrome.tabs.create({
                  url: "https://www.nytimes.com/games/wordle/index.html",
                });
              }
            }
          );
        }}
      >
        Go to Wordle
      </button>
    </div>
  );
};
