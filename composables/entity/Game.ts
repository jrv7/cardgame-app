import {EntityColumnType} from "~/composables/entity/EntityInterface";
import {GameFormatInterface} from "~/composables/entity/GameFormatInterface";
import {GameFormat} from "~/composables/entity/GameFormat";
import {GameInterface, GameType} from "~/composables/entity/GameInterface";

export class Game implements GameInterface {
  id:number = 0;
  uid:string = '';
  gameFormat:GameFormatInterface;
  status:number;
  name:string|null;
  startAt:string;
  endedAt:string|null;

  private columns: {}[] = [
    'id',
    'uid',
    'gameFormat',
    'status',
    'name',
    'startAt',
    'endedAt'
  ];

  constructor(cloneFrom: GameType | GameInterface | null = null) {
    if (null !== cloneFrom) {
      if (typeof cloneFrom.getId === 'undefined') {
        this.transformFromObject(cloneFrom);
      } else {
        // id: number;
        this.setId(cloneFrom.getId());
        // uid: number;
        this.setUid(cloneFrom.getUid());
        // gameFormat: number;
        this.setGameFormat(cloneFrom.getGameFormat());
        // status: number;
        this.setStatus(cloneFrom.getStatus());
        // gameFormat
        this.setName(cloneFrom.getGameFormat());
        // startAt
        this.setStartAt(cloneFrom.getStartAt());
        // endedAt
        this.setEndedAt(cloneFrom.getEndedAt());
      }
    }
  }

  // 'id',
  getId(): number {
    return this.id;
  }
  setId(value: number): GameInterface {
    this.id = value;
    return this;
  }
  // 'uid',
  getUid(): string {
    return this.uid;
  }
  setUid(value: string): GameInterface {
    this.uid = value;
    return this;
  }
  // 'uid',
  getGameFormat(): GameFormatInterface {
    return this.gameFormat;
  }
  setGameFormat(value: GameFormatInterface): GameInterface {
    this.gameFormat = value;
    return this;
  }
  // 'status',
  getStatus(): number {
    return this.status;
  }
  setStatus(value: number): GameInterface {
    this.status = value;
    return this;
  }
  // 'name',
  getName():string|null {
    return this.name;
  }
  setName(value:string|null): GameInterface {
    this.name = value;
    return this;
  }
  // 'startAt',
  getStartAt():string {
    return this.startAt;
  }
  setStartAt(value:string): GameInterface {
    this.startAt = value;
    return this;
  }
  // 'endedAt',
  getEndedAt():string|null {
    return this.endedAt;
  }
  setEndedAt(value:string|null): GameInterface {
    this.endedAt = value;
    return this;
  }

  getDefaultText():string {
    return this.getName() ?? '';
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
    let dataObj:GameType = {
      id: this.getId(),
      uid: this.getUid(),
      gameFormat: this.getGameFormat(),
      status: this.getStatus(),
      name: this.getName(),
      startAt: this.getStartAt(),
      endedAt: this.getEndedAt()
    };

    if (column) {
      return dataObj[column];
    }

    return column;
  }

  transformFromObject(object: GameType | GameInterface): GameInterface {
    // id: number;
    this.setId(object.id);
    // uid: number;
    this.setUid(object.uid);
    // gameFormat: number;
    this.setGameFormat(new GameFormat(object.gameFormat));
    // status: number;
    this.setStatus(object.status);
    // name:string|null;
    this.setName(object.name);
    // startAt: number;
    this.setStartAt(object.startAt);
    // endedAt: number;
    this.setEndedAt(object.endedAt);

    return this;
  }

  getDefaultImage(): string | null {
    return "";
  }
}