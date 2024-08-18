import {useGameState} from "~/composables/states";

const getMicrotime = (getAsFloat:boolean = false) => {
    var s, now, multiplier;

    if(typeof performance !== 'undefined' && performance.now) {
        now = (performance.now() + performance.timing.navigationStart) / 1000;
        multiplier = 1e6; // 1,000,000 for microseconds
    }
    else {
        now = (Date.now ? Date.now() : new Date().getTime()) / 1000;
        multiplier = 1e3; // 1,000
    }

    // Getting microtime as a float is easy
    if(getAsFloat) {
        return now;
    }

    // Dirty trick to only get the integer part
    s = now | 0;

    return parseInt(((Math.round((now - s) * multiplier ) / multiplier ) + s));
}
export const useGame = () => {
    const state = useGameState();


    return {
        setSession: async (data) => {
            state.value.upTime = getMicrotime();
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