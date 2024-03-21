import {Ref} from "preact/compat";
import {UnwrapRef} from "vue";
import {OauthClientType} from "~/composables/customTypes/OauthClientType";

export const useGlobalState = () => useState(() => {
  return {
    loading: false,
    loadTimer: null,
    modals: [],
    pageActions: null,
    theme: 'light',
    scrollingLocked: 0,
    blurReactiveComponents: [],
    missingTranslations: []
  }
});

export const useOauthState = () => useState(() => {
  const defaultClientState:OauthClientType = {
    clientId: null,
    clientSecret: null,
    name: null,
    allowedLoginUrls: null,
    allowedLogoutUrls: null,
    session: null,
    sessionState: 0,
    sessionStateUid: null
  }

  return {
    client: defaultClientState
  }
});