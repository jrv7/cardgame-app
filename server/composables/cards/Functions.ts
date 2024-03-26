import {useApiPost} from "~/composables/useApiFetch";

export const fetchCardDetails = async (localDb, cardId, requestBody = null, headers = null) => {
  const localDbCardsToFetch = useStorage('cache-db:cards-to-fetch');

  return new Promise((resolve, reject) => {
    localDb.getItem(`card--${cardId}`)
      .then((response) => {
        if (response) {
          new Promise(() => {
            console.log('Loaded from local DB');
            resolve(response);
          })
        } else {
          localDbCardsToFetch.getItem('list')
            .then((list:array) => {
              if (list && list.length) {
                if (list.includes(cardId)) {
                  list = list.filter(i => i !== cardId);
                }
              }

              useApiPost(`/cards/${cardId}`, requestBody, headers)
                .then((response) => {
                  localDb.setItem(`card--${cardId}`, response);
                  resolve(response);

                  if (list && list.length) {
                    const nextCard = list[0];
                    list = list.filter(i => i !== nextCard);
                    localDbCardsToFetch.setItem('list', list);
                    fetchCardDetails(localDb, nextCard);
                  }
                })
                .catch((e) => {
                  console.log('API error', e);
                  reject(e);
                });
            })
        }
      })
  })
}
export const fetchCardList = async (localDb, requestBody, headers, localDbCards = null, currentPage = 1) => {
  const headerHash = btoa(JSON.stringify(requestBody));
  let _requestBody = JSON.parse(JSON.stringify(requestBody));
  let requestInterval = 10;
  const localDbCardsToFetch = useStorage('cache-db:cards-to-fetch');

  return new Promise((resolve, reject) => {
    localDb.getItem(`page--${headerHash}`)
      .then((response) => {
        if (response) {
          new Promise(() => {
            resolve(response);
          })
        } else {
          new Promise(() => {
            useApiPost('/cards', _requestBody, headers)
              .then((response) => {
                localDb.setItem(`page--${headerHash}`, response);
                resolve(response);

                if (null !== localDbCards) {
                  localDbCardsToFetch.getItem('list')
                    .then((list:array) => {
                      if (list) {
                        const isEmpty = !list.length;
                        if (response.success && response.data?.results?.length) {
                          let firstCard:number|null = null;
                          response.data?.results.forEach(card => {
                            if (!firstCard) {
                              firstCard = card.id;
                            }

                            if (!list.includes(card.id)) {
                              list.push(card.id);
                            }
                          })

                          localDbCardsToFetch.setItem('list', list)
                            .then(() => {
                              if (isEmpty) {
                                fetchCardDetails(localDbCards, firstCard);
                              }
                            })
                        }
                      }
                    })
                }

                // Request next page when available
                if (currentPage < 10 && response.success && response?.data?.pages && (response?.data?.page < response?.data?.pages)) {
                  _requestBody.page++;
                  if (_requestBody.page >= 5) {
                    requestInterval = 10000;
                  }
                  setTimeout(() => {
                    fetchCardList(localDb, _requestBody, headers, localDbCards, _requestBody.page);
                  }, requestInterval);
                }
              })
              .catch((e) => {
                console.log('API error', e);
                reject(e);
              });
          })
        }
      })
  })
}