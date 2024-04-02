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
    // localDb.getItem(`deck--${deckId}-cards`)
    //   .then((cards) => {
    //     if (cards) {
    //       new Promise(() => {
    //         resolve(cards);
    //       })
    //     } else {
          useApiPost(`/decks/${deckId}/cards`, requestBody, headers)
            .then((response) => {
              // localDb.setItem(`deck--${deckId}-cards`, response);
              resolve(response);
            })
            .catch((e) => {
              console.log('API error', e);
              reject(e);
            });
      //   }
      // })
  })
})