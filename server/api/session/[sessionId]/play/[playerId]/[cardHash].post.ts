import {useApiPost} from "~/composables/useApiFetch";
import {fetchCardDetails, fetchCardList} from "~/server/composables/cards/Functions";
import {GameSessionType} from "~/composables/customTypes/GameSessionType";
import {CardType} from "~/composables/entity/CardInterface";

export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'sessionId');
  const playerId = getRouterParam(event, 'playerId');
  const cardHash = getRouterParam(event, 'cardHash');
  const gameDb = useStorage(`cache-db:game-${sessionId}`);
  const localDbCards = useStorage('cache-db:cards');

  let headers = {}
  let requestBody;

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  let overlapTrigger:any = null;

  const currentPlayerId = parseInt(playerId!);

  return new Promise((resolve, reject) => {
    overlapTrigger = setInterval(() => {
      gameDb.getItem(`updating`)
        .then((isUpdating) => {
          if (!isUpdating) {
            gameDb.setItem(`updating`, true)
              .then(() => {
                clearInterval(overlapTrigger);

                gameDb.getItem(`settings`)
                  .then((Session:GameSessionType) => {
                    if (Session) {
                      /**
                       *
                       * Doc the magic!
                       */
                      const Player = Session.players.find(pl => pl.player.id === currentPlayerId);
                      let PlayerHand = Session.playersHands.find(hd => hd.playerId === currentPlayerId);
                      let PlayerTable = Session.playersTables.find(tb => tb.playerId === currentPlayerId);
                      const playedCard = PlayerHand.hand.find(cd => cd.cardHash === cardHash);
                      fetchCardDetails(localDbCards, playedCard.card)
                        .then((cardDetails:{success:boolean, data:CardType}) => {
                          const playedCard:CardType = cardDetails.data;
                          /**
                           *
                           * Check for necessity of going to the pile
                           * Ignore pile:
                           *    Type: Land
                           */
                          const isLand = !!playedCard.types!.find(tp => tp.name === 'Land');

                          if (!isLand) {
                            const currentDate = new Date();
                            const milliseconds = currentDate.getMilliseconds();
                            let spell = {
                              pileId: btoa(`${cardHash}${Player.player.id}${Session.thePile.length}${milliseconds}`),
                              spell: playedCard,
                              player: Player,
                              target: null
                            }

                            Session.thePile = [spell, ...Session.thePile];
                            // Do check for pile-locking spells
                            Session.pileLocked = false;
                          } else {
                            // Go directly to the table
                            PlayerTable.table = [...PlayerTable.table, playedCard];
                          }

                          PlayerHand.hand = PlayerHand.hand.filter(cd => cd.cardHash !== cardHash);
                          Session.playersHands = [...Session.playersHands.filter(ph => ph.playerId !== currentPlayerId), PlayerHand];
                          Session.playersTables = [...Session.playersTables.filter(pt => pt.playerId !== currentPlayerId), PlayerTable];

                          Session.interactionCounter++;

                          gameDb.setItem(`settings`, Session)
                            .then(() => {
                              gameDb.setItem(`updating`, false)
                                .then(() => {
                                  resolve(Session);
                                })
                            })
                        })




                    } else {
                      reject('Could not find game session to play the spell');
                      // useApiPost(`/session/${sessionId}`, requestBody, headers)
                      //   .then((sessionResponse) => {
                      //     let sessionData = sessionResponse.data;
                      //
                      //     if (!sessionData?.interactionCounter) {
                      //       sessionData.interactionCounter = 1;
                      //     }
                      //
                      //     gameDb.setItem(`settings`, sessionData);
                      //     resolve(sessionData);
                      //
                      //     if (sessionResponse.cards?.length) {
                      //       const preFetchCardsPagination = {
                      //         page: 1,
                      //         pageSize: 20,
                      //         filters: {
                      //           byIdList: sessionResponse.cards
                      //         }
                      //       }
                      //       fetchCardList(localDbList, preFetchCardsPagination, headers);
                      //     }
                      //   })
                      //   .catch((e) => {
                      //     console.log('Could not resolve game session', e);
                      //     reject(e);
                      //   })
                      //   .finally(() => {
                      //     gameDb.setItem(`updating`, false);
                      //   })
                    }
                  })
              })
          }
        })
    }, 1000)
  })
})