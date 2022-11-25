<template>
  <q-page class="row items-center justify-evenly">
    <h1>WELCOME</h1>
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
