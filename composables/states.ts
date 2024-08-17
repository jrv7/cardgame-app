

export const useGlobalState = () => useState(() => {
  let dragTrigger:any = null;

  return {
    useMemoryDatabases: true,
    loading: false,
    loadTimer: null,
    modals: [],
    pageActions: null,
    theme: 'light',
    scrollingLocked: 0,
    blurReactiveComponents: [],
    missingTranslations: [],
    mtgManaSymbolsCollection: [],
    isDragging: false,
    draggingTrigger: dragTrigger,
    draggableElement: null
  }
});
export const useLoadingState = () => useState(() => {
  return {
    loading: false
  }
});

export type AuthUserStateType = {
  id:number|null,
  email: string|null,
  name: string|null,
  lastName: string|null,
  fullName: string|null,
  roles: string[]|null
};
export const useAuthState = () => useState(() => {
  const defaultUserObject:AuthUserStateType = {
    id: null,
    email: null,
    name: null,
    lastName: null,
    fullName: null,
    roles: []
  }

  return {
    authenticated: false,
    user: defaultUserObject
  };
});

export type SettingsStateType = {} | null;
export const useSettingsState = () => useState(() => {
  const defaultSettingsObject:SettingsStateType = null

  return defaultSettingsObject;
});

export const useModalState = () => useState(() => {
  return [];
});
export const useMtgState = () => useState(() => {
  return {
    scryfallSymbols: [],
    apiColors: [],
    colors: []
  }
});

export const useGameState = () => useState(() => {
  return {
    started: false,
    Session: null,
    PlayerUid: null
  } as {
    started:boolean,
    Session:any,
    PlayerUid:string|null
  }
});
