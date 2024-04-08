import {useApiPost} from "~/composables/useApiFetch";

export default defineEventHandler(async (event) => {
  let headers = {}
  let requestBody

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  return new Promise((resolve, reject) => {
    useApiPost('/games/last-or-new', requestBody, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        console.log('API error', e);
        reject(e);
      });
  })
})