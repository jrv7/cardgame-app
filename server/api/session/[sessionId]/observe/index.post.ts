import {useApiPost} from "~/composables/useApiFetch";
import {fetchCardList} from "~/server/composables/cards/Functions";

export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'sessionId');
  const gameDb = useStorage(`cache-db:game-${sessionId}`);

  let headers = {}
  let requestBody;

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  return new Promise((resolve, reject) => {
    gameDb.getItem(`settings`)
      .then((response) => {
        if (response) {
          resolve(response);
        } else {
          useApiPost(`/session/${sessionId}`, requestBody, headers)
            .then((sessionResponse) => {
              gameDb.setItem(`settings`, sessionResponse.data);
              resolve(sessionResponse.data);
            })
            .catch((e) => {
              console.log('Could not resolve game session', e);
              reject(e);
            });
        }
      })
  })
})