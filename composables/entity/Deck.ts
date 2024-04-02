import {EntityColumnType} from "~/composables/entity/EntityInterface";
import {CardType, DeckInterface} from "~/composables/entity/DeckInterface";
import {UnwrapRef} from "vue";
import {Ref} from "preact/compat";
import {CollectionSet} from "~/composables/entity/CollectionSet";
import {ImageCollection} from "~/composables/entity/ImageCollection";
import {DeckInterface, DeckType} from "~/composables/entity/DeckInterface";
import {GameFormatInterface} from "~/composables/entity/GameFormatInterface";
import {GameFormat} from "~/composables/entity/GameFormat";
import {CardInterface} from "~/composables/entity/CardInterface";
import {Card} from "~/composables/entity/Card";

export class Deck implements DeckInterface {
  private id: number = 0;
  private gameFormat: GameFormatInterface|null;
  private coverCard: CardInterface|null;
  private primaryCard: CardInterface|null;
  private secondaryCard: CardInterface|null;
  private name: string | null = null;
  private description: string | null = null;

  private columns: {}[] = [
    'id',
    'gameFormat',
    'coverCard',
    'primaryCard',
    'secondaryCard',
    'name',
    'description'
  ];

  public errors: Ref<UnwrapRef<{ field: string; message: string }[]>> = ref([]) as Ref<UnwrapRef<{ field: string; message: string }[]>>;
  public warnings: Ref<UnwrapRef<{ field: string; message: string }[]>> = ref([]) as Ref<UnwrapRef<{ field: string; message: string }[]>>;
  public dataIsValid = ref(false);

  constructor(cloneFrom: DeckType | DeckInterface | null = null) {
    if (null !== cloneFrom) {
      if (typeof cloneFrom.getId === 'undefined') {
        this.transformFromObject(cloneFrom);
      } else {
        // id: number;
        this.setId(cloneFrom.getId());
        // gameFormat
        this.setName(cloneFrom.getGameFormat());
        // coverCard
        this.setCoverCard(cloneFrom.getCoverCard());
        // coverCard
        this.setPrimaryCard(cloneFrom.getPrimaryCard());
        // coverCard
        this.setSecondaryCard(cloneFrom.getSecondaryCard());
        // name:string|null;
        this.setName(cloneFrom.getName());
        // description:string|null;
        this.setDescription(cloneFrom.getDescription());
      }
    }
  }

  // 'id',
  getId(): number {
    return this.id;
  }
  setId(value: number): DeckInterface {
    this.id = value;
    return this;
  }
  // 'gameFormat',
  getGameFormat():GameFormatInterface|null {
    return this.gameFormat;
  }
  setGameFormat(value:GameFormatInterface|null): DeckInterface {
    this.gameFormat = value;
    return this;
  }
  // 'coverCard',
  getCoverCard():CardInterface|null {
    return this.coverCard;
  }
  setCoverCard(value:CardInterface|null): DeckInterface {
    this.coverCard = value;
    return this;
  }
  // 'primaryCard',
  getPrimaryCard():CardInterface|null {
    return this.primaryCard;
  }
  setPrimaryCard(value:CardInterface|null): DeckInterface {
    this.primaryCard = value;
    return this;
  }
  // 'secondaryCard',
  getSecondaryCard():CardInterface|null {
    return this.secondaryCard;
  }
  setSecondaryCard(value:CardInterface|null): DeckInterface {
    this.secondaryCard = value;
    return this;
  }
  // 'name',
  getName():string|null {
    return this.name;
  }
  setName(value:string|null): DeckInterface {
    this.name = value;
    return this;
  }
  // 'description',
  getDescription():string|null {
    return this.description;
  }
  setDescription(value:string|null): DeckInterface {
    this.description = value;
    return this;
  }

  getDefaultText():string {
    return this.getName() ?? '';
  }

  validation():boolean {
    return this.dataIsValid.value;
  }

  getErrors() {
    return this.errors.value;
  }

  getWarnings() {
    return this.warnings.value;
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
    let dataObj:DeckType = {
      id: this.getId(),
      gameFormat: this.getGameFormat(),
      coverCard: this.getCoverCard(),
      primaryCard: this.getPrimaryCard(),
      secondaryCard: this.getSecondaryCard(),
      name: this.getName(),
      description: this.getDescription()
    };

    if (column) {
      return dataObj[column];
    }

    return column;
  }

  transformFromObject(object: DeckType | DeckInterface): DeckInterface {
    // id: number;
    this.setId(object.id);
    // gameFormat: number;
    this.setGameFormat(new GameFormat(object.gameFormat));
    // coverCard: number;
    this.setCoverCard(new Card(object.coverCard));
    // coverCard: number;
    this.setPrimaryCard(new Card(object.primaryCard));
    // coverCard: number;
    this.setSecondaryCard(new Card(object.secondaryCard));
    // name:string|null;
    this.setName(object.name);
    // description:string|null;
    this.setDescription(object.description);

    return this;
  }

  getDefaultImage(): string | null {
    return "";
  }
}