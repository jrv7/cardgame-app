import {useApiPost} from "~/composables/useApiFetch";

export const fetchCardDetails = async (localDb, cardId, requestBody = null, headers = null) => {
  const localDbCardsToFetch = useStorage('cache-db:cards-to-fetch');

  return new Promise((resolve, reject) => {
      useApiPost(`/cards/${cardId}`, requestBody, headers)
        .then((response) => {
          localDb.setItem(`card--${cardId}`, response);
          resolve(response);
        })
        .catch((e) => {
          console.log('API error', e);
          reject(e);
        });
  })
}
export const fetchCardList = async (localDb, requestBody, headers, localDbCards = null, currentPage = 1) => {
  let _requestBody = JSON.parse(JSON.stringify(requestBody));

  return new Promise((resolve, reject) => {
    useApiPost('/cards', _requestBody, headers)
      .then((response) => {
        if (response.success) {
          resolve(response);

          const cardList = response.data.results.map(i => i.id);
          useApiPost('/cards/build-cache', {page: 1, pageSize: cardList.length, cardList: cardList}, headers);

          // if ((response.data.page) < 20 && (response.data.page < response.data.pages)) {
          //   let new_requestBody = JSON.parse(JSON.stringify(_requestBody));
          //   new_requestBody.page = (_requestBody.page + 1);
          //   fetchCardList(localDb, new_requestBody, headers);
          // }
        }
      })
      .catch((e) => {
        console.log('API error', e);
        reject(e);
      });
  })
}