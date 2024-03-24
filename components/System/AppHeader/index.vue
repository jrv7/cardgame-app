<script setup lang="ts">
const localePath = useLocalePath();
const {locales, locale, setLocale} = useI18n();
const route = useRoute();
const router = useRouter();
const authHandler = useOauthServerHandler();

const authState = useAuthState();

const userRole = computed(() => {
  if (authState.value.user.roles?.includes('ROLE_SUPERUSER')) {
    return useNuxtApp().$_Tt('administrator');
  } else if (authState.value.user.roles?.includes('ROLE_ADMIN')) {
    return useNuxtApp().$_Tt('super_user');
  } else {
    return useNuxtApp().$_Tt('user');
  }
});

const menuOptions = computed(() => {
  return [
    { value: 1, path: 'cards', text: 'cards', description: 'cards_list_description', icon: 'hat-wizard'},
    { value: 2, path: 'users', text: 'users', description: 'users_list_description', icon: 'user'},
    { value: 3, path: 'consumer', text: 'consumer', description: 'consumer_description', icon: 'cogs'},
  ];
});

const selectedMenu = computed({
  get() {
    const parts = route.path.split('/');
    console.log('Showing menus', parts);
    return menuOptions.value.find(i => parts.includes(i.path))?.value || 1;
  },
  set(value:number) {
    const selOption = menuOptions.value.find(i => i.value === value);

    if (selOption) {
      console.log('Setting menu as ', selOption.path)
      router.push({path: `/${selOption.path}`});
    } else {
      router.push({path: '/'});
    }
  }
});

const username = computed(() => {
  return authState.value.user.fullName ?? (authState.value.user.name && authState.value.user.lastName ? `${authState.value.user.name} ${authState.value.user.lastName}` : authState.value.user.name)
})

const handleLogOut = async () => {
  await authHandler.destroySession()
      .then(() => {
        router.push({ path: '/auth/login' });
      })
}
</script>

<template>
  <div class="system-header">
    <ul class="header-list">
      <li class="separator" />

      <li>
        <app-input-select
            left-icon="user"
            v-model="selectedMenu"
            :options="menuOptions"
        ></app-input-select>
      </li>

      <li class="spacer" />

      <li>
        <span>{{ username }}</span>
      </li>

      <li class="separator" />

      <li>
        <span>{{ userRole }}</span>
      </li>

      <li class="separator" />

      <li>
        <app-button-select
            type="link"
            size="xm"
            class="margin-v-auto margin-left-auto margin-right-4"
        >
          <template #button-slot>
            <span>
              <fa-icon :icon="['fas', 'language']" />
            </span>
          </template>

          <app-card
              class="--width-px-200 padding-v-8"
              visible
          >
            <ul class="languages-list">
              <template v-for="lang in locales" :key="lang">
                <li>
                  <span class="flag-icon">
                    <img :src="`/media/icons/language/country-flag-${lang.code}.png`" :alt="`language-${lang.code}`">
                  </span>
                  <app-button
                      type="link"
                      size="sm"
                      align-text="left"
                      class="lang-name"
                      :disabled="lang.code === locale"
                      @click="setLocale(lang.code)"
                  >{{ $_Tt(lang.code) }}</app-button>
                </li>
              </template>
            </ul>
          </app-card>
        </app-button-select>
      </li>

      <li class="separator" />

      <li>
        <app-button
            type="link"
            size="square-xs"
            @click="handleLogOut()"
        >
          <fa-icon :icon="['fas', 'power-off']" />
        </app-button>
      </li>
      <li class="separator invisible" />
    </ul>
  </div>
</template>

<style scoped>

</style>