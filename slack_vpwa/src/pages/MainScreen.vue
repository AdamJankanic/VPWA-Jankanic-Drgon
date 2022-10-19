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
    
    <div style="width: 100%; overflow: auto;">
      <div class="q-pa-md">
        <q-chat-message
          v-for="message in messages"
          v-bind:key="message.id"
          :name="message.name"
          :avatar="message.avatar"
          :text="[message.textMess]"
          :sent="message.sent"
          :bg-color="message.color"
        />

        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="['@Alice159 zvyraznena sprava']"
          text-color="black"
          bg-color="accent"
        />

        <div>
          <q-chat-message avatar="https://cdn.quasar.dev/img/avatar5.jpg" bg-color="grey" name="Jane">
            <q-btn-dropdown color="grey" label="Jane is typing..."  menu-self="bottom start">
              <q-list style="width: 300px;">
                <q-item clickable v-close-popup @click="onItemClick">
                  <q-item-section>
                    <q-item-label>nieco tajne pisem... nepozeraj</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
        </q-chat-message>
        </div>

      </div>
    </div>

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
    color: 'blue',
    channelID: 1,
  },
  {
    id: 2,
    name: 'Jane',
    avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    textMess: 'Cauko kakauko',
    sent: false,
    color: 'grey',
    channelID: 1,
  },
  {
    id: 3,
    name: 'Jane',
    avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    textMess: 'asdffasd',
    sent: false,
    color: 'grey',
    channelID: 1,
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
      if (messageText === ''){
        return
      };
      this.inputText = '';
      let obj = {
        id: 4,
        name: 'me',
        avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
        textMess: messageText,
        color: 'blue',
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
