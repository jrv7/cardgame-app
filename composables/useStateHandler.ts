import {useLocalApiPost} from "./useApiFetch";

export const useStateHandler = () => {
  const globalState = useGlobalState();

  return {
    setDraggableItem: (value) => {
      clearTimeout(globalState.value.draggingTrigger);
      globalState.value.draggableElement = value.target.getAttribute('draggable-item-id');
    },
    unsetDraggableItem: () => {
      if (globalState.value.isDragging) {
        globalState.value.draggingTrigger = setTimeout(() => {
          globalState.value.draggableElement = null;
          globalState.value.draggingTrigger = null;
          clearTimeout(globalState.value.draggingTrigger);
        }, 2000)
      } else {
        globalState.value.draggingTrigger = setTimeout(() => {
          globalState.value.draggableElement = null;
          globalState.value.draggingTrigger = null;
          clearTimeout(globalState.value.draggingTrigger);
        }, 100)
      }
    },
    disableMemoryDatabase: async () => {
      const memoryDbSettingCookie = useCookie('memdb');
      memoryDbSettingCookie.value = false;
      globalState.value.useMemoryDatabases = false;
      await useLocalApiPost('/settings', {setting: 'use-memory-databases', value: false});
    },
    enableMemoryDatabase: async () => {
      const memoryDbSettingCookie = useCookie('memdb');
      memoryDbSettingCookie.value = true;
      await useLocalApiPost('/settings', {setting: 'use-memory-databases', value: true});
      globalState.value.useMemoryDatabases = true;
    },
    toggleMemoryDatabase: async () => {
      const memoryDbSettingCookie = useCookie('memdb');
      memoryDbSettingCookie.value = !globalState.value.useMemoryDatabases;
      await useLocalApiPost('/settings', {setting: 'use-memory-databases', value: !globalState.value.useMemoryDatabases});
      globalState.value.useMemoryDatabases = !globalState.value.useMemoryDatabases;
    },
    isLoading: () => {
      return globalState.value.loading;
    },
    startLoading: () => {
      globalState.value.loading = true;
    },
    stopLoading: () => {
      globalState.value.loadTimer = setTimeout(() => {
        globalState.value.loading = false;
        globalState.value.loadTimer = null;
      }, 800)
    },
    logMissingTranslation: (language, word) => {
      const clientName = 'gateway';
      const loggedWord = word.replaceAll(clientName+'__', '');

      let missingWord = globalState.value.missingTranslations.find(i => i.word === loggedWord);

      if (missingWord) {
        if (!missingWord.languages.includes(language)) {
          missingWord.languages.push(language);
        }
      } else {
        missingWord = {
          word: loggedWord,
          languages: [language]
        }
        globalState.value.missingTranslations.push(missingWord);
      }
    }
  }
}