import {EntityColumnType} from "~/composables/entity/EntityInterface";
import {UnwrapRef} from "vue";
import {Ref} from "preact/compat";
import {CollectionSet} from "~/composables/entity/CollectionSet";
import {ImageCollectionInterface, ImageCollectionType} from "~/composables/entity/ImageCollectionInterface";

export class ImageCollection implements ImageCollectionInterface {
  private collectionSet: CollectionSet;
  private collectionImage: string;

  private columns: {}[] = [
    'collectionSet',
    'collectionImage'
  ];

  public errors: Ref<UnwrapRef<{ field: string; message: string }[]>> = ref([]) as Ref<UnwrapRef<{ field: string; message: string }[]>>;

  constructor(cloneFrom: ImageCollectionType) {
    // name:string|null;
    this.setCollectionSet(new CollectionSet(cloneFrom.collectionSet));
    // code:string|null;
    this.setCollectionImage(cloneFrom.collectionImage);
  }

  // 'code',
  getCollectionSet():CollectionSet {
    return this.collectionSet;
  }
  setCollectionSet(value:CollectionSet): ImageCollectionInterface {
    this.collectionSet = value;
    return this;
  }
  // 'name',
  getCollectionImage():string {
    return this.collectionImage;
  }
  setCollectionImage(value:string): ImageCollectionInterface {
    this.collectionImage = value;
    return this;
  }

  getData(column?:string) {
    let dataObj: ImageCollectionType = {
      collectionSet: this.getCollectionSet(),
      collectionImage: this.getCollectionImage()
    };

    if (column) {
      return dataObj[column];
    }

    return column;
  }

  transformFromObject(object: ImageCollectionType | ImageCollectionInterface): ImageCollectionInterface {
    // code:string|null;
    this.setCollectionSet(object.collectionSet);
    // name:string|null;
    this.setCollectionImage(object.collectionImage);
    return this;
  }

  getDefaultImage(): string | null {
    return '';
  }

  getDefaultText(): string {
    return "";
  }

  getColumns(): EntityColumnType[] {
    return [];
  }
}