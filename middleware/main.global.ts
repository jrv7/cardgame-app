
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/auth/login') {
    console.log('01 Ignoring on Login page');
    return true;
  }

  const mtgState = useMtgState();

  if (!process.server) {
    if (!mtgState.value.colors?.length) {
      await useMtgColors().fetch();
    }
    if (to.path === '/') {
      return navigateTo('/cards');
    }
  }
})