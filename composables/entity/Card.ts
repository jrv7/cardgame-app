import {EntityColumnType} from "~/composables/entity/EntityInterface";
import {CardType, CardInterface} from "~/composables/entity/CardInterface";
import {UnwrapRef} from "vue";
import {Ref} from "preact/compat";
import {CollectionSet} from "~/composables/entity/CollectionSet";
import {ImageCollection} from "~/composables/entity/ImageCollection";

export class Card implements CardInterface {
  private id: number = 0;
  private uniqueCardId: number = 0;
  private uniqueCardCode: string = '';
  private cardId: string | null = null;
  private cardNumber: number | null = null;
  private multiverseId: number | null = null;
  private name: string | null = null;
  private cmc: number | null = null;
  private power: number | null = null;
  private toughness: number | null = null;
  private loyalty: number | null = null;
  private manaCost: string | null = null;
  private rarity: string | null = null;
  private type: string | null = null;
  private latestImageUrl: string | null = null;
  private imageUrl: string | null = null;
  private oracleText: string | null = null;
  private originalText: string | null = null;
  private originalType: string | null = null;
  private collectionSet:CollectionSet|null;
  private layout: string | null = null;
  private artist: string | null = null;
  private colors: string[] | null = [];
  private identityColors: string[] | null = [];
  private supertypes: string[] | null = [];
  private types: string[] | null = [];
  private subtypes: string[] | null = [];
  private collectionSets:CollectionSet[]|null;
  private imageCollection:ImageCollection[]|null;

  private columns: {}[] = [
    'id',
    'uniqueCardId',
    'uniqueCardCode',
    'cardId',
    'cardNumber',
    'multiverseId',
    'name',
    'cmc',
    'power',
    'toughness',
    'loyalty',
    'manaCost',
    'rarity',
    'type',
    'latestImageUrl',
    'imageUrl',
    'oracleText',
    'originalText',
    'originalType',
    'collectionSet',
    'layout',
    'artist',
    'colors',
    'identityColors',
    'supertypes',
    'types',
    'subtypes',
    'collectionSets',
    'imageCollection'
  ];

  public errors: Ref<UnwrapRef<{ field: string; message: string }[]>> = ref([]) as Ref<UnwrapRef<{ field: string; message: string }[]>>;
  public warnings: Ref<UnwrapRef<{ field: string; message: string }[]>> = ref([]) as Ref<UnwrapRef<{ field: string; message: string }[]>>;
  public dataIsValid = ref(false);

  constructor(cloneFrom: CardInterface | null = null) {
    if (null !== cloneFrom) {
      if (typeof cloneFrom.getId === 'undefined') {
        this.transformFromObject(cloneFrom);
      } else {
        // id: number;
        this.setId(cloneFrom.getId());
        // uniqueCardId: number;
        this.setUniqueCardId(cloneFrom.getUniqueCardId());
        // uniqueCardCode: string;
        this.setUniqueCardCode(cloneFrom.getUniqueCardCode());
        // cardId:string|null;
        this.setCardId(cloneFrom.getCardId());
        // cardNumber:number|null;
        this.setCardNumber(cloneFrom.getCardNumber());
        // multiverseId:number|null;
        this.setMultiverseId(cloneFrom.getMultiverseId());
        // name:string|null;
        this.setName(cloneFrom.getName());
        // cmc:number|null;
        this.setCmc(cloneFrom.getCmc());
        // power:number|null;
        this.setPower(cloneFrom.getPower());
        // toughness:number|null;
        this.setToughness(cloneFrom.getToughness());
        // loyalty:number|null;
        this.setLoyalty(cloneFrom.getLoyalty());
        // manaCost:string|null;
        this.setManaCost(cloneFrom.getManaCost());
        // rarity:string|null;
        this.setRarity(cloneFrom.getRarity());
        // type:string|null;
        this.setType(cloneFrom.getType());
        // latestImageUrl:string|null;
        this.setLatestImageUrl(cloneFrom.getLatestImageUrl());
        // imageUrl:string|null;
        this.setImageUrl(cloneFrom.getImageUrl());
        // oracleText:string|null;
        this.setOracleText(cloneFrom.getOracleText());
        // originalText:string|null;
        this.setOriginalText(cloneFrom.getOriginalText());
        // originalType:string|null;
        this.setOriginalType(cloneFrom.getOriginalType());
        // setCollectionSet:CollectionSet|null;
        this.setCollectionSet(cloneFrom.getCollectionSet());
        // layout:string|null;
        this.setLayout(cloneFrom.getLayout());
        // artist:string|null;
        this.setArtist(cloneFrom.getArtist());
        // colors:string[]|null;
        this.setColors(cloneFrom.getColors());
        // identityColors:string[]|null;
        this.setIdentityColors(cloneFrom.getIdentityColors());
        // supertypes:string[]|null;
        this.setSupertypes(cloneFrom.getSupertypes());
        // types:string[]|null;
        this.setTypes(cloneFrom.getTypes());
        // subtypes:string[]|null;
        this.setSubtypes(cloneFrom.getSubtypes());
        // setCollectionSets:CollectionSet[]|null;
        this.setCollectionSets(cloneFrom.getCollectionSets()?.map(i => { return new CollectionSet(i); }));
        if (cloneFrom.getImageCollection()) {
          // imageCollection:ImageCollection[]|null;
          this.setImageCollection(cloneFrom.getImageCollection()?.map(i => { return new ImageCollection(i); }));
        }
      }
    }
  }

  // 'id',
  getId(): number {
    return this.id;
  }
  setId(value: number): CardInterface {
    this.id = value;
    return this;
  }
  // 'uniqueCardId',
  getUniqueCardId(): number {
    return this.id;
  }
  setUniqueCardId(value: number): CardInterface {
    this.uniqueCardId = value;
    return this;
  }
  // 'uniqueCardCode',
  getUniqueCardCode(): string {
    return this.uniqueCardCode;
  }
  setUniqueCardCode(value: string): CardInterface {
    this.uniqueCardCode = value;
    return this;
  }
  // 'cardId',
  getCardId():string|null {
    return this.cardId;
  }
  setCardId(value:string|null): CardInterface {
    this.cardId = value;
    return this;
  }
  // 'cardNumber',
  getCardNumber():number|null {
    return this.cardNumber;
  }
  setCardNumber(value:number|null): CardInterface {
    this.cardNumber = value;
    return this;
  }
  // 'multiverseId',
  getMultiverseId():number|null {
    return this.multiverseId;
  }
  setMultiverseId(value:number|null): CardInterface {
    this.multiverseId = value;
    return this;
  }
  // 'name',
  getName():string|null {
    return this.name;
  }
  setName(value:string|null): CardInterface {
    this.name = value;
    return this;
  }
  // 'cmc',
  getCmc():number|null {
    return this.cmc;
  }
  setCmc(value:number|null): CardInterface {
    this.cmc = value;
    return this;
  }
  // 'power',
  getPower():number|null {
    return this.power;
  }
  setPower(value:number|null): CardInterface {
    this.power = value;
    return this;
  }
  // 'toughness',
  getToughness():number|null {
    return this.toughness;
  }
  setToughness(value:number|null): CardInterface {
    this.toughness = value;
    return this;
  }
  // 'loyalty',
  getLoyalty():number|null {
    return this.loyalty;
  }
  setLoyalty(value:number|null): CardInterface {
    this.loyalty = value;
    return this;
  }
  // 'manaCost',
  getManaCost():string|null {
    return this.manaCost;
  }
  setManaCost(value:string|null): CardInterface {
    this.manaCost = value;
    return this;
  }
  // 'rarity',
  getRarity():string|null {
    return this.rarity;
  }
  setRarity(value:string|null): CardInterface {
    this.rarity = value;
    return this;
  }
  // 'type',
  getType():string|null {
    return this.type;
  }
  setType(value:string|null): CardInterface {
    this.type = value;
    return this;
  }
  // 'latestImageUrl',
  getLatestImageUrl():string|null {
    return this.latestImageUrl;
  }
  setLatestImageUrl(value:string|null): CardInterface {
    this.latestImageUrl = value;
    return this;
  }
  // 'imageUrl',
  getImageUrl():string|null {
    return this.imageUrl;
  }
  setImageUrl(value:string|null): CardInterface {
    this.imageUrl = value;
    return this;
  }
  // 'oracleText',
  getOracleText():string|null {
    return this.oracleText;
  }
  setOracleText(value:string|null): CardInterface {
    this.oracleText = value;
    return this;
  }
  // 'originalText',
  getOriginalText():string|null {
    return this.originalText;
  }
  setOriginalText(value:string|null): CardInterface {
    this.originalText = value;
    return this;
  }
  // 'originalType',
  getOriginalType():string|null {
    return this.originalType;
  }
  setOriginalType(value:string|null): CardInterface {
    this.originalType = value;
    return this;
  }
  // 'collectionSet',
  getCollectionSet():CollectionSet|null {
    return this.collectionSet;
  }
  setCollectionSets(value:CollectionSet[]|null): CardInterface {
    this.collectionSets = value;
    return this;
  }
  // 'layout',
  getLayout():string|null {
    return this.layout;
  }
  setLayout(value:string|null): CardInterface {
    this.layout = value;
    return this;
  }
  // 'artist',
  getArtist():string|null {
    return this.artist;
  }
  setArtist(value:string|null): CardInterface {
    this.artist = value;
    return this;
  }
  // 'colors',
  getColors():string[]|null {
    return this.colors;
  }
  setColors(value:string[]|null): CardInterface {
    this.colors = value;
    return this;
  }
  // 'identityColors',
  getIdentityColors():string[]|null {
    return this.identityColors;
  }
  setIdentityColors(value:string[]|null): CardInterface {
    this.identityColors = value;
    return this;
  }
  // 'supertypes',
  getSupertypes():string[]|null {
    return this.supertypes;
  }
  setSupertypes(value:string[]|null): CardInterface {
    this.supertypes = value;
    return this;
  }
  // 'types',
  getTypes():string[]|null {
    return this.types;
  }
  setTypes(value:string[]|null): CardInterface {
    this.types = value;
    return this;
  }
  // 'subtypes'
  getSubtypes():string[]|null {
    return this.subtypes;
  }
  setSubtypes(value:string[]|null): CardInterface {
    this.subtypes = value;
    return this;
  }
  setCollectionSet(value:CollectionSet|null):CardInterface {
    this.collectionSet = value;
    return this;
  }
  // 'collectionSet',
  getCollectionSets():CollectionSet[]|null {
    return this.collectionSets;
  }
  setImageCollection(value:ImageCollection[]|null):CardInterface {
    this.imageCollection = value;
    return this;
  }
  // 'imageCollection',
  getImageCollection():ImageCollection[] {
    return this.imageCollection ?? [];
  }

  getDefaultText():string {
    return this.getName() ?? '';
  }

  private runValidation(): CardInterface {
    let forceInvalid = false;

    if (!this.getName()?.length) {
      this.errors.value = [...this.errors.value.filter((i: {field: string, message: string}) => i.field !== 'name'), { field: 'name', message: 'Name cannot be empty!' }];
    } else {
      this.errors.value = this.errors.value.filter((i: {field: string, message: string}) => i.field !== 'name');
    }

    this.dataIsValid.value = (!this.errors.value.length && !this.warnings.value.length && !forceInvalid);

    return this;
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
    let dataObj:CardType = {
      id: this.getId(),
      uniqueCardId: this.getUniqueCardId(),
      uniqueCardCode: this.getUniqueCardCode(),
      cardId: this.getCardId(),
      cardNumber: this.getCardNumber(),
      multiverseId: this.getMultiverseId(),
      name: this.getName(),
      cmc: this.getCmc(),
      power: this.getPower(),
      toughness: this.getToughness(),
      loyalty: this.getLoyalty(),
      manaCost: this.getManaCost(),
      rarity: this.getRarity(),
      type: this.getType(),
      latestImageUrl: this.getLatestImageUrl(),
      imageUrl: this.getImageUrl(),
      oracleText: this.getOracleText(),
      originalText: this.getOriginalText(),
      originalType: this.getOriginalType(),
      collectionSet: this.getCollectionSet(),
      layout: this.getLayout(),
      artist: this.getArtist(),
      colors: this.getColors(),
      identityColors: this.getIdentityColors(),
      supertypes: this.getSupertypes(),
      types: this.getTypes(),
      subtypes: this.getSubtypes(),
      collectionSets: this.getCollectionSets(),
      imageCollection: this.getImageCollection(),
    };

    if (column) {
      return dataObj[column];
    }

    return column;
  }

  transformFromObject(object: CardType | CardInterface): CardInterface {
    // id: number;
    this.setId(object.id);
    // uniqueCardId: number;
    this.setUniqueCardId(object.uniqueCardId);
    // uniqueCardCode: string;
    this.setUniqueCardCode(object.uniqueCardCode);
    // cardId:string|null;
    this.setCardId(object.cardId);
    // cardNumber:number|null;
    this.setCardNumber(object.cardNumber);
    // multiverseId:number|null;
    this.setMultiverseId(object.multiverseId);
    // name:string|null;
    this.setName(object.name);
    // cmc:number|null;
    this.setCmc(object.cmc);
    // power:number|null;
    this.setPower(object.power);
    // toughness:number|null;
    this.setToughness(object.toughness);
    // loyalty:number|null;
    this.setLoyalty(object.loyalty);
    // manaCost:string|null;
    this.setManaCost(object.manaCost);
    // rarity:string|null;
    this.setRarity(object.rarity);
    // type:string|null;
    this.setType(object.type);
    // latestImageUrl:string|null;
    this.setLatestImageUrl(object.latestImageUrl);
    // imageUrl:string|null;
    this.setImageUrl(object.imageUrl);
    // oracleText:string|null;
    this.setOracleText(object.oracleText);
    // originalText:string|null;
    this.setOriginalText(object.originalText);
    // originalType:string|null;
    this.setOriginalType(object.originalType);
    // setCollectionSet:CollectionSet|null;
    this.setCollectionSet(object.collectionSet ? new CollectionSet(object.collectionSet) : null);
    // layout:string|null;
    this.setLayout(object.layout);
    // artist:string|null;
    this.setArtist(object.artist);
    // colors:string[]|null;
    this.setColors(object.colors);
    // identityColors:string[]|null;
    this.setIdentityColors(object.identityColors);
    // supertypes:string[]|null;
    this.setSupertypes(object.supertypes);
    // types:string[]|null;
    this.setTypes(object.types);
    // subtypes:string[]|null;
    this.setSubtypes(object.subtypes);
    // setCollectionSets:CollectionSet[]|null;
    this.setCollectionSets(object.collectionSets ? object.collectionSets.map(i => { return new CollectionSet(i); }) : null);
    // setImageCollection:ImageCollection[]|null;
    this.setImageCollection(object.imageCollection ? object.imageCollection.map(i => { return new ImageCollection(i); }) : null);

    return this;
  }

  getDefaultImage(): string | null {
    return "";
  }
}