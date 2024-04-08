import {CardInterface, CardType} from "~/composables/entity/CardInterface";
import {CollectionSet} from "~/composables/entity/CollectionSet";
import {ImageCollection} from "~/composables/entity/ImageCollection";


export class CardController {
  private Card:CardInterface;

  constructor(card:CardInterface|null) {
    if (null !== card) {
      this.Card = card;
    }
  }
  setCard(value:CardInterface):void {
    this.Card = value;
  }
  getCard():CardInterface {
    return this.Card;
  }
  async fetchMeta() {
    return new Promise((resolve, reject) => {
      useDynamicPost(`/cards/${this.Card.getId()}`)
        .then((response: { data:CardType, success:boolean }) => {
          this.Card.transformFromObject(response.data);
          resolve();
        })
        .catch(() => {
          console.error('Could not fetch card metadata');
          reject();
        })
    })
  }
}