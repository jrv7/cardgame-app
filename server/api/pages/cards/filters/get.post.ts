
export default defineEventHandler(async (event) => {
  const requestControlDb = useStorage('cache-db:card-page-filters');
  return requestControlDb.getItem('filters');
})