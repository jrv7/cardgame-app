import {useApiPost} from "~/composables/useApiFetch";

const updateSessionOnBack = async (sessionId, requestBody, headers) => {
  return new Promise((resolve, reject) => {
    useApiPost(`/session/${sessionId}`, requestBody, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e)
      })
  })
}
export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'sessionId');
  const playerId = getRouterParam(event, 'playerId');
  const gameDb = useStorage(`cache-db:game-${sessionId}`);

  let headers = {}
  let requestBody;

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  let overlapTrigger:any = null;

  return new Promise((resolve, reject) => {
    overlapTrigger = setInterval(() => {
      gameDb.getItem(`updating`)
        .then((isUpdating) => {

          if (!isUpdating) {
            gameDb.setItem(`updating`, true)
              .then(() => {
                clearInterval(overlapTrigger);

                gameDb.getItem(`settings`)
                  .then((response) => {
                    if (response) {
                      let currentSettings = JSON.parse(JSON.stringify(response));
                      if (!currentSettings.playersHands?.find(i => i.playerId === parseInt(playerId))) {
                        if (!currentSettings.playersHands) {
                          currentSettings.playersHands = [];
                        }

                        currentSettings.playersHands.push({playerId: parseInt(playerId), hand: requestBody.hand});
                      }

                      if (!currentSettings.playersDecks?.find(i => i.playerId === parseInt(playerId))) {
                        if (!currentSettings.playersDecks) {
                          currentSettings.playersDecks = [];
                        }

                        currentSettings.playersDecks.push({playerId: parseInt(playerId), deck: requestBody.deck});
                      }

                      gameDb.setItem(`settings`, currentSettings)
                        .then(() => {
                          updateSessionOnBack(sessionId, {session: currentSettings}, headers)
                            .then(() => {
                              resolve(response);
                            })
                            .catch(() => {
                              reject('Could not update session on Back');
                            })
                            .finally(() => {
                              gameDb.setItem(`updating`, false);
                            })
                        })
                    } else {
                      updateSessionOnBack(sessionId, requestBody, headers)
                        .then(() => {
                          resolve(response);
                        })
                        .catch(() => {
                          reject('Could not update session on Back');
                        })
                        .finally(() => {
                          gameDb.setItem(`updating`, false);
                        })
                    }
                  })
              })
          }
        })
    }, 1000);
  })
})