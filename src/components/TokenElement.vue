<template>
  <div class="ff-table">
    <div class="name">{{ token.name }}</div>
    <div class="status">
      {{ token.valid ? 'Enabled' : 'Disabled' }}
    </div>
    <div class="actions">
      <q-btn flat icon="more_horiz" @click="showActions"></q-btn>
      <q-dialog v-model="isActionsVisible" :position="'right'">
        <q-card>
          <q-card-section>
            <div class="text">
              <b>{{ token.name }}</b> is
              {{ token.valid ? 'enabled' : 'disabled' }}
            </div>
          </q-card-section>

          <q-card-section
            style="display: flex; flex-direction: column; gap: 1rem"
          >
            <!--q-btn
              label="Edit"
              flat
              primary
              @click="
                $emit('edit', token);
                isActionsVisible = false;
              "
            ></!--q-btn-->
            <q-btn
              label="Delete"
              flat
              color="negative"
              @click="
                $emit('delete', token);
                isActionsVisible = false;
              "
            ></q-btn>
            <!--q-btn
              :label="token.valid ? 'deactivate' : 'activate'"
              flat
              @click="
                $emit('changeStatus', token);
                isActionsVisible = false;
              "
            ></!--q-btn-->
          </q-card-section>

          <!--q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </!--q-card-actions-->
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Token } from './models';

export default defineComponent({
  name: 'FeatureFlagElement',
  props: {
    token: {
      type: Object as () => Token,
      required: true,
    },
  },
  setup() {
    const isActionsVisible = ref(false);
    const showActions = () => {
      isActionsVisible.value = !isActionsVisible.value;
    };
    return {
      showActions,
      isActionsVisible,
    };
  },
  components: {},
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
    .area {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
