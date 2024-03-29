
export default defineEventHandler(async (event) => {
  const requestControlDb = useStorage('cache-db:request-control');
  console.log('Destroying Gatekeeper MemDB');
  return requestControlDb.clear();
})