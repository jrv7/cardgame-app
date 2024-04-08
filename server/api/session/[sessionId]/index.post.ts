import {useApiPost} from "~/composables/useApiFetch";
import {fetchCardList} from "~/server/composables/cards/Functions";

export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'sessionId');
  const gameDb = useStorage(`cache-db:game-${sessionId}`);
  const localDbList = useStorage('cache-db:card-list');

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
                      gameDb.setItem(`updating`, false)
                        .then(() => {
                          resolve(response);
                        })
                    } else {
                      useApiPost(`/session/${sessionId}`, requestBody, headers)
                        .then((sessionResponse) => {
                          let sessionData = sessionResponse.data;

                          if (!sessionData?.interactionCounter) {
                            sessionData.interactionCounter = 1;
                          }

                          gameDb.setItem(`settings`, sessionData);
                          resolve(sessionData);

                          if (sessionResponse.cards?.length) {
                            const preFetchCardsPagination = {
                              page: 1,
                              pageSize: 20,
                              filters: {
                                byIdList: sessionResponse.cards
                              }
                            }
                            fetchCardList(localDbList, preFetchCardsPagination, headers);
                          }
                        })
                        .catch((e) => {
                          console.log('Could not resolve game session', e);
                          reject(e);
                        })
                        .finally(() => {
                          gameDb.setItem(`updating`, false);
                        })
                    }
                  })
              })
          }
        })
    }, 1000)
  })
})