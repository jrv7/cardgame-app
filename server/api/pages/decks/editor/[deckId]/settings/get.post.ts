
export default defineEventHandler(async (event) => {
  const requestControlDb = useStorage('cache-db:deck-editor-page-settings');
  return requestControlDb.getItem('settings');
})