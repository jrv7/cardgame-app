import {GameInterface} from "~/composables/entity/GameInterface";

export class GameController {
  private Game:GameInterface;

  constructor(game:GameInterface|null) {
    if (game) {
      this.Game = game;
    }
  }
  setGame(game:GameInterface):void {
    this.Game = game;
  }
  getGame():GameInterface {
    return this.Game;
  }
  async fetchMeta() {
    return new Promise((resolve, reject) => {
      console.log('Loading deck meta data')
      resolve('nothing');
      // useDynamicPost(`/cards/${this.Card.getId()}`)
      //   .then((response: { data:CardType, success:boolean }) => {
      //     this.Card.transformFromObject(response.data);
      //     resolve();
      //   })
      //   .catch(() => {
      //     console.error('Could not fetch card metadata');
      //     reject();
      //   })
    })
  }
}