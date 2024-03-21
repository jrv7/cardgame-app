export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.server) {
    return abortNavigation()
  }
});