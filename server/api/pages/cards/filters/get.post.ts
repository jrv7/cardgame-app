
export default defineEventHandler(async (event) => {
  const requestControlDb = useStorage('cache-db:card-list-page-filters');
  return requestControlDb.getItem('filters');
})