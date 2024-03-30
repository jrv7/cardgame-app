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

  return new Promise((resolve, reject) => {
    useApiPost('/colors')
      .then((response) => {
        if (response.success) {
          resolve(response);
        } else {
          console.log('API error: no response', response);
          reject(response);
        }
      })
      .catch((e) => {
        console.log('API error', e);
        reject(e);
      });
  })
})