import {useApiPost} from "~/composables/useApiFetch";

export default defineEventHandler(async (event) => {
  let requestBody

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  let apiRequestBody = {
    ...requestBody
  }

  return new Promise((resolve, reject) => {
    useApiPost('/relying-party/check-credentials', apiRequestBody)
      .then((response) => {
        console.log('Client rights response: ', response)
        if (response.success) {
          resolve(response);
        } else {
          // Set the status code to error according to response code
          setResponseStatus(event, response.code)
          // Set the status message as well
          setResponseStatus(event, response.code, response.message);
          setCookie(event, 'sessioncode', null);
          resolve(event);
        }
      })
      .catch((e) => {
        console.log('API error', e);
      });
  })
})