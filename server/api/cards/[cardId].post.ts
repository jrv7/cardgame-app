import {fetchCardDetails} from "~/server/composables/cards/Functions";

export default defineEventHandler(async (event) => {
  const cardId = getRouterParam(event, 'cardId');
  const localDb = useStorage('cache-db:cards');

  let headers = {}
  let requestBody;

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  return fetchCardDetails(localDb, cardId, requestBody, headers);
})