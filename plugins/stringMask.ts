export default defineNuxtPlugin(() => {
  function stringToMasked(str: string, mask: any):string {
    return str.replace(mask.find, mask.replace);
  }

  return {
    provide: {
      stringMask: stringToMasked
    }
  }
})