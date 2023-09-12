<template>
  <q-page style="padding-top: 3rem">
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="createNew()" />
    </q-page-sticky>
    <div class="ff-table">
      <div class="name">Name</div>
      <div class="status">Status</div>
      <div class="actions">actions</div>
    </div>
    <FeatureFlagElement
      v-for="feature in featureFlags"
      :key="feature.id"
      :feature-flag="feature"
      @edit="editFeatureFlag(feature)"
      @changeStatus="changeFeatureFlagStatus(feature)"
      @delete="
        selectedFeatureFlag = feature;
        isDeleteFeatureFlagOpen = !isDeleteFeatureFlagOpen;
      "
    ></FeatureFlagElement>
    <q-dialog v-model="isDeleteFeatureFlagOpen" persistent>
      <q-card>
        <q-card-section>
          <div class="text-subtitle1">
            Are you sure you want to delete this feature flag?
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Yes, delete"
            color="negative"
            v-close-popup
            @click="deleteFeatureFlag(selectedFeatureFlag)"
          />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="isEditFeatureFlag"
      full-width
      class="text-center q-pa-md flex flex-center"
    >
      <q-card v-if="selectedFeatureFlag">
        <q-card-section>
          <div class="text" v-if="!isCreatingNew">
            <b>{{ selectedFeatureFlag.name }}</b> is
            {{ selectedFeatureFlag.enabled ? 'enabled' : 'disabled' }}
          </div>
        </q-card-section>

        <q-card-section class="text-center q-pa-md flex flex-center">
          <table>
            <tr>
              <th>name</th>
              <th>enabled</th>
              <th>type</th>
              <th>content/value</th>
              <th>createdAt</th>
              <th>updatedAt</th>
            </tr>
            <tr>
              <td>
                <q-input
                  v-model="selectedFeatureFlag.name"
                  outlined
                  dense
                  maxlength="50"
                ></q-input>
              </td>
              <q-toggle
                v-model="selectedFeatureFlag.enabled"
                color="primary"
              ></q-toggle>
              <td>
                <q-select
                  v-model="selectedFeatureFlag.type"
                  outlined
                  dense
                  :options="['BOOLEAN', 'MULTI']"
                ></q-select>
              </td>
              <td>
                <q-input
                  v-if="selectedFeatureFlag.type === 'MULTI'"
                  v-model="selectedFeatureFlag.content"
                  outlined
                  dense
                  maxlength="50"
                ></q-input>
                <q-toggle
                  v-else-if="selectedFeatureFlag.type === 'BOOLEAN'"
                  v-model="selectedFeatureFlag.value"
                  color="primary"
                ></q-toggle>
              </td>
              <td>
                {{
                  `${new Date(
                    selectedFeatureFlag.createdAt
                  ).getDay()}.${new Date(
                    selectedFeatureFlag.createdAt
                  ).getMonth()}.${new Date(
                    selectedFeatureFlag.createdAt
                  ).getFullYear()}`
                }}
              </td>
              <td>
                {{
                  `${new Date(
                    selectedFeatureFlag.updatedAt
                  ).getDay()}.${new Date(
                    selectedFeatureFlag.updatedAt
                  ).getMonth()}.${new Date(
                    selectedFeatureFlag.updatedAt
                  ).getFullYear()}`
                }}
              </td>
            </tr>
          </table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Save"
            color="primary"
            v-close-popup
            @click="saveFeatureFlag(selectedFeatureFlag)"
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
import FeatureFlagElement from 'components/FeatureFlagElement.vue';
import { FeatureFlag } from 'src/components/models';

export default defineComponent({
  name: 'IndexPage',
  components: { FeatureFlagElement },
  setup() {
    const featureFlags: Ref<FeatureFlag[]> = ref([]);
    const isEditFeatureFlag = ref(false);
    const selectedFeatureFlag: Ref<FeatureFlag | null> = ref(null);
    const isDeleteFeatureFlagOpen = ref(false);
    const isCreatingNew = ref(false);
    const instance = getCurrentInstance();

    onMounted(() => {
      getAllFeatureFlags();
      keycloak.onReady = () => {
        getAllFeatureFlags();
      };
    });
    function getAllFeatureFlags() {
      api
        .get('/feature-flag/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + keycloak.token?.toString(),
          },
        })
        .then((response) => {
          featureFlags.value = response.data;
        })
        .catch((error) => {
          if (error.response.status === 403) {
            instance?.proxy?.$router.push('/');
          }
        });
    }

    return {
      featureFlags,
      isEditFeatureFlag,
      isDeleteFeatureFlagOpen,
      selectedFeatureFlag,
      isCreatingNew,
      editFeatureFlag(featureFlag: FeatureFlag) {
        isEditFeatureFlag.value = !isEditFeatureFlag.value;
        selectedFeatureFlag.value = featureFlag;
      },
      saveFeatureFlag(featureFlag: FeatureFlag) {
        if (isCreatingNew.value) {
          featureFlag.createdAt = new Date();
          api
            .post('/feature-flag', selectedFeatureFlag.value, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + keycloak.token?.toString(),
              },
            })
            .then(() => {
              getAllFeatureFlags();
            });
        } else {
          selectedFeatureFlag.value = null;
          isEditFeatureFlag.value = false;
          api
            .put('/feature-flag/' + featureFlag.name, featureFlag.value, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + keycloak.token?.toString(),
              },
            })
            .then(() => {
              getAllFeatureFlags();
            });
        }
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
      createNew() {
        isCreatingNew.value = true;
        isEditFeatureFlag.value = !isEditFeatureFlag.value;
        selectedFeatureFlag.value = {
          name: '',
          enabled: false,
          type: 'BOOLEAN',
          content: '',
          value: false,
          createdAt: new Date(),
          updatedAt: new Date(),
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
