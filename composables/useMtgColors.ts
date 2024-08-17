import {useMtgState} from "~/composables/states";

export const useMtgColors = () => {
  const mtgState = useMtgState();

  return {
    get: () => {
      return mtgState.value.colors;
    },
    fetch: async () => {
      return new Promise((resolve, reject) => {
        useLocalApiPost('/scryfall/symbology')
          .then(({data}:{}[]) => {
            mtgState.value.scryfallSymbols = data;

            useLocalApiPost('/colors')
              .then((response) => {
                if (response.success && response.data?.results) {
                  mtgState.value.apiColors = response.data?.results;

                  mtgState.value.colors = [
                    ...response.data?.results,
                    {
                      id:100,
                      code: 'C',
                      mtgCode: '{C}',
                      name:'colorless',
                      url: 'https://svgs.scryfall.io/card-symbols/C.svg'
                    }
                  ].map(i => {
                    const scryfallMana = mtgState.value.scryfallSymbols.find(j => j.symbol === i.mtgCode && j.represents_mana);
                    return {
                      id: i.id,
                      code: i.mtgCode,
                      simpleCode: i.code,
                      name: i.name,
                      url: scryfallMana?.svg_uri ?? i.url
                    }
                  });
                }
              })

            resolve(true);
          })
          .catch((e) => {
            console.log('CardgameAPI::Could not fetch from Scryfall');
            reject(false);
          })
      })
    }
  }
}