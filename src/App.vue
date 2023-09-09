<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  //mounted() {
  //  if (this.$keycloak.authenticated) {
  //    this.$api.defaults.headers.common.Authorization = `Bearer ${this.$keycloak.token?.toString()}`;
  //  }
  //},
});
</script>
