
export default defineNuxtRouteMiddleware(async (to, from) => {

  const oauthHandler = useOauthServerHandler();

  if (!process.server) {
    if (
      !to.query.hasOwnProperty('client_id') ||
      !to.query.hasOwnProperty('state') ||
      !to.query.hasOwnProperty('nonce') ||
      !to.query.hasOwnProperty('redirect_uri') ||
      !to.query.hasOwnProperty('response_type') ||
      !to.query.hasOwnProperty('scope') ||
      !to.query.hasOwnProperty('acr_values')
    ) return navigateTo('/invalid-client')

    const dataBody:OauthQueryStringType = {
      clientId: to.query.client_id,
      state: to.query.state,
      nonce: to.query.nonce,
      redirectUri: to.query.redirect_uri,
      responseType: to.query.response_type,
      scope: to.query.scope,
      acrValues: to.query.acr_values,
    };

    await oauthHandler.validateClientRights(dataBody)
      .then((client) => {
        console.log('Client rights check:', client);
      })
      .catch((error) => {
        return false;
      })
  }
});