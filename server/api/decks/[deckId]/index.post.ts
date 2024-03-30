import {useApiPost} from "~/composables/useApiFetch";

export default defineEventHandler(async (event) => {
  const deckId = getRouterParam(event, 'deckId');
  const localDb = useStorage('cache-db:decks');

  let headers = {}
  let requestBody;

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  return new Promise((resolve, reject) => {
    localDb.getItem(`deck--${deckId}`)
      .then((response) => {
        if (response) {
          new Promise(() => {
            resolve(response);
          })
        } else {
          useApiPost(`/decks/${deckId}`, requestBody, headers)
            .then((response) => {
              localDb.setItem(`deck--${deckId}`, response);
              resolve(response);
            })
            .catch((e) => {
              console.log('API error', e);
              reject(e);
            });
        }
      })
  })
})