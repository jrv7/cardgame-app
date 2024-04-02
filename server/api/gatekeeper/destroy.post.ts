
export default defineEventHandler(async (event) => {
  const requestControlDb = useStorage('cache-db:request-control');
  const pageSettingsCardListDb = useStorage('cache-db:card-list-page-settings');
  const pageFiltersCardListDb = useStorage('cache-db:card-list-page-filters');
  const pageSettingsDeckListDb = useStorage('cache-db:deck-page-settings');
  const pageSettingsDeckEditorDb = useStorage('cache-db:deck-editor-page-settings');
  console.log('Destroying Gatekeeper MemDB');

  return new Promise((resolve) => {
    requestControlDb.clear();
    pageSettingsCardListDb.clear();
    pageFiltersCardListDb.clear();
    pageSettingsDeckListDb.clear();
    pageSettingsDeckEditorDb.clear();

    resolve(true);
  })
})