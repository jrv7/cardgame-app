
export default defineEventHandler(async (event) => {
  const requestControlDb = useStorage('cache-db:card-page-settings');
  return requestControlDb.getItem('settings');
})