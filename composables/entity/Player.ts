import {EntityColumnType} from "~/composables/entity/EntityInterface";
import {UnwrapRef} from "vue";
import {Ref} from "preact/compat";
import {PlayerInterface, PlayerType} from "~/composables/entity/PlayerInterface";

export class Player implements PlayerInterface {
  private id: number = 0;
  private uid: string = '';
  private name: string = '';
  private nickname:string|null = null;
  private avatarUrl:string|null = null;

  private columns: {}[] = [
    'id',
    'uid',
    'name',
    'nickname',
    'avatarUrl'
  ];

  public errors: Ref<UnwrapRef<{ field: string; message: string }[]>> = ref([]) as Ref<UnwrapRef<{ field: string; message: string }[]>>;

  constructor(cloneFrom: PlayerType | PlayerInterface | null = null) {
    if (null !== cloneFrom) {
      if (typeof cloneFrom.getId === 'undefined') {
        this.transformFromObject(cloneFrom);
      } else {
        // id: number;
        this.setId(cloneFrom.getId());
        // uid:string|null;
        this.setUid(cloneFrom.getUid());
        // name:string|null;
        this.setName(cloneFrom.getName());
        // name:string|null;
        this.setNickname(cloneFrom.getNickname());
        // name:string|null;
        this.setAvatarUrl(cloneFrom.getAvatarUrl());
      }
    }
  }

  // 'id',
  getId(): number {
    return this.id;
  }
  setId(value: number): PlayerInterface {
    this.id = value;
    return this;
  }
  // 'uid',
  getUid(): string {
    return this.uid;
  }
  setUid(value: string): PlayerInterface {
    this.uid = value;
    return this;
  }
  // 'name',
  getName():string {
    return this.name;
  }
  setName(value:string): PlayerInterface {
    this.name = value;
    return this;
  }
  // 'name',
  getNickname():string|null {
    return this.nickname;
  }
  setNickname(value:string|null): PlayerInterface {
    this.nickname = value;
    return this;
  }
  // 'name',
  getAvatarUrl():string|null {
    return this.avatarUrl;
  }
  setAvatarUrl(value:string|null): PlayerInterface {
    this.avatarUrl = value;
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
    let dataObj:PlayerType = {
      id: this.getId(),
      uid: this.getUid(),
      name: this.getName(),
      nickname: this.getNickname(),
      avatarUrl: this.getAvatarUrl()
    };

    if (column) {
      return dataObj[column];
    }

    return column;
  }

  transformFromObject(object: PlayerType | PlayerInterface): PlayerInterface {
    // id: number;
    this.setId(object.id);
    // uid: string;
    this.setUid(object.uid);
    // name:string|null;
    this.setName(object.name);
    // nickname:string|null;
    this.setNickname(object.nickname);
    // avatarUrl:string|null;
    this.setAvatarUrl(object.avatarUrl);

    return this;
  }

  getDefaultImage(): string | null {
    return "";
  }
}