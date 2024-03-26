import {fetchCardList} from "~/server/composables/cards/Functions";

export default defineEventHandler(async (event) => {
  const localDbList = useStorage('cache-db:card-list');
  const localDbCards = useStorage('cache-db:cards');
  const localDbCardsToFetch = useStorage('cache-db:cards-to-fetch');

  await localDbCardsToFetch.getItem('list')
    .then((items) => {
      if (!items) {
        console.log('Setting default cards-to-fetch list');
        localDbCardsToFetch.setItem('list', []);
      }
    })

  let headers = {}
  let requestBody

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  return fetchCardList(localDbList, requestBody, headers, localDbCards);
})