
export default defineEventHandler(async (event) => {
  const localDbSettings = useStorage('cache-db:global-settings');

  let headers = {}
  let requestBody

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  return new Promise((resolve, reject) => {
    switch (requestBody.setting) {
      case 'use-memory-databases': {
        localDbSettings.setItem('use-databases', requestBody.value)
          .then(() => {
            resolve('Ok');
          })
      } break;
    }
  })
})