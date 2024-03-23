import {EntityColumnType} from "~/composables/entity/EntityInterface";
import {CollectionSetInterface, CollectionSetType} from "~/composables/entity/CollectionSetInterface";
import {UnwrapRef} from "vue";
import {Ref} from "preact/compat";
import {i} from "vite-node/types-516036fa";
import {object, undefined} from "zod";

export class CollectionSet implements CollectionSetInterface {
  private id: number = 0;
  private code: string = '';
  private name: string | null = null;
  private releaseDate: string | null = null;

  private columns: {}[] = [
    'id',
    'code',
    'name',
    'releaseDate'
  ];

  public errors: Ref<UnwrapRef<{ field: string; message: string }[]>> = ref([]) as Ref<UnwrapRef<{ field: string; message: string }[]>>;
  public warnings: Ref<UnwrapRef<{ field: string; message: string }[]>> = ref([]) as Ref<UnwrapRef<{ field: string; message: string }[]>>;
  public dataIsValid = ref(false);

  constructor(cloneFrom: CollectionSetInterface | null = null) {
    if (null !== cloneFrom) {
      if (typeof cloneFrom.getId === 'undefined') {
        this.transformFromObject(cloneFrom);
      } else {
        // id: number;
        this.setId(cloneFrom.getId());
        // name:string|null;
        this.setName(cloneFrom.getName());
        // code:string|null;
        this.setCode(cloneFrom.getCode());
        // releaseDate:string|null;
        this.setReleaseDate(cloneFrom.getReleaseDate());
      }
    }
  }

  // 'id',
  getId(): number {
    return this.id;
  }
  setId(value: number): CollectionSetInterface {
    this.id = value;
    return this.runValidation();
  }
  // 'code',
  getCode():string {
    return this.code;
  }
  setCode(value:string): CollectionSetInterface {
    this.code = value;
    return this.runValidation();
  }
  // 'name',
  getName():string|null {
    return this.name;
  }
  setName(value:string|null): CollectionSetInterface {
    this.name = value;
    return this.runValidation();
  }
  // 'releaseDate',
  getReleaseDate():string|null {
    return this.releaseDate;
  }
  setReleaseDate(value:string|null): CollectionSetInterface {
    this.releaseDate = value;
    return this.runValidation();
  }

  private runValidation(): CollectionSetInterface {
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
    let dataObj = {
      id: this.getId(),
      code: this.getCode(),
      name: this.getName(),
      releaseDate: this.getReleaseDate()
    };

    if (column) {
      return dataObj[column];
    }

    return column;
  }

  transformFromObject(object: CollectionSetType | CollectionSetInterface): CollectionSetInterface {
    // id: string;
    this.setId(object.id);
    // code:string|null;
    this.setCode(object.code);
    // name:string|null;
    this.setName(object.name);
    // releaseDate:string|null;
    this.setReleaseDate(object.releaseDate);
    return this;
  }

  getDefaultImage(): string | null {
    return '';
  }

  getDefaultText(): string {
    return "";
  }
}