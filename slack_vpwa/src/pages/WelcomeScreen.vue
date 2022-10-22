<template>
  <q-page class="row items-center justify-evenly">
    <h1>WELCOME</h1>
    <q-page-sticky position="bottom" expand>
      <command-line class="commandLine">
        <q-input
          bottom-slots
          v-model="inputText"
          label="Message"
          counter
          :dense="dense"
          class="messageInput"
          @keyup.enter="send"
        >
          <template v-slot:before>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar3.jpg" />
            </q-avatar>
          </template>

          <template v-slot:append>
            <q-icon
              v-if="inputText !== ''"
              name="close"
              @click="inputText = ''"
              class="cursor-pointer"
            />
          </template>

          <template v-slot:after>
            <q-btn @click="send" round dense flat icon="send" />
          </template>
        </q-input>
      </command-line>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    return {};
  },

  data() {
    return {
      inputText: ref(''),
      ph: ref(''),
      dense: ref(false),
    };
  },
};
</script>

<style>
.messageInput {
  background-color: #951357;
  width: 100%;
  height: 80px;
  position: absolute;

  left: 0;
  bottom: 0;
}

.my-emoji {
  vertical-align: middle;
  height: 2em;
  width: 2em;
}

.skuska {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 85fr 15fr;
  width: 100%;
}

.chatbox {
  grid-row: 1/2;
}
</style>
