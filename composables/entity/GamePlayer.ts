import {EntityColumnType} from "~/composables/entity/EntityInterface";
import {GamePlayerInterface, GamePlayerType} from "~/composables/entity/GamePlayerInterface";
import {PlayerInterface} from "~/composables/entity/PlayerInterface";
import {DeckInterface} from "~/composables/entity/DeckInterface";
import {Player} from "~/composables/entity/Player";
import {Deck} from "~/composables/entity/Deck";

export class GamePlayer implements GamePlayerInterface {
  id:number = 0;
  player:PlayerInterface;
  deck:DeckInterface|null;

  private columns: {}[] = [
    'id',
    'player',
    'deck'
  ];

  constructor(cloneFrom: GamePlayerType | GamePlayerInterface | null = null) {
    if (null !== cloneFrom) {
      if (typeof cloneFrom.getId === 'undefined') {
        this.transformFromObject(cloneFrom);
      } else {
        // id: number;
        this.setId(cloneFrom.getId());
        // player;
        this.setPlayer(cloneFrom.getPlayer());
        // deck;
        this.setDeck(cloneFrom.getDeck());
      }
    }
  }

  // 'id',
  getId(): number {
    return this.id;
  }
  setId(value: number): GamePlayerInterface {
    this.id = value;
    return this;
  }
  // 'player',
  getPlayer():PlayerInterface {
    return this.player;
  }
  setPlayer(value:PlayerInterface): GamePlayerInterface {
    this.player = value;
    return this;
  }
  // 'deck',
  getDeck():DeckInterface|null {
    return this.deck;
  }
  setDeck(value:DeckInterface|null): GamePlayerInterface {
    this.deck = value;
    return this;
  }

  getDefaultText():string {
    return '';
  }

  getColumns(
    primary: string = 'id',
    hidden: string[] = []
  ): EntityColumnType[] {
    return this.columns.map((column: string) => {
      let colAlias = column.replaceAll(/([A-Z])/g, " $1").toLowerCase();
      return {
        column: column,
        alias: (colAlias.slice(0, 1).toUpperCase() + colAlias.slice(1)),
        primary: column === primary,
        hidden: hidden.includes(column)
      };
    });
  }

  getPrimary(): object {
    return {
      column: 'id',
      alias: 'ID'
    }
  }

  getData(column?:string) {
    let dataObj:GamePlayerType = {
      id: this.getId(),
      player: this.getPlayer(),
      deck: this.getDeck()
    };

    if (column) {
      return dataObj[column];
    }

    return column;
  }

  transformFromObject(object: GamePlayerType | GamePlayerInterface): GamePlayerInterface {
    // id: number;
    this.setId(object.id);
    // player;
    this.setPlayer(new Player(object.player));
    // deck;
    this.setDeck(object.deck ? (new Deck(object.deck)) : null);

    return this;
  }

  getDefaultImage(): string | null {
    return "";
  }
}