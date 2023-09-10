<template>
  <router-view v-if="renderComponent" />
  <div
    v-else
    class="fullscreen text-white text-center q-pa-md flex flex-center"
  >
    <q-spinner-gears size="100px" color="primary" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { keycloak } from 'src/boot/keycloak';

export default defineComponent({
  name: 'App',
  data() {
    return {
      renderComponent: true,
    };
  },
  mounted() {
    this.renderComponent = false;
    keycloak.onReady = async () => {
      this.renderComponent = true;
    };
  },
});
</script>
