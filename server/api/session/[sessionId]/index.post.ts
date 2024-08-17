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
      useApiPost(`/session/${sessionId}`, requestBody, headers)
          .then((sessionResponse) => {
              resolve(sessionResponse);
          })
          .catch((e) => {
              console.log('Could not resolve game session', e);
              reject(e);
          })
          .finally(() => {
              gameDb.setItem(`updating`, false);
          })
  })
})