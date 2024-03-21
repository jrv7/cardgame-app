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
    useApiPost('/login/confirm-2fs-code', apiRequestBody)
      .then((response) => {
        if (response.success) {
          resolve(response);
        } else {
          // Set the status code to error according to response code
          setResponseStatus(event, response.code)
          // Set the status message as well
          setResponseStatus(event, response.code, response.message);
          resolve(event);
        }
      })
      .catch((e) => {
        console.log('API error', e);
        reject(e);
      });
  })
})