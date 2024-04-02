
export default defineEventHandler(async (event) => {
  const requestControlDb = useStorage('cache-db:card-list-page-settings');
  return requestControlDb.getItem('settings');
})