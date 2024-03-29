import {EntityColumnType} from "~/composables/entity/EntityInterface";
import {UnwrapRef} from "vue";
import {Ref} from "preact/compat";
import {GameFormatInterface, GameFormatType} from "~/composables/entity/GameFormatInterface";

export class GameFormat implements GameFormatInterface {
  private id: number;
  private name: string;

  private columns: {}[] = [
    'id',
    'name',
  ];

  public errors: Ref<UnwrapRef<{ field: string; message: string }[]>> = ref([]) as Ref<UnwrapRef<{ field: string; message: string }[]>>;
  public warnings: Ref<UnwrapRef<{ field: string; message: string }[]>> = ref([]) as Ref<UnwrapRef<{ field: string; message: string }[]>>;
  public dataIsValid = ref(false);

  constructor(cloneFrom: GameFormatInterface | null = null) {
    if (null !== cloneFrom) {
      if (typeof cloneFrom.getId === 'undefined') {
        this.transformFromObject(cloneFrom);
      } else {
        // id: number;
        this.setId(cloneFrom.getId());
        // name:string|null;
        this.setName(cloneFrom.getName());
      }
    }
  }

  // 'id',
  getId(): number {
    return this.id;
  }
  setId(value: number): GameFormatInterface {
    this.id = value;
    return this;
  }
  // 'name',
  getName():string {
    return this.name;
  }
  setName(value:string): GameFormatInterface {
    this.name = value;
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
    let dataObj:GameFormatType = {
      id: this.getId(),
      name: this.getName()
    };

    if (column) {
      return dataObj[column];
    }

    return column;
  }

  transformFromObject(object: GameFormatType | GameFormatInterface): GameFormatInterface {
    // id: number;
    this.setId(object.id);
    // name:string|null;
    this.setName(object.name);

    return this;
  }

  getDefaultImage(): string | null {
    return "";
  }
}