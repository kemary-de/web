<template>
  <q-page style="padding-top: 3rem">
    <div class="ff-table">
      <div class="name">Name</div>
      <div class="status">Status</div>
      <div class="actions">actions</div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="createNew()" />
    </q-page-sticky>
    <TokenElement
      v-for="token in tokens"
      :key="token.id"
      :token="token"
      @edit="editFeatureFlag(token)"
      @changeStatus="changeFeatureFlagStatus(token)"
      @delete="
        selectedToken = token;
        isDeleteTokenOpen = !isDeleteTokenOpen;
      "
    ></TokenElement>
    <q-dialog v-model="isDeleteTokenOpen" persistent>
      <q-card>
        <q-card-section>
          <div class="text-subtitle1">
            Are you sure you want to delete this token?
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Yes, delete"
            color="negative"
            v-close-popup
            @click="deleteToken(selectedToken)"
          />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="isCreateNew"
      class="text-center q-pa-md flex flex-center"
    >
      <q-card>
        <q-card-section class="text-center q-pa-md flex flex-center">
          <table>
            <tr>
              <th>name</th>
              <th>token</th>
            </tr>
            <tr>
              <td>
                <q-input
                  v-model="selectedToken.name"
                  outlined
                  dense
                  maxlength="50"
                ></q-input>
              </td>
              <td>
                {{ selectedToken?.token }}
              </td>
            </tr>
          </table>
        </q-card-section>

        <q-card-actions align="right" v-if="!isShowCreated">
          <q-btn
            flat
            label="Save"
            color="primary"
            v-close-popup
            @click="create(selectedFeatureFlag)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, getCurrentInstance } from 'vue';
import { api } from 'src/boot/axios';
import { keycloak } from 'src/boot/keycloak';
import { Token } from 'src/components/models';
import TokenElement from 'components/TokenElement.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { TokenElement },
  setup() {
    const tokens: Ref<Token[]> = ref([]);
    const isEditToken = ref(false);
    const isDeleteTokenOpen = ref(false);
    const selectedToken: Ref<Token | null> = ref(null);
    const isCreateNew = ref(false);
    const isShowCreated = ref(false);
    const instance = getCurrentInstance();
    onMounted(() => {
      getAllTokens();
    });
    function getAllTokens() {
      api
        .get('/token/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + keycloak.token?.toString(),
          },
        })
        .then((response) => {
          tokens.value = response.data;
        })
        .catch((error) => {
          if (error.response.status === 403) {
            instance?.proxy?.$router.push('/');
          }
        });
    }

    return {
      tokens,
      isEditToken,
      isDeleteTokenOpen,
      selectedToken,
      isCreateNew,
      isShowCreated,
      //editToken(featureFlag: Token) {
      //  isEditToken.value = !isEditToken.value;
      //  selectedToken.value = featureFlag;
      //},
      //saveToken(featureFlag: FeatureFlag) {
      //  selectedToken.value = null;
      //  isEditToken.value = false;
      //  console.log(featureFlag.type);
      //  api
      //    .put('/feature-flag/' + featureFlag.name, featureFlag, {
      //      headers: {
      //        'Content-Type': 'application/json',
      //        Authorization: 'Bearer ' + keycloak.token?.toString(),
      //      },
      //    })
      //    .then((response) => {
      //      console.log(response);
      //      getAllFeatureFlags();
      //    });
      //},
      //changeTokenStatus(token: Token) {
      //  token.valid = !token.valid;
      //  api
      //    .put('/feature-flag/' + token.token, token, {
      //      headers: {
      //        'Content-Type': 'application/json',
      //        Authorization: 'Bearer ' + keycloak.token?.toString(),
      //      },
      //    })
      //    .then((response) => {
      //      console.log(response);
      //      getAllTokens();
      //    });
      //},
      deleteToken(token: Token) {
        api
          .delete('/token/' + token.token, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + keycloak.token?.toString(),
            },
          })
          .then(() => {
            selectedToken.value = null;
            getAllTokens();
          });
      },
      create() {
        api
          .post('/token', selectedToken.value, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + keycloak.token?.toString(),
            },
          })
          .then((response) => {
            getAllTokens();
            selectedToken.value = response.data;
            isCreateNew.value = true;
            isShowCreated.value = true;
          });
      },
      createNew() {
        isCreateNew.value = true;
        selectedToken.value = {
          name: '',
        };
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
