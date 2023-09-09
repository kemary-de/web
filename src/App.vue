<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { keycloak } from 'src/boot/keycloak';

export default defineComponent({
  name: 'App',
  async mounted() {
    if (this.$keycloak && this.$keycloak.authenticated) {
      this.$api.defaults.headers.common.Authorization = `Bearer ${this.$keycloak.token?.toString()}`;
    }
  },
  setup() {
    keycloak.onReady = () => {
      return {};
    };
  },
});
</script>
