<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Kemary </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>
        <q-item
          clickable
          @click="$keycloak.login()"
          v-if="$keycloak && $keycloak.authenticated === false"
        >
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Login</q-item-label>
            <q-item-label caption>Login into your account</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          @click="$keycloak.register()"
          v-if="$keycloak && $keycloak.authenticated === false"
        >
          <q-item-section avatar>
            <q-icon name="person_add" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Register</q-item-label>
            <q-item-label caption>Create your account</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="$keycloak.logout()" v-else>
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
        <div v-if="$keycloak && $keycloak.authenticated">
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'Feature Flags',
    caption: 'manage feature flags',
    icon: 'flag',
    link: '/feature-flags',
  },
  {
    title: 'Tokens',
    caption: 'manage tokens, you need them to use feature flags',
    icon: 'vpn_key',
    link: '/token',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      goToLogin() {
        console.log('go to login');
      },
    };
  },
});
</script>
