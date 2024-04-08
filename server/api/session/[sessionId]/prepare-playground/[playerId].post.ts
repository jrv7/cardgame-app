import {useApiPost} from "~/composables/useApiFetch";

const prepareSessionOnBack = async (sessionId, playerId, requestBody, headers) => {
  return new Promise((resolve, reject) => {
    useApiPost(`/session/${sessionId}/prepare-player/${playerId}`, requestBody, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e)
      })
  })
}
export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'sessionId');
  const playerId = parseInt(getRouterParam(event, 'playerId') ?? '0');
  const gameDb = useStorage(`cache-db:game-${sessionId}`);

  let headers = {}
  let requestBody;

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  let overlapTrigger:any = null;

  return new Promise((resolve, reject) => {
    overlapTrigger = setInterval(() => {
      gameDb.getItem(`updating`)
        .then((isUpdating) => {

          if (!isUpdating) {
            gameDb.setItem(`updating`, true)
              .then(() => {
                clearInterval(overlapTrigger);

                gameDb.getItem(`settings`)
                  .then((response) => {
                    if (response) {
                      let currentSettings = JSON.parse(JSON.stringify(response));
                      const commander = currentSettings?.players?.find(pl => pl.player.id === playerId)?.deck?.primaryCard;
                      const cmdPartner = currentSettings?.players?.find(pl => pl.player.id === playerId)?.deck?.secondaryCard;

                      // Set Player
                      let currentPlayer = currentSettings?.players?.find(pl => pl.player.id === playerId);
                      if (currentPlayer) {
                        currentPlayer.player.Life = 40;
                        currentPlayer.player.counters = {
                          poison: 0,
                          experience: 0,
                          energy: 0,
                          ticket: 0
                        };
                        currentSettings.players = [currentPlayer, ...currentSettings.players.filter(pl => pl.player.id !== playerId)];
                      }

                      // Set commander
                      if (commander) {
                        let currentCommander = currentSettings?.playersCommanders?.find(cmd => cmd.playerId === playerId);
                        if (!currentCommander) {
                          if (!currentSettings?.playersCommanders) {
                            currentSettings.playersCommanders = [];
                          }
                          currentSettings.playersCommanders.push({playerId: playerId, commander: commander, partner: cmdPartner});
                        }
                      }

                      // Set CommanderZones
                      const playerCommandZone = currentSettings.playersCmdZones?.find(grd => grd.playerId === playerId);
                      if (!playerCommandZone) {
                        if (!currentSettings.playersCmdZones) {
                          currentSettings.playersCmdZones = [];
                        }
                        currentSettings.playersCmdZones.push({playerId: playerId, cmdZone: {commanderSummons: 0, partnerSummons: 0, commanderSummoned: false, partnerSummoned: false}});
                      }

                      // Set graveyard
                      const playerGraveyard = currentSettings.playersGraveyards?.find(grd => grd.playerId === playerId);
                      if (!playerGraveyard) {
                        if (!currentSettings.playersGraveyards) {
                          currentSettings.playersGraveyards = [];
                        }
                        currentSettings.playersGraveyards.push({playerId: playerId, graveyard: []});
                      }

                      // Set exile
                      const playerExile = currentSettings.playersExiles?.find(grd => grd.playerId === playerId);
                      if (!playerExile) {
                        if (!currentSettings.playersExiles) {
                          currentSettings.playersExiles = [];
                        }
                        currentSettings.playersExiles.push({playerId: playerId, exile: []});
                      }

                      // Set tables
                      const playerTable = currentSettings.playersTables?.find(grd => grd.playerId === playerId);
                      if (!playerTable) {
                        if (!currentSettings.playersTables) {
                          currentSettings.playersTables = [];
                        }
                        currentSettings.playersTables.push({playerId: playerId, table: []});
                      }

                      gameDb.setItem(`settings`, currentSettings)
                        .then(() => {
                          prepareSessionOnBack(sessionId, playerId, {session: currentSettings}, headers)
                            .then((respBack) => {
                              resolve(response);
                            })
                            .catch(() => {
                              reject('Could not update session on Back');
                            })
                            .finally(() => {
                              gameDb.setItem(`updating`, false);
                            })
                        })
                    } else {
                      prepareSessionOnBack(sessionId, playerId, requestBody, headers)
                        .then(() => {
                          resolve(response);
                        })
                        .catch(() => {
                          reject('Could not update session on Back');
                        })
                        .finally(() => {
                          gameDb.setItem(`updating`, false);
                        })
                    }
                  })
              })
          }
        })
    }, 1000);
  })
})