
export default defineNuxtPlugin(() => {
  return {
    provide: {
      deepClone: (obj: object, forceUnref: boolean = false) => {
        const original = unref(obj);
        if (typeof obj !== 'object') {
          console.error('Cannot copy non-object targets')
          return null
        }

        let copiedObj = obj;

        if (forceUnref) {
          copiedObj = unref(obj);
        } else {
          copiedObj = JSON.parse(JSON.stringify(obj));
        }

        return copiedObj;
      },
    }
  }
})