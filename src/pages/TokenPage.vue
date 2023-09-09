<template>
  <q-page style="padding-top: 3rem">
    <div class="ff-table">
      <div class="name">Name</div>
      <div class="status">Status</div>
      <div class="actions">actions</div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { keycloak } from 'src/boot/keycloak';
import { Token } from 'src/components/models';
import { TouchPan } from 'quasar';

export default defineComponent({
  name: 'IndexPage',
  components: {},
  setup() {
    const tokens: Ref<Token[]> = ref([]);
    const isEditToken = ref(false);
    const isDeleteTokenOpen = ref(false);
    const selectedToken: Ref<Token | null> = ref(null);
    onMounted(() => {
      if (!keycloak.authenticated) {
        window.location.href = '/';
      }
      keycloak.onReady = () => {
        getAllTokens();
      };
    });
    function getAllTokens() {
      api
        .get('/token', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + keycloak.token?.toString(),
          },
        })
        .then((response) => {
          console.log(response);
          tokens.value = response.data;
        });
    }

    return {
      tokens,
      isEditToken,
      isDeleteTokenOpen,
      selectedToken,
      editFeatureFlag(featureFlag: Token) {
        isEditToken.value = !isEditToken.value;
        selectedToken.value = featureFlag;
      },
      saveFeatureFlag(featureFlag: FeatureFlag) {
        selectedToken.value = null;
        isEditToken.value = false;
        console.log(featureFlag.type);
        api
          .put('/feature-flag/' + featureFlag.name, featureFlag, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + keycloak.token?.toString(),
            },
          })
          .then((response) => {
            console.log(response);
            getAllFeatureFlags();
          });
      },
      changeFeatureFlagStatus(featureFlag: FeatureFlag) {
        featureFlag.enabled = !featureFlag.enabled;
        api
          .put('/feature-flag/' + featureFlag.name, featureFlag, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + keycloak.token?.toString(),
            },
          })
          .then((response) => {
            console.log(response);
            getAllFeatureFlags();
          });
      },
      deleteFeatureFlag(featureFlag: FeatureFlag) {
        api
          .delete('/feature-flag/' + featureFlag.name, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + keycloak.token?.toString(),
            },
          })
          .then(() => {
            selectedFeatureFlag.value = null;
            getAllFeatureFlags();
          });
      },
    };
  },
});
</script>
<style lang="scss">
.ff-table {
  display: table;
  width: 100%;
  .name {
    display: table-cell;
    width: 50%;
  }
  .status {
    display: table-cell;
    width: 45%;
  }
  .actions {
    display: table-cell;
    width: 5%;
  }
}
</style>
