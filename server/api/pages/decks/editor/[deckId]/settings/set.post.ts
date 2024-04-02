
export default defineEventHandler(async (event) => {
  const requestControlDb = useStorage('cache-db:deck-editor-page-settings');
  let requestBody:{requestHash:string};

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  return requestControlDb.setItem('settings', requestBody);
})