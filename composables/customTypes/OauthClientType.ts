import {integer} from "vscode-languageserver-types";

export type OauthClientType = {
  clientId: string | null,
  clientSecret?: string | null,
  name?: string | null,
  allowedLoginUrls?: string[] | null,
  allowedLogoutUrls?: string[] | null,
  portalConfigs?: {}[] | null
  session?: string | null,
  userUid?: string | null,
  userData?: string | null,
  sessionState?: number | null,
  sessionStateUid?: string | null,
  requestCallbackUrl?: string | null,
  requestState?: string | null,
  requestNonce?: string | null,
};

export type OauthQueryStringType = {
  clientId:string,
  state?:string,
  nonce?:string,
  redirectUri?:string,
  responseType?:string,
  scope?:string,
  acrValues?:string,
}