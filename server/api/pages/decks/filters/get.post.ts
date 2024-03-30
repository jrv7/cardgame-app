
export default defineEventHandler(async (event) => {
  const requestControlDb = useStorage('cache-db:deck-page-filters');
  return requestControlDb.getItem('filters');
})