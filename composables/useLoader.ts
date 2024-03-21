
import {useLoadingState} from "~/composables/states";

export const useLoader = () => {

  return {
    start: () => {
      useLoadingState().value.loading = true;
    },
    stop: () => {
      useLoadingState().value.loading = false;
    }
  }
}