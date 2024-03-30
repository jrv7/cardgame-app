
export default defineEventHandler(async (event) => {
  const requestControlDb = useStorage('cache-db:deck-page-settings');
  return requestControlDb.getItem('settings');
})