import {useApiPost} from "~/composables/useApiFetch";

export default defineEventHandler(async (event) => {
  const apiCookies = parseCookies(event);

  let headers = {}
  let requestBody

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  console.log('APP server: Requesting cards');

  return new Promise((resolve, reject) => {
    useApiPost('/cards', requestBody, headers)
      .then((response) => {
        console.log('APP server: Requesting cards', response);
        resolve(response);
      })
      .catch((e) => {
        console.log('API error', e);
        reject(e);
      });
  })
})