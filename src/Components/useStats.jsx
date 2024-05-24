import { createContext, useState, useEffect } from "react";

//get the state of the API and save it and export it in a context
export const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);

  async function getUser() {
    const data = await fetch(
      "https://samizdat-graphql.nytimes.com/graphql/v2",
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json, application/json",
          "nyt-app-type": "games-phoenix",
          "nyt-app-version": "1.0.0",
          "nyt-token":
            "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiKjdfob/ixNCvLETwnQ3AalkGSm9NX4gcRbOudrtHmBmIJbWb8Xgu3QH516Edr1qD7A+w+5d0p/WsNCpWDLrqfjTIwMft+jtOQG44l7akD9yi9Gaq/6hS3cuntkY25AYR3WtQPqrtxClX+qQdhMmzlA0sRAXKM8dSbIpsNV9uUOclt3JwB4omwFGj4J+pqzsfYZfB/tlx+BPGjCYGNcZ9O9UvtCpLRLgCJmTugL6V/U581gY8mqp+22aVjbEJik+F0j8xTNSxCOV2PLMpNrRSiDZ8FaKtq8ap/HPey5M7qYZQqclfqsEJMXG/KE3PiaTIbO37caFa80FvzfV8MZw1wIDAQAB",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        credentials: "include",
        mode: "cors",
        referrerPolicy: "no-referrer",
        includeCredentials: true,
        body: JSON.stringify({
          operationName: "UserQuery",
          variables: {},
          query:
            "query UserQuery {       user {         profile {           email         }         userInfo {           regiId           subscriptions         }         subscriptionDetails {           subscriptionName           startDate           status           entitlements         }       }     }   ",
        }),
      }
    );
    const response = await data.json();
    setUser(response);
  }

  async function getStats() {
    const data = await fetch("https://www.nytimes.com/svc/games/state");
    const response = await data.json();
    setStats(response);
  }

  //get user first
  useEffect(() => {
    getUser();
  }, []);

  //get stats
  useEffect(() => {
    if (!user) return;
    getStats();
  }, [user]);

  return (
    <StatsContext.Provider value={{ stats, setStats, user, setUser }}>
      {children}
    </StatsContext.Provider>
  );
};
