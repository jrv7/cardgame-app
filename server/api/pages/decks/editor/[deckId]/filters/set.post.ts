
export default defineEventHandler(async (event) => {
  const deckId = getRouterParam(event, 'deckId');
  const requestControlDb = useStorage(`cache-db:deck-${deckId}-page-filters`);
  let requestBody:{requestHash:string};

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  return requestControlDb.setItem('filters', requestBody);
})