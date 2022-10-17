<template>
  <q-page class="row items-center justify-evenly">
    <!-- <div style="width: 100%">
      <q-chat-message
        name="me"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="['hey, how are you?']"
        stamp="7 minutes ago"
        sent
        bg-color="amber-7"
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
        :text="[
          'doing fine, how r you?',
          'I just feel like typing a really, really, REALLY long message to annoy you...',
        ]"
        size="6"
        stamp="4 minutes ago"
        text-color="white"
        bg-color="primary"
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
        :text="['Did it work?']"
        stamp="1 minutes ago"
        size="8"
        text-color="white"
        bg-color="primary"
      />
    </div> -->

    <div style="width: 100%">
      <div>
        <q-chat-message
          v-for="message in messages"
          v-bind:key="message.id"
          :name="message.name"
          :avatar="message.avatar"
          :text="[message.textMess]"
          :sent="message.sent"
        />

        <!-- <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="['Did it work?']"
          stamp="1 minutes ago"
          size="8"
          text-color="white"
          bg-color="primary"
        /> -->
      </div>
    </div>

    <q-input
      bottom-slots
      v-model="inputText"
      label="Label"
      counter
      :dense="dense"
      class="messageInput"
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
  </q-page>
</template>

<script>
import { ref } from 'vue';

let messages = [
  {
    id: 1,
    name: 'me',
    avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
    textMess: 'Ahojdaaaa',
    sent: true,
  },
  {
    id: 2,
    name: 'Jane',
    avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    textMess: 'Cauko kakauko',
    sent: false,
  },
];

export default {
  data() {
    return {
      inputText: ref(''),
      ph: ref(''),
      dense: ref(false),
      messages,
    };
  },

  methods: {
    send() {
      let messageText = this.inputText;
      this.inputText = '';
      let obj = {
        id: 4,
        name: 'me',
        avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
        textMess: messageText,
        sent: true,
      };
      messages.push(obj);

      console.log(messages);
    },
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
</style>
