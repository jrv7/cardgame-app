import {useGameState} from "~/composables/states";

export const useGame = () => {
    const state = useGameState();


    return {
        setSession: async (data) => {
            state.value.Session = data;
        },
        setPlayerUid: async (uid:string) => {
            state.value.PlayerUid = uid;
        },
        start: async () => {
            state.value.started = true;
        }
    }
}