import {DeckInterface} from "~/composables/entity/DeckInterface";

export class DeckController {
  private Deck:DeckInterface;

  constructor(deck:DeckInterface|null) {
    if (deck) {
      this.Deck = deck;
    }
  }
  setDeck(deck:DeckInterface):void {
    this.Deck = deck;
  }
  getDeck():DeckInterface {
    return this.Deck;
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