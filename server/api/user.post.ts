import {useApiPost} from "~/composables/useApiFetch";

export default defineEventHandler(async (event) => {
  const apiCookies = parseCookies(event);

  let headers = {}

  if (apiCookies?.managerSession) {
    headers.Authorization = `Bearer ${apiCookies?.managerSession}`
  }

  return new Promise((resolve, reject) => {
    useApiPost('/manager/user', {}, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        console.log('API error', e);
        reject(e);
      });
  })
})