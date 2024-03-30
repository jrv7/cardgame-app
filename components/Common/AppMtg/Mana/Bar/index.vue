<script setup lang="ts">

import {SimpleButtonSizeType, SimpleButtonTypeType} from "~/composables/customTypes/SimpleButtonTypes";
import {DropdownContainerPositionType} from "~/composables/customTypes/DropdownTypes";

const globalState = useGlobalState();
const mtgState = useMtgState();

const emit = defineEmits([
  'update:modelValue',
  'update:filterSource',
  'update:color-match',
  'update:borderless',
  'update:lands-only',
  'clicked'
]);

const props = withDefaults(
    defineProps<{
      modelValue?: any,
      filterSource?:string|null,
      colorMatch?:string|null,
      borderless?:boolean,
      landsOnly?:boolean
    }>(),
    {
      modelValue: null,
      filterSource: null,
      colorMatch: 'any',
      borderless: false,
      landsOnly: false
    }
);

const parsedManaMap = computed(() => {
  return mtgState.value.colors
});

const parseFilterSource = computed({
  get: () => {
    return props.filterSource;
  },
  set: (value:string) => {
    emit('update:filterSource', value);
  }
});

const parseEnabledItems = computed({
  get: () => {
    return props.modelValue?.map(i => i.code) || [];
  },
  set: (value:{code:string, name:string}) => {
    let currentMap = JSON.parse(JSON.stringify(props.modelValue));
    if (currentMap.find(i => i.code === value.code)) {
      currentMap = currentMap.filter(i => i.code !== value.code);
    } else {
      currentMap.push(value);
    }

    emit('update:modelValue', currentMap);
  }
});

const handleClickManaFilter = (mana:{code:string, name:string}) => {
  parseEnabledItems.value = mana;
}

const parseManaFilterTargets = computed(() => {
  return [
    {
      text: useNuxtApp().$_Tt('colors'),
      value: 'colors',
      selected: props.filterSource === 'colors'
    },
    {
      text: useNuxtApp().$_Tt('identity'),
      value: 'identity',
      selected: props.filterSource === 'identity'
    },
  ].map((i, index) => {
    return {
      id: (index + 1),
      ...i
    }
  })
})

const manaData = (code:string) => {
  return globalState.value.mtgManaSymbolsCollection.find(i => i.symbol === code);
}

const retrieveManaMap = async () => {
  return new Promise((resolve) => {
    resolve(parsedManaMap.value);
  })
}

const toggleAllSelection = () => {
  if (parseEnabledItems.value.length) {
    emit('update:modelValue', []);
  } else {
    emit('update:modelValue', parsedManaMap.value);
  }
}

const toggleColorMatch = () => {
  emit('update:color-match', props.colorMatch === 'all' ? 'any' : 'all');
}

const toggleBorderless = () => {
  emit('update:borderless', !props.borderless);
}

const toggleLandsOnly = () => {
  emit('update:lands-only', !props.landsOnly);
}

defineExpose({ retrieveManaMap });
</script>

<template>
  <div class="app-mtg--mana-bar-buttons">
    <ul>
      <li
          v-for="mana in parsedManaMap" :key="`mana-bar-item-${mana.id}`"
          class="mana-filter"
          :class="{'enabled': parseEnabledItems.includes(mana.code)}"
      >
        <template v-if="manaData(mana.code)">
          <app-button
              type="link"
              size="xs-auto"
              :style="{'height': '18px !important', 'padding': '0', 'margin': 'auto'}"
              @click="handleClickManaFilter(mana)"
          >
            <img :src="manaData(mana.code)?.svg_uri" :alt="mana.name" style="height: 18px; margin: auto 0">
          </app-button>
        </template>
      </li>

      <li
          class="mana-filter"
          :class="{'enabled': landsOnly}"
      >
        <app-button
            type="link"
            size="xs-auto"
            :style="{'height': '18px !important', 'padding': '0', 'margin': 'auto'}"
            @click="toggleLandsOnly()"
        >
          <img src="~/assets/images/icons/land-icon.png" alt="Lands" style="height: 18px; margin: auto 0">
        </app-button>
      </li>

      <li class="separator" />

      <li
          class="mana-filter"
      >
        <app-button
            type="link"
            size="xs-auto"
            :style="{'height': '18px !important', 'padding': '0', 'margin': 'auto'}"
            @click="toggleAllSelection()"
        >
          <fa-icon :icon="['fas', 'ban']" />
        </app-button>
      </li>

      <li
          class="mana-filter"
          :class="{'enabled': colorMatch === 'all'}"
      >
        <app-button
            type="link"
            size="xs-auto"
            :style="{'height': '18px !important', 'padding': '0', 'margin': 'auto'}"
            @click="toggleColorMatch()"
        >
          <img src="~/assets/images/icons/mana_golden.png" alt="Golden" style="height: 18px; margin: auto 0">
        </app-button>
      </li>

      <li class="separator" />

      <li>
        <span>{{ $_Tt('filter_by') }}:</span>
        <app-button-select
            size="xs-auto"
            type="link"
            :options="parseManaFilterTargets"
            v-model="parseFilterSource"
        />
      </li>

      <li class="separator invisible"></li>
    </ul>
  </div>
</template>