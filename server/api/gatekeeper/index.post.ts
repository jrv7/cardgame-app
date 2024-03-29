
export default defineEventHandler(async (event) => {
  const requestControlDb = useStorage('cache-db:request-control');

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
        if (null === dbItem) {
          const currentDate = new Date();
          const reId = currentDate.getMilliseconds();

          requestControlDb.setItem(`req::${requestBody.requestHash}`, reId)
            .then(() => {
              resolve({
                requestBody: requestBody,
                controlItem: dbItem,
                requestId: reId,
                success: true
              });
            })
            .catch((e) => {
              console.log('MemDB Error on setItem:', e);
              reject(e);
            })
        } else {
          resolve({
            message: `Duplicate request: ${dbItem}`,
            success: false
          });
        }
      })
      .catch((e) => {
        console.log('MemDB Error on getItem:', e);
        reject(e);
      })
  })
})