<template>
  <q-page class="col items-center justify-evenly text-center">
    <h1 class="text-h1">Welcome to Kemary</h1>
    <strong class="text-h3">What is Kemary?</strong>
    <p class="text-h5">
      Kemary is a feature flag management tool that allows you to manage your
      feature flags in a centralized way.
    </p>
    <q-btn
      class="text-h5"
      color="primary"
      label="Get Started"
      unelevated
      @click="$router.push('/register')"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: {},
  setup() {
    return {};
  },
});
</script>
