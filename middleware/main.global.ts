
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/auth/login') {
    console.log('01 Ignoring on Login page');
    return true;
  }

  if (!process.server) {
    if (to.path === '/') {
      return navigateTo('/cards');
    }
  }
})