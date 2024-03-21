import {OauthClientType, OauthQueryStringType} from "~/composables/customTypes/OauthClientType";
import {useLocalApiPost} from "~/composables/useApiFetch";
import {errorHandler} from "ioredis/built/redis/event_handler";

export const useConsts = () => {
  return {
    SORT_ORDER_NONE: '',
    SORT_ORDER_UP: 'up',
    SORT_ORDER_DOWN: 'down',
    // Environments
    ENV_DEVELOPMENT: 'dev',
    ENV_INTEGRATION: 'int',
    ENV_RECETTE: 'rec',
    ENV_PREPRODUCTION: 'pre',
    ENV_PRODUCTION: 'pro',
  }
}