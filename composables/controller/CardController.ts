import {CardInterface} from "~/composables/entity/CardInterface";
import {CollectionSet} from "~/composables/entity/CollectionSet";
import {ImageCollection} from "~/composables/entity/ImageCollection";


export class CardController {
  private readonly Card:CardInterface;

  constructor(card:CardInterface) {
    this.Card = card;
  }
  getCard():CardInterface {
    return this.Card;
  }
  async fetchMeta() {
    return new Promise((resolve, reject) => {
      useDynamicPost(`/cards/${this.Card.getId()}`)
        .then((response) => {
          this.Card.setCollectionSet(new CollectionSet(response.data.collectionSet));
          this.Card.setCollectionSets(response.data.collectionSets.map(i => {
            return new CollectionSet(i);
          }));
          this.Card.setImageCollection(response.data.imageCollection.map(i => {
            return new ImageCollection(i);
          }));

          resolve();
        })
        .catch(() => {
          console.error('Could not fetch card metadata');
          reject();
        })
    })
  }
}