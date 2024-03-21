import {OauthClientType, OauthQueryStringType} from "~/composables/customTypes/OauthClientType";
import {useLocalApiPost} from "~/composables/useApiFetch";
import {errorHandler} from "ioredis/built/redis/event_handler";

export const useOauthServerHandler = () => {

  async function doDestroyLogInSession() {
    const clientState = useOauthState;
    return new Promise((resolve) => {
      const sessionCode = useCookie('sessioncode') ?? null;
      clientState().value.client.sessionState = 0;
      sessionCode.value = null;
      resolve(true);
    });
  }

  async function submitValidationCodeFormData(data: any){
    return new Promise((resolve, reject) => {
      const sessionCode = useCookie('sessioncode') ?? null;
      const languageCookie = useCookie('i18n_redirected') ?? 'en-US';
      // Fetch client from API
      let postBody = {
        clientId: useOauthState().value.client?.clientId,
        locale: languageCookie.value,
        validationCode: data.validationCode
      }

      if (sessionCode && sessionCode.value !== 'null') {
        postBody.sessionCode = sessionCode.value;
      }

      useLocalApiPost('/second-factor-validation-form-submit', postBody)
        .then((response) => {
          if (response.success) {
            useOauthState().value.client.sessionState = response.data?.sessionState;
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
        })
    });
  }

  async function submitLoginFormData(data:{email:string, password:string}) {
    return new Promise((resolve, reject) => {
      const sessionCode = useCookie('sessioncode') ?? null;
      const languageCookie = useCookie('i18n_redirected') ?? 'en-US';
      // Fetch client from API
      let postBody = {
        clientId: useOauthState().value.client?.clientId,
        locale: languageCookie.value,
        ...data
      }

      if (sessionCode && sessionCode.value !== 'null') {
        postBody.sessionCode = sessionCode.value;
      }

      useLocalApiPost('/login-form-submit', postBody)
        .then((response) => {
          if (response.success) {
            useOauthState().value.client.session = response.data?.sessionCode;
            useOauthState().value.client.sessionState = response.data?.sessionState;
            useOauthState().value.client.userUid = response.data?.userUid;
            useOauthState().value.client.userData = response.data?.userData;
            useOauthState().value.client.sessionState = response.data?.sessionState;
            sessionCode.value = response.data?.sessionCode;
            resolve(response.data);
          } else if (response.code === 502) {
            sessionCode.value = null;
            reject(response);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
        })
    });
  }

  async function setClientRights(data: OauthQueryStringType) {
    return new Promise((resolve, reject) => {
      const client:OauthClientType = ref({
        clientId: data.client_id
      })  as any;

      const sessionCode = useCookie('sessioncode') ?? null;
      const languageCookie = useCookie('i18n_redirected') ?? 'en-US';
      // Fetch client from API
      let postBody = {
        clientId: useOauthState().value.client?.clientId,
        locale: languageCookie.value,
        ...data
      }

      if (sessionCode && sessionCode.value !== 'null') {
        postBody.sessionCode = sessionCode.value;
      }

      // Fetch client from API
      useLocalApiPost('/client-warm-up', postBody)
        .then((response) => {
          if (response.success) {
            useOauthState().value.client = response.data?.client;
            useOauthState().value.client.session = response.data?.session?.sessionCode;
            useOauthState().value.client.sessionState = response.data?.session?.sessionState;
            useOauthState().value.client.userUid = response.data?.session?.userUid;
            useOauthState().value.client.userData = response.data?.session?.userData;
            useOauthState().value.client.sessionState = response.data?.session?.sessionState;
            useOauthState().value.client.sessionStateUid = response.data?.session?.sessionStateUid;
            useOauthState().value.client.requestCallbackUrl = data.redirectUri;
            useOauthState().value.client.requestState = data.state;
            useOauthState().value.client.requestNonce = data.nonce;
            resolve(response.data);
          } else {
            reject({error: response.code, message: response.message});
          }
        })
        .catch((error) => {
          console.log('oauth2ServerHandler error:', error);
          useOauthState().value.client = null;
          reject(error);
        })
    });
  }


  return {
    validateClientRights: setClientRights,
    doLogin: submitLoginFormData,
    doCodeValidation: submitValidationCodeFormData,
    destroySession: doDestroyLogInSession
  }
}