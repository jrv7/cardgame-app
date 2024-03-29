
export default defineEventHandler(async (event) => {
  const requestControlDb = useStorage('cache-db:request-control');
  const requestId = parseInt(getRouterParam(event, 'requestId')!);

  let headers = {}
  let requestBody:{requestHash:string};

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  return new Promise((resolve, reject) => {
    requestControlDb.getItem(`req::${requestBody.requestHash}`)
      .then((dbItem) => {
        if (requestId === dbItem) {
          requestControlDb.removeItem(`req::${requestBody.requestHash}`)
            .then(() => {
              resolve({
                requestBody: requestBody,
                controlItem: dbItem,
                success: true
              });
            })
            .catch((e) => {
              console.log('GateKeeper::resolve::MemDB Error on setItem:', e);
              reject(e);
            })
        } else {
          resolve({
            message: 'Could not resolve request id',
            controlItem: dbItem,
            success: false
          });
        }
      })
      .catch((e) => {
        console.log('GateKeeper::resolve::MemDB Error on getItem:', e);
        reject(e);
      })
  })
})