<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'changed']);

const props = withDefaults(
    defineProps<{
      modelValue?: number | string | null,
      format?: string | null,
      delimiter?: string | null,
      timeSelector?: boolean | null,
    }>(),
    {
      modelValue: null,
      format: 'yyyy-mm-dd',
      delimiter: '-',
      timeSelector: false,
    }
);

const selectorPosition = ref('date');
const currentDate = ref(new Date());
const currentDateString = ref(null);
const currentDecade = ref(parseInt(String(currentDate.value.getFullYear() / 14)));
const selectedYear = ref(currentDate.value.getFullYear());
const selectedMonth = ref(currentDate.value.getMonth() + 1);
const selectedDay = ref(currentDate.value.getDate());
const selectedTimeSpan = ref('AM');
const selectedTimeHour = ref(0);
const selectedTimeMinute = ref(0);

const timePhase = ref(0);
const selectedTimeMinuteDecimal = ref(0);
const selectedTimeMinuteUnit = ref(0);

const weekDays = ref([
  { number: 1, name: useNuxtApp().$dateFromString('1901-01-07', 'yyyy-mm-dd', '-').toString().slice(0, 3) },
  { number: 2, name: useNuxtApp().$dateFromString('1901-01-08', 'yyyy-mm-dd', '-').toString().slice(0, 3) },
  { number: 3, name: useNuxtApp().$dateFromString('1901-01-09', 'yyyy-mm-dd', '-').toString().slice(0, 3) },
  { number: 4, name: useNuxtApp().$dateFromString('1901-01-10', 'yyyy-mm-dd', '-').toString().slice(0, 3) },
  { number: 5, name: useNuxtApp().$dateFromString('1901-01-11', 'yyyy-mm-dd', '-').toString().slice(0, 3) },
  { number: 6, name: useNuxtApp().$dateFromString('1901-01-12', 'yyyy-mm-dd', '-').toString().slice(0, 3) },
  { number: 7, name: useNuxtApp().$dateFromString('1901-01-13', 'yyyy-mm-dd', '-').toString().slice(0, 3) },
]);

const parseSelectedDay = computed({
  get: () => {
    return selectedDay.value;
  },
  set: (val:number) => {
    selectedDay.value = val;
    setSelectedDatetime();
  }
});

const parsedTimeHour = computed({
  get: () => {
    return selectedTimeHour.value;
  },
  set: (val:number) => {
    selectedTimeHour.value = val;
    setSelectedDatetime();
  }
});

const parsedTimeMinuteDecimal = computed({
  get: () => {
    return selectedTimeMinuteDecimal.value;
  },
  set: (val:number) => {
    const whatsLeft = selectedTimeMinute.value % 10;
    selectedTimeMinuteDecimal.value = val;
    selectedTimeMinute.value = val + whatsLeft;
    setSelectedDatetime();
  }
});

const parsedTimeMinuteUnit = computed({
  get: () => {
    return selectedTimeMinuteUnit.value;
  },
  set: (val:number) => {
    const whatsLeft = parseInt(selectedTimeMinuteDecimal.value / 10);
    selectedTimeMinuteUnit.value = val;
    selectedTimeMinute.value = val + (whatsLeft * 10);
    setSelectedDatetime();
  }
});

const refSelectedYearMonth = computed(() => {
  const selectedMonthString = `${String(selectedMonth.value).length === 1 ? '0' : ''}${selectedMonth.value}`;
  return useNuxtApp().$dateFromString(`${selectedYear.value}-${selectedMonthString}-01`, 'yyyy-mm-dd', '-').toString();
});

const refDaySpan = computed(() => {
  const firstWeekDay = refSelectedYearMonth.value.slice(0, 3);
  return weekDays.value.findIndex(i => i.name === firstWeekDay);
});

const refSelectedYearMonthLastDay = computed(() => {
  return parseInt(String(new Date(selectedYear.value, selectedMonth.value, 0).getDate()));
});

function getCurrentWeekNumber(wNumber) {
  let lastDayOfWeek = (((wNumber) * 7) - refDaySpan.value);

  if ((lastDayOfWeek - 6) > refSelectedYearMonthLastDay.value) {
    return null;
  } else if (lastDayOfWeek > refSelectedYearMonthLastDay.value) {
    lastDayOfWeek = refSelectedYearMonthLastDay.value;
  }

  const currentWeekDate = new Date(selectedYear.value, selectedMonth.value-1, lastDayOfWeek);
  const startDate = new Date(selectedYear.value, 0, 1);// First of January of the selected year
  let days = Math.ceil(((currentWeekDate - startDate)+1) / (24 * 60 * 60 * 1000));

  return Math.ceil(days / 7);
}

function walkDecade(step = 1) {
  if (0 !== step) {
    currentDecade.value = currentDecade.value + step;
  } else {
    currentDecade.value = parseInt(String(currentDate.value.getFullYear() / 14));
  }
}

function walkMonth(step = 1) {
  if ((selectedMonth.value + step) > 12) {
    selectedYear.value++;
    selectedMonth.value = 1;
  } else if ((selectedMonth.value + step) < 1) {
    selectedYear.value--;
    selectedMonth.value = 12;
  } else {
    selectedMonth.value = (selectedMonth.value + step);
  }
}

function walkDay(step = 1) {
  if ((selectedDay.value + step) > refSelectedYearMonthLastDay.value) {
    walkMonth(1);
    selectedDay.value = 1;
  } else if ((selectedDay.value + step) < 1) {
    walkMonth(-1);
    selectedDay.value = refSelectedYearMonthLastDay.value;
  } else {
    selectedDay.value = (selectedDay.value + step);
  }
}

function setSelector(opt) {
  selectorPosition.value = opt;
}

function setSelectedDate() {
  const selectedDate = new Date(selectedYear.value, selectedMonth.value-1, selectedDay.value);

  if (selectedDate) {
    const monthString = `${String(selectedMonth.value).length === 1 ? '0' : ''}${selectedMonth.value}`;
    const dayString = `${String(selectedDay.value).length === 1 ? '0' : ''}${selectedDay.value}`;
    currentDateString.value = useNuxtApp().$dateFormat(`${selectedYear.value}-${monthString}-${dayString}`, props.format);

    if (!props.timeSelector) {
      emit('update:modelValue', currentDateString.value);
      setTimeout(() => {
        emit('changed', true);
      }, 200);
    } else {
      setSelector('time');
    }
  }
}

function setSelectedDatetime() {
  const selectedDate = new Date(selectedYear.value, selectedMonth.value-1, selectedDay.value);

  if (selectedDate) {
    const monthString = `${String(selectedMonth.value).length === 1 ? '0' : ''}${selectedMonth.value}`;
    const dayString = `${String(selectedDay.value).length === 1 ? '0' : ''}${selectedDay.value}`;

    currentDateString.value = useNuxtApp().$dateFormat(`${selectedYear.value}-${monthString}-${dayString}`, props.format, props.delimiter);
    const currentSelectedHour = (selectedTimeSpan.value === 'PM' ? (parseInt(selectedTimeHour.value) + 12) : selectedTimeHour.value);
    const currentDateTimeString = `${currentDateString.value} ${String(currentSelectedHour).length === 1 ? '0' : ''}${currentSelectedHour}:${String(selectedTimeMinute.value).length === 1 ? '0' : ''}${selectedTimeMinute.value}`

    emit('update:modelValue', currentDateTimeString);
    setTimeout(() => {
      emit('changed', true);
    }, 200);
  }
}

onMounted(() => {
  if (props.value || props.modelValue) {
    const defaultData = String(props.value ?? props.modelValue).slice(0,props.format.length);
    let startDate;

    if (!!props.timeSelector) {
      startDate = String(defaultData).slice(0, props.format.length);

      if (defaultData.length >= (props.format.length + 6)) {
        selectedTimeHour.value = parseInt(defaultData.slice((props.format.length + 1), (props.format.length + 3)));
        selectedTimeMinute.value = parseInt(defaultData.slice((props.format.length + 4), (props.format.length + 6)));
      }
    } else {
      startDate = String(props.value ?? props.modelValue).slice(0,props.format.length);
    }

    currentDate.value = useNuxtApp().$dateFromString(startDate, props.format, props.delimiter);
    currentDecade.value = parseInt(String(currentDate.value.getFullYear() / 14));
    selectedYear.value = currentDate.value.getFullYear();
    selectedMonth.value = currentDate.value.getMonth() + 1;
    selectedDay.value = currentDate.value.getDate();
    currentDateString.value = useNuxtApp().$dateFormat(startDate, props.format);
  }
});
</script>

<template>
  <div
      class="date-time-picker"
      :class="[`select-${selectorPosition}`]"
  >
    <div class="slider">
      <div class="selection-container pick-year">
        <div class="g-row">
          <div class="g-col --span-2"></div>
          <div class="g-col --span-20">
            <app-button-group class="margin-h-auto">
              <app-button
                  type="link"
                  size="square-sm"
                  @click="walkDecade(-1)"
              >
                <span>
                  <fa-icon :icon="['fas', 'chevron-left']" />
                </span>
              </app-button>
              <app-button type="link" size="sm" disabled class="padding-left-4 padding-right-4">
                {{ ((currentDecade * 14)) }} - {{ ((currentDecade * 14) + 15) }}
              </app-button>
              <app-button type="link" size="square-sm" :icon="['fas', 'chevron-right']" @click="walkDecade(1)">
                <span>
                  <fa-icon :icon="['fas', 'chevron-right']" />
                </span>
              </app-button>
            </app-button-group>
          </div>
          <div class="g-col --span-2"></div>
        </div>
        <template v-for="i in 4">
          <div class="g-row">
            <template v-for="j in 4">
              <div class="g-col --span-6">
                <span class="text-center">
                  <app-button
                      :key="`datepick-year-btn-${((currentDecade * 14) + (((i-1) * 4) + (j-1)))}`"
                      :type="selectedYear === ((currentDecade * 14) + (((i-1) * 4) + (j-1))) ? 'primary' : 'link'"
                      size="sm"
                      class="datepicker-selector"
                      v-model="selectedYear"
                      :value="((currentDecade * 14) + (((i-1) * 4) + (j-1)))"
                      :strong="selectedYear === ((currentDecade * 14) + (((i-1) * 4) + (j-1)))"
                      @clicked="setSelector('month')"
                  >
                    {{ ((currentDecade * 14) + (((i-1) * 4) + (j-1))) }}
                  </app-button>
                </span>
              </div>
            </template>
          </div>
        </template>
      </div>

      <div class="selection-container pick-month">


        <div class="g-row">
          <div class="g-col --span-2">
            <app-button
                type="link"
                size="square-sm"
                @click="walkMonth(-1)"
            >
            <span>
              <fa-icon :icon="['fas', 'chevron-left']" />
            </span>
            </app-button>
          </div>
          <div class="g-col --span-9">
            <app-button
                type="link"
                size="sm"
                center
                class="margin-left-auto padding-right-6"
                @click="setSelector('month')"
            >
            <span>
              <b>{{ useNuxtApp().$dateFromString(`${selectedYear}-${String(selectedMonth).length === 1 ? '0' : ''}${selectedMonth}-01`, 'yyyy-mm-dd', '-').toString().slice(4, 7) }}</b>
            </span>
            </app-button>
          </div>
          <div class="g-col --span-10 flex-align-left">
            <app-button
                type="link"
                size="sm"
                class="padding-left-8 padding-right-4"
                center
                @click="setSelector('year')"
            >
              <span><b>{{ selectedYear }}</b></span>
            </app-button>
          </div>
          <div class="g-col --span-3">

            <app-button
                type="link"
                size="square-sm"
                @click="walkMonth(1)"
            >
            <span>
              <fa-icon :icon="['fas', 'chevron-right']" />
            </span>
            </app-button>
          </div>
        </div>

        <hr>

        <template v-for="i in 3">
          <div class="g-row">
            <template v-for="j in 4">
              <div class="g-col --span-6">
                <span class="text-center">
                  <app-button
                      :key="`datepick-month-btn-${(((i-1) * 4) + j)}`"
                      :type="selectedMonth === ((i-1) * 4) + j ? 'primary' : 'link'"
                      size="sm"
                      v-model="selectedMonth"
                      :value="((i-1) * 4) + j"
                      :strong="selectedMonth === (((i-1) * 4) + j)"
                      @clicked="setSelector('date')"
                  >
                    {{ $_Tt('datepicker_month_name_'+useNuxtApp().$dateFromString(`${selectedYear}-${String(((i-1) * 4) + j).length === 1 ? '0' : ''}${((i-1) * 4) + j}-01`, 'yyyy-mm-dd', '-').toString().slice(4, 7).toLowerCase()).slice(0, 3) }}
                  </app-button>
                </span>
              </div>
            </template>
          </div>
        </template>
      </div>

      <div class="selection-container pick-date">

        <div class="g-row">
          <div class="g-col --span-2">
            <app-button
                type="link"
                size="square-sm"
                @click="walkDay(-1)"
            >
            <span>
              <fa-icon :icon="['fas', 'chevron-left']" />
            </span>
            </app-button>
          </div>
          <div class="g-col --span-11">

            <app-button
                type="link"
                size="sm"
                strong
                class="margin-right-0 margin-left-auto padding-right-6"
                @click="setSelector('month')"
            >
              <strong>{{ useNuxtApp().$dateFromString(`${selectedYear}-${String(selectedMonth).length === 1 ? '0' : ''}${selectedMonth}-01`, 'yyyy-mm-dd', '-').toString().slice(4, 7) }}</strong>
            </app-button>
          </div>
          <div class="g-col --span-9">
            <app-button
                type="link"
                size="sm"
                strong
                class="margin-left-0"
                @click="setSelector('year')"
            >
              <strong>{{ selectedYear }}</strong>
            </app-button>
          </div>
          <div class="g-col --span-3">

            <app-button
                type="link"
                size="sm"
                class="margin-left-auto"
                @click="walkDay(1)"
            >
            <span>
              <fa-icon :icon="['fas', 'chevron-right']" />
            </span>
            </app-button>
          </div>
        </div>

        <hr>

        <div class="g-row">
          <div class="g-col --span-3">&nbsp;</div>
          <template v-for="weekDay in weekDays" :key="`weekday-title-${weekDay.number}`">
            <div class="g-col --span-3" :class="{'highlight': [6, 7].includes(weekDay.number)}">
              <span class="text-center week-title">{{ $_Tt('datepicker_weekday_'+String(weekDay.name).toLowerCase()).slice(0,1) }}</span>
            </div>
          </template>
        </div>

        <template v-for="week in 6">
          <div class="g-row" v-if="null !== getCurrentWeekNumber(week)">
            <div class="g-col --span-3">
              <span class="week-number">{{ $_Tt('datepicker_weekday_week').slice(0,1) }}{{ getCurrentWeekNumber(week) }}</span>
            </div>
            <template v-for="weekDay in weekDays" :key="`weekday-title-${weekDay.number}`">
              <div class="g-col --span-3" :class="{'highlight': [6, 7].includes(weekDay.number)}">
                <template v-if="(((((week-1) * 7) + weekDay.number) - refDaySpan) > 0) && (((((week-1) * 7) + weekDay.number) - refDaySpan) <= refSelectedYearMonthLastDay)">
                  <app-button
                      :key="`datepick-day-btn-${selectedYear}${selectedMonth}${((((week-1) * 7) + weekDay.number) - refDaySpan)}`"
                      :type="parseSelectedDay === ((((week-1) * 7) + weekDay.number) - refDaySpan) ? 'primary' : 'link'"
                      size="square-sm"
                      class="datepicker-selector"
                      v-model="parseSelectedDay"
                      :value="((((week-1) * 7) + weekDay.number) - refDaySpan)"
                      @clicked="setSelectedDate()"
                  >
                    {{ ((((week-1) * 7) + weekDay.number) - refDaySpan) }}
                  </app-button>
                </template>
              </div>
            </template>
          </div>
        </template>
      </div>
      <div class="selection-container pick-time">
        <div class="g-row">
          <div class="g-col --span-12">
            <app-button
                type="link"
                size="sm"
                @click="setSelector('date')"
            >
              {{ useNuxtApp().$dateFormat(currentDateString, format) }}
            </app-button>
          </div>
          <div class="g-col --span-12">
            <span class="margin-left-auto">
              <strong>{{ (String(selectedTimeHour).length === 1 ? '0' : '') + String(selectedTimeHour) }}:{{ `${String(selectedTimeMinute).length === 1 ? '0' : ''}${selectedTimeMinute}` }}</strong>
            </span>
          </div>
        </div>

        <hr>
        <div class="g-row margin-h-auto">
          <div class="g-col --span-18">
            {{ $_Tt('datepicker_hour') }}:
          </div>
          <div class="g-col --span-6">
            <app-button-group class="margin-h-auto margin-bottom-8">
              <app-button
                  :type="timePhase === 0 ? 'primary' : 'secondary'"
                  size="sm-squared"
                  :value="0"
                  v-model="timePhase"
              >
                AM
              </app-button>
              <app-button
                  :type="timePhase === 1 ? 'primary' : 'secondary'"
                  size="sm-squared"
                  :value="1"
                  v-model="timePhase"
              >
                PM
              </app-button>
            </app-button-group>
          </div>
        </div>

        <template v-for="l in 2" :key="`hour-button-${l}`">
          <div class="g-row margin-bottom-4">
            <template v-for="h in 6" :key="`hour-button-${((l - 1) * 6) + (h - 1) + (timePhase * 12)}`">
              <div class="g-col --span-4">
                <app-button
                    :type="(parsedTimeHour === ((l - 1) * 6) + (h - 1) + (timePhase * 12)) ? 'primary' : 'secondary'"
                    size="sm-squared"
                    class="margin-h-auto"
                    :value="((l - 1) * 6) + (h - 1) + (timePhase * 12)"
                    v-model="parsedTimeHour"
                >
                  {{ String(((l - 1) * 6) + (h - 1) + (timePhase * 12)).length === 1 ? '0' : '' }}{{ ((l - 1) * 6) + (h - 1) + (timePhase * 12) }}
                </app-button>
              </div>
            </template>
          </div>
        </template>


        <div class="g-row margin-h-auto margin-top-8">
          <div class="g-col --span-24">
            {{ $_Tt('datepicker_minute') }}:
          </div>
        </div>
        <div class="g-row margin-bottom-4">
          <template v-for="minDec in 6" :key="`hour-button-minute-dec-${minDec}`">
            <div class="g-col --span-4">
              <app-button
                  :type="(parsedTimeMinuteDecimal === ((minDec-1) * 10)) ? 'primary' : 'secondary'"
                  size="sm-squared"
                  class="margin-h-auto"
                  :value="(minDec-1) * 10"
                  v-model="parsedTimeMinuteDecimal"
              >
                {{ String((minDec-1) * 10).length === 1 ? '0': '' }}{{ (minDec-1) * 10 }}
              </app-button>
            </div>
          </template>
        </div>

        <div class="g-row margin-bottom-4">
          <template v-for="minUnit in 10" :key="`hour-button-minute-unit-${minUnit}`">
            <div class="g-col --span-4">
              <app-button
                  :type="(parsedTimeMinuteUnit === (minUnit-1)) ? 'primary' : 'secondary'"
                  size="sm-squared"
                  class="margin-h-auto"
                  :value="minUnit-1"
                  v-model="parsedTimeMinuteUnit"
              >
                {{ String(minUnit-1).length === 1 ? '0': '' }}{{ (minUnit-1) }}
              </app-button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>