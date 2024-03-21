import {OauthClientType, OauthQueryStringType} from "~/composables/customTypes/OauthClientType";
import {useDynamicPost, useLocalApiPost} from "~/composables/useApiFetch";
import {errorHandler} from "ioredis/built/redis/event_handler";

export const useOauthServerHandler = () => {

  async function doDestroyLogInSession() {
    const settingsState = useSettingsState();
    const authState = useAuthState();
    const sessionCode = useCookie('managerSession') ?? null;

    return new Promise((resolve) => {
      sessionCode.value = null;
      settingsState.value = null;
      authState.value = {
        authenticated: false,
        user: {
          id: null,
          email: null,
          name: null,
          lastName: null,
          fullName: null,
          roles: []
        }
      }
      resolve(true);
    });
  }

  async function requestLogin(data:{username:string, password:string}) {
    return new Promise((resolve, reject) => {
      const sessionCode = useCookie('managerSession') ?? null;
      const langCookie = useCookie('i18n_redirected') ?? 'en-US';
      // Fetch client from API
      let postBody = {
        locale: langCookie.value,
        ...data
      }

      useDynamicPost('/login', postBody)
        .then((response) => {
          if (response.success) {
            sessionCode.value = response.data?.token;
            resolve(response);
          } else {
            sessionCode.value = null;
            reject(response.message);
          }
        })
        .catch((error) => {
          sessionCode.value = null;
          reject(error);
        })
    });
  }

  const requestSettings = async () => {
    const settingsState = useSettingsState();

    return new Promise((resolve, reject) => {
      useLocalApiPost('/portal-settings')
        .then((response) => {
          settingsState.value = response.data;
          resolve(response);
        })
        .catch((error) => {
          settingsState.value = null;
          reject(error);
        })
    });
  }

  const requestUserData = async () => {
    const authState = useAuthState();

    return new Promise((resolve, reject) => {
      useLocalApiPost('/user')
        .then((response) => {
          if (response.success) {
            authState.value.authenticated = true;
            authState.value.user = response.data

            resolve(response);
          } else {
            authState.value.authenticated = false;
            authState.value.user = { id: null, email: null, name: null, lastName: null, fullName: null, roles: [] };

            reject(response.message);
          }

        })
        .catch((error) => {
          authState.value.authenticated = false;
          authState.value.user = { id: null, email: null, name: null, lastName: null, fullName: null, roles: [] };

          reject('User data request failed');
        })
    });
  }

  const doAuthentication = async (data:{username:string, password:string}) => {
    await new Promise((resolve, reject) => {
      /**
       * Requesting user login
       */
      requestLogin(data)
        .then((loginResponse) => {
          setTimeout(() => {
            /**
             * Requesting Portal settings
             */
            requestSettings()
              .then((settingsResponse) => {
                /**
                 * Requesting user data after login
                 */
                requestUserData()
                  .then((userDataResponse) => {
                    resolve({
                      user: userDataResponse.data,
                      settings: settingsResponse.data,
                      sessionToken: loginResponse
                    })
                  })
                  .catch(() => {
                    reject('User data request failed');
                  })
              })
              .catch(() => {
                reject('Settings request failed');
              });
          }, 300);
        })
        .catch((error) => {
          reject(error);
        })
    })
  }

  const requestKeepAlive = async () => {
    const sessionCode = useCookie('managerSession') ?? null;
    console.log('Keeping session alive...');
    return new Promise((resolve, reject) => {
      useDynamicPost('/manager/keep-alive', {}, { Authorization: `Bearer ${sessionCode.value}`})
        .then((response) => {
          console.log('OK');
          resolve(response);
        })
        .catch((error) => {
          console.log('KO');
          doDestroyLogInSession();
          reject(error);
        })
    });
  }

  return {
    doLogin: doAuthentication,
    destroySession: doDestroyLogInSession,
    requestUserData: requestUserData,
    requestSettings: requestSettings,
    keepAlive: requestKeepAlive
  }
}