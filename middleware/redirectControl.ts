
export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('Middleware: redirectControl', useOauthState().value);
  if (useOauthState().value?.client?.session && parseInt(useOauthState().value?.client?.sessionState) === 1) {
    /*
        code=43a54610885300c8925b76767e22b33c38528a49c1c9db9393603f1167e6399b
        state=764bff7f3e96f82c1db2cf4071a47a80
        session_state=1l9nl16O3OH6%2BczWvROKA1%2BN5pRdclsYzGKLs1raotk%3D.RC9QbWlCcU1iWG1nUVlLSnhiQ0NHTWljT2pYQTViRUNtWlovNy83bDFJQVdvQTQraE1DY1NoNjh1MWRoTjFwNFBvenJZbENOcXEwOFoxcTlPTWFGY2ZrcXZCT1VLLzBIcjZkOWVzV1Z5TWs9

        code=useOauthState().value?.client.session
        state=useOauthState().value?.client.requestState
        session_state=useOauthState().value?.client.sessionStateUid
     */
    window.location.href = `${useOauthState().value?.client.requestCallbackUrl}?code=${useOauthState().value?.client.session}&state=${useOauthState().value?.client.requestState}&session_state=${useOauthState().value?.client.sessionStateUid}`;
    console.log('Session ready. Must redirect', useOauthState().value?.client)
  }
});