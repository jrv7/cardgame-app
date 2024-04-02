
export default defineEventHandler(async (event) => {
  const deckId = getRouterParam(event, 'deckId');
  const requestControlDb = useStorage(`cache-db:deck-${deckId}-page-filters`);
  return requestControlDb.getItem('filters');
})