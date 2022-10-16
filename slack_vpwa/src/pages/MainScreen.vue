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
      <q-chat-message
        :text="['Have you seen Quasar?']"
        sent
        text-color="white"
        bg-color="primary"
      >
        <template v-slot:name>me</template>
        <template v-slot:stamp>7 minutes ago</template>
        <template v-slot:avatar>
          <img
            class="q-message-avatar q-message-avatar--sent"
            src="https://cdn.quasar.dev/img/avatar3.jpg"
          />
        </template>
      </q-chat-message>

      <q-chat-message bg-color="amber">
        <template v-slot:name>Mary</template>
        <template v-slot:avatar>
          <img
            class="q-message-avatar q-message-avatar--received"
            src="https://cdn.quasar.dev/img/avatar2.jpg"
          />
        </template>

        <div>
          Already building an app with it...
          <img
            src="https://cdn.quasar.dev/img/discord-qeart.png"
            class="my-emoji"
          />
        </div>

        <q-spinner-dots size="2rem" />
      </q-chat-message>
    </div>

    <q-input
      bottom-slots
      v-model="text"
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
          v-if="text !== ''"
          name="close"
          @click="text = ''"
          class="cursor-pointer"
        />
      </template>

      <template v-slot:after>
        <q-btn round dense flat icon="send" />
      </template>
    </q-input>
  </q-page>
</template>

<script lang="ts">
import { ref } from 'vue';
const contacts = [
  {
    id: 1,
    name: 'Ruddy Jedrzej',
    email: 'rjedrzej0@discuz.net',
    letter: 'R',
  },
  {
    id: 2,
    name: 'Mallorie Alessandrini',
    email: 'malessandrini1@marketwatch.com',
    letter: 'M',
  },
  {
    id: 3,
    name: 'Elisabetta Wicklen',
    email: 'ewicklen2@microsoft.com',
    letter: 'E',
  },
  {
    id: 4,
    name: 'Seka Fawdrey',
    email: 'sfawdrey3@wired.com',
    letter: 'S',
  },
];

const offline = [
  {
    id: 5,
    name: 'Brunhilde Panswick',
    email: 'bpanswick4@csmonitor.com',
    avatar: 'avatar2.jpg',
  },
  {
    id: 6,
    name: 'Winfield Stapforth',
    email: 'wstapforth5@pcworld.com',
    avatar: 'avatar6.jpg',
  },
];

export default {
  setup() {
    return {
      text: ref(''),
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
</style>
