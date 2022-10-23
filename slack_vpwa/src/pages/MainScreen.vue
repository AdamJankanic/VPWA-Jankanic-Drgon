<template>
  <q-page class="row items-center justify-evenly skuska">
    <div
      class="chatbox"
      style="width: 100%; overflow: auto; height: 100%; max-height: 90vh"
    >
      <div class="q-pa-md">
        <div class="q-pa-md">
          <q-infinite-scroll
            @load="onLoad"
            reverse
            style="overflow: auto; height: 90%; box-sizing: content-box"
          >
            <div v-for="message in messages" v-bind:key="message.id">
              <q-chat-message
                v-bind:key="message.id"
                v-if="message.channelID == id_stranky"
                :name="message.name"
                :avatar="message.avatar"
                :text="[message.textMess]"
                :sent="message.sent"
                :bg-color="message.color"
              />
            </div>

            <q-chat-message
              name="Jane"
              avatar="https://cdn.quasar.dev/img/avatar5.jpg"
              :text="['@Alice159 zvyraznena sprava']"
              text-color="black"
              bg-color="accent"
            />

            <div>
              <q-chat-message
                avatar="https://cdn.quasar.dev/img/avatar5.jpg"
                bg-color="grey"
                name="Jane"
              >
                <q-btn-dropdown
                  color="grey"
                  label="Jane is typing..."
                  menu-self="bottom start"
                >
                  <q-list style="width: 300px">
                    <q-item clickable v-close-popup @click="onItemClick">
                      <q-item-section>
                        <q-item-label
                          >nieco tajne pisem... nepozeraj</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-chat-message>
            </div>
          </q-infinite-scroll>
        </div>
      </div>
    </div>

    <q-page-sticky
      position="bottom"
      expand
      style="height: 100%; max-height: 10vh"
    >
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
          <q-btn
            @click="showNotif('bottom-right', 'Jane: ' + inputText)"
            round
            dense
            flat
            icon="send"
          />
        </template>
      </q-input>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const alerts = [{ color: 'teal', message: 'Notification', icon: 'tag_faces' }];

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
  {
    id: 4,
    name: 'Miro Satan',
    avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
    textMess: 'Jojka Markiza',
    sent: false,
    color: 'red',
    channelID: 2,
  },
];

export default {
  setup() {
    const items = ref([{}, {}, {}, {}, {}, {}, {}]);
    const $q = useQuasar();

    return {
      items,
      onLoad(index, done) {
        setTimeout(() => {
          items.value.splice(0, 0, {}, {}, {}, {}, {}, {}, {});
          done();
        }, 0);
      },

      showNotif(position, text) {
        const { color, textColor, multiLine, icon, message, avatar } =
          alerts[0];

        const buttonColor = color ? 'white' : void 0;

        $q.notify({
          color,
          textColor,
          icon: icon,
          message: text === '' ? message : text,
          position,
          avatar,
          multiLine,
          actions: [
            {
              label: 'Reply',
              color: buttonColor,
              handler: () => {
                console.log('reply');
              },
            },
            {
              label: 'Dismiss',
              color: 'yellow',
              handler: () => {
                console.log('dismiss');
              },
            },
          ],
          timeout: 3000,
        });
      },
    };
  },

  data() {
    return {
      inputText: ref(''),
      ph: ref(''),
      dense: ref(false),
      messages,
      id_stranky: this.$route.fullPath.slice(1),
    };
  },

  watch: {
    $route() {
      console.log('cfyhbjnkml,');
      this.id_stranky = this.$route.fullPath.slice(1);
      console.log('nieco,');
    },
  },

  // created() {
  //   let id = this.$route.fullPath;
  // },

  methods: {
    send() {
      let messageText = this.inputText;
      if (messageText === '') {
        return;
      }
      this.inputText = '';
      let obj = {
        id: 4,
        name: 'me',
        avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
        textMess: messageText,
        color: 'blue',
        sent: true,
        channelID: this.id_stranky,
      };
      messages.push(obj);

      console.log(messages);
    },
  },
};
</script>

<style scoped>
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
