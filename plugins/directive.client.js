
import { defineAsyncComponent, createVNode, render } from "vue"

export default defineNuxtPlugin((nuxtApp) => {
    const stateHandler = useStateHandler();

    nuxtApp.vueApp.directive('drag-able', {
        mounted: (el, binding) => {
            el.addEventListener('mouseenter', stateHandler.setDraggableItem, false);
            el.addEventListener('mouseleave', stateHandler.unsetDraggableItem, false);
        }
    });
})