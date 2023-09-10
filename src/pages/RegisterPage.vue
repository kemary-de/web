<template>
  <q-page class="col items-center justify-evenly text-center">
    <h1 class="text-h1">Register with Kemary</h1>
    <div v-if="!isRegistering">
      <q-input v-model="email" label="email" type="email"></q-input>
      <q-input
        v-model="firstName"
        label="first name"
        type="text"
        maxlength="40"
      ></q-input>
      <q-input
        v-model="lastName"
        type="text"
        label="last name"
        maxlength="40"
      ></q-input>
      <q-btn
        class="text-h5"
        color="primary"
        label="Register"
        unelevated
        @click="handleRegister()"
      />
    </div>
    <div v-else>
      <div class="text-h2">Registering...</div>
      <div class="text-h5">
        Please check your email to confirm and set a password.
      </div>
      <q-spinner-gears size="100px" color="primary" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { api } from 'boot/axios';

export default defineComponent({
  name: 'RegisterPage',
  components: {},
  setup() {
    const email = ref<string>('');
    const firstName = ref<string>('');
    const lastName = ref<string>('');
    const isRegistering = ref<boolean>(false);
    return {
      email,
      firstName,
      lastName,
      isRegistering,
      handleRegister() {
        api
          .post('/register', {
            email: email.value,
            firstName: firstName.value,
            lastName: lastName.value,
          })
          .then((response) => {
            isRegistering.value = true;
            console.log(response);
          });
      },
    };
  },
});
</script>
