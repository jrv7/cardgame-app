import {useApiPost} from "~/composables/useApiFetch";

export default defineEventHandler(async (event) => {
  let requestBody

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  const sessionCode = getCookie(event, 'sessioncode');
  const languageCookie = getCookie(event, 'i18n_redirected') ?? 'en-US';

  let apiRequestBody = {
    ...requestBody,
    locale: languageCookie
  }

  if (sessionCode && sessionCode !== 'null') {
    apiRequestBody.sessionCode = sessionCode;
  }

  return new Promise((resolve, reject) => {
    useApiPost('/login/validate', apiRequestBody)
      .then((response) => {
        console.log('Login response:', response);
        if (response.data?.sessionCode) {
          console.log('setting cookie::', response.data.sessionCode);
          setCookie(event, 'sessioncode', response.data.sessionCode);
        } else {
          console.log('No cookie to set');
        }
        resolve(response);
      })
      .catch((e) => {
        console.log('API error', e);
        reject(e);
      });
  })
})