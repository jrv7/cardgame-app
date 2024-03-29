import {useApiPost} from "~/composables/useApiFetch";

export default defineEventHandler(async (event) => {
  const localDbList = useStorage('cache-db:deck-list');

  let headers = {}
  let requestBody

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  const headerHash = btoa(JSON.stringify(requestBody));

  return new Promise((resolve, reject) => {
    localDbList.getItem(`page--${headerHash}`)
      .then((response) => {
        if (response) {
          new Promise(() => {
            console.log('Loaded from memory');
            resolve(response);
          })
        } else {
          useApiPost('/decks', requestBody, headers)
            .then((response) => {
              localDbList.setItem(`page--${headerHash}`, response);
              console.log('Loaded from API');
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