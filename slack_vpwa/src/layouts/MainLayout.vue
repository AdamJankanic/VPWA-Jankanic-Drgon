<template>
  <q-layout view="hHh LpR fFf">
    <div class="grid-box">
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-toolbar>
            <q-btn
              flat
              @click="drawerOn = !drawerOn"
              round
              dense
              icon="menu"
              class="absolute-left"
            />
            <q-btn
              flat
              @click="drawer = !drawer"
              round
              dense
              icon="menu"
              class="absolute-right"
            />
          </q-toolbar>

          <q-toolbar-title class="absolute-center vertical-top">
            {{ displayName }}
            <!-- {{ width_input }} -->
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawerOn" :width="300" :breakpoint="800" side="left">
        <q-btn flat @click="createGroup = true" round dense icon="add">
          Add channel</q-btn
        >
        <!-- 
        <q-list bordered style="overflow: auto; height: calc(100% - 115px)">
          <q-item style="background-color: grey">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white"> S </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>Slack</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-icon
                name="done"
                color="green"
                size="md"
                @click="print('Accept')"
              />
            </q-item-section>

            <q-item-section>
              <q-icon
                name="close"
                color="red"
                size="md"
                @click="print('Decline')"
              />
            </q-item-section>
          </q-item>

          <q-item
            v-for="(channel, index) in channels"
            v-bind:key="channel.id"
            class="q-my-sm"
            clickable
            v-ripple
            @click="changePage(channel.id.toString(), channel.name)"
          >
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{ channel.letter }}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ channel.name }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-icon v-if="channel.public" name="people" />
              <q-icon v-else name="lock" />
            </q-item-section>

            <q-item-section>
              <q-icon @click="leaveChannel(index)" name="delete" />
            </q-item-section>
          </q-item>
        </q-list> -->

        <q-scroll-area style="height: calc(100% - 100px)">
          <q-list>
            <q-item
              v-for="(channel, index) in channels"
              :key="index"
              clickable
              v-ripple
              @click="setActiveChannel(channel)"
            >
              <q-item-section>
                <q-item-label lines="1">
                  {{ channel }}
                </q-item-label>
                <q-item-label class="conversation__summary" caption>
                  {{ lastMessageOf(channel)?.content || '' }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <!--q-item-label caption>
                  {{ channel }}
                </q-item-label-->
                <q-icon name="keyboard_arrow_down" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <div class="flex shadow-up-10 profile">
          <div
            class="flex justify-around items-center full-width q-pl-md q-pr-md"
          >
            <q-avatar size="xl">
              <img :src="`https://cdn.quasar.dev/img/avatar3.jpg`" />
            </q-avatar>
            <div class="nickname">
              <p class="q-mb-none text-bold">Alice159</p>
            </div>
          </div>
          <div
            class="flex justify-around items-center full-width q-pl-md q-pr-md"
          >
            <div class="icons">
              <q-icon
                size="md"
                name="chat_bubble"
                class="q-mr-xs"
                :class="status"
              />
              <q-icon
                @click="small = true"
                size="md"
                name="settings"
                color="grey"
              />
            </div>
            <q-btn @click="logout" class="btn two-rows">Log Out</q-btn>
          </div>
        </div>
      </q-drawer>

      <q-dialog v-model="createGroup">
        <q-card style="width: 500px">
          <q-card-section>
            <div class="text-h6">Create channel</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input outlined v-model="channelName" label="Channel name" />

            <div>
              <q-toggle
                false-value="Private"
                :label="`${privatePublic}`"
                true-value="Public"
                color="green"
                v-model="privatePublic"
              />
              <!-- <q-icon size="md" name="chat_bubble" color="green"  /> -->
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="OK" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="small">
        <q-card style="width: 500px">
          <q-card-section>
            <div class="text-h6">OPTIONS</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="flexbox">
              <h6>Online/Offline</h6>
              <q-toggle
                false-value="Offline"
                :label="`${onnlineOffline}`"
                true-value="Online"
                color="green"
                v-model="onnlineOffline"
              />
              <!-- <q-icon size="md" name="chat_bubble" color="green"  /> -->
            </div>
            <div class="flexbox">
              <h6>Do Not Disturb</h6>
              <q-toggle
                false-value="Off"
                :label="`${DNB}`"
                true-value="On"
                color="red"
                v-model="DNB"
              />
              <!-- <q-icon size="md" name="chat_bubble" color="green"  /> -->
            </div>
            <div class="flexbox">
              <h6>Notifications</h6>
              <q-toggle
                false-value="Off"
                :label="`${notifications}`"
                true-value="On"
                color="green"
                v-model="notifications"
              />
              <!-- <q-icon size="md" name="chat_bubble" color="green"  /> -->
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="OK" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="300"
        :breakpoint="1045"
        side="right"
        bordered
        style="overflow: none"
      >
        <!-- <q-toolbar-title class="top-center">Users</q-toolbar-title> -->
        <p class="users">Users</p>

        <q-scroll-area class="fit" style="height: 85vh !important">
          <q-list>
            <q-item
              v-for="contact in users"
              :key="contact.id"
              class="q-mb-sm"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-avatar>
                  <img :src="`https://cdn.quasar.dev/img/${contact.avatar}`" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ contact.name }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="chat_bubble" :color="contact.active" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container> <router-view></router-view> </q-page-container>
    </div>

    <q-footer>
      <q-toolbar
        class="bg-grey-3 text-black row fixed-bottom"
        :style="{
          left: [drawerOn ? 300 : 0] + 'px',
          // width:
          //   [
          //     [drawerOn && drawer]
          //       ? $q.screen.width - 2 * 300
          //       : [drawerOn && !drawer]
          //       ? $q.screen.width - 300
          //       : [!drawerOn && drawer]
          //       ? $q.screen.width - 300
          //       : $q.screen.width,
          //     ,
          //   ] + 'px',
        }"
      >
        <q-input
          v-model="message"
          :disable="loading"
          @keydown.enter.prevent="send"
          rounded
          outlined
          dense
          class="WAL__field col-grow q-mr-sm"
          bg-color="white"
          placeholder="Type a message"
        />
        <q-btn :disable="loading" @click="send" round flat icon="send" />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
// let channels = [
//   {
//     id: 1,
//     name: 'VPWA',
//     letter: 'V',
//     public: true,
//   },
//   {
//     id: 2,
//     name: 'General',
//     letter: 'G',
//     public: false,
//   },
//   {
//     id: 3,
//     name: 'HaHa Room',
//     letter: 'H',
//     public: false,
//   },
//   {
//     id: 4,
//     name: 'HaHa Room1',
//     letter: 'H',
//     public: true,
//   },
//   {
//     id: 5,
//     name: 'HaHa Room2',
//     letter: 'H',
//     public: true,
//   },
//   {
//     id: 6,
//     name: 'HaHa Room3',
//     letter: 'H',
//     public: true,
//   },
//   {
//     id: 7,
//     name: 'HaHa Room4',
//     letter: 'H',
//     public: true,
//   },
//   {
//     id: 8,
//     name: 'HaHa Room5',
//     letter: 'H',
//     public: true,
//   },
//   {
//     id: 9,
//     name: 'HaHa Room6',
//     letter: 'H',
//     public: true,
//   },
//   {
//     id: 10,
//     name: 'HaHa Room7',
//     letter: 'H',
//     public: true,
//   },
//   {
//     id: 11,
//     name: 'HaHa Room8',
//     letter: 'H',
//     public: true,
//   },
//
// ];

// let channels = [];

const users = [
  {
    id: 5,
    name: 'Brunhilde Panswick',
    email: 'bpanswick4@csmonitor.com',
    avatar: 'avatar2.jpg',
    active: 'green',
  },
  {
    id: 6,
    name: 'Winfield Stapforth',
    email: 'wstapforth5@pcworld.com',
    avatar: 'avatar6.jpg',
    active: 'grey',
  },
  {
    id: 5,
    name: 'Brunhilde Panswick',
    email: 'bpanswick4@csmonitor.com',
    avatar: 'avatar2.jpg',
    active: 'green',
  },
  {
    id: 6,
    name: 'Winfield Stapforth',
    email: 'wstapforth5@pcworld.com',
    avatar: 'avatar6.jpg',
    active: 'grey',
  },
  {
    id: 5,
    name: 'Brunhilde Panswick',
    email: 'bpanswick4@csmonitor.com',
    avatar: 'avatar2.jpg',
    active: 'green',
  },
  {
    id: 6,
    name: 'Winfield Stapforth',
    email: 'wstapforth5@pcworld.com',
    avatar: 'avatar6.jpg',
    active: 'grey',
  },
  {
    id: 5,
    name: 'Brunhilde Panswick',
    email: 'bpanswick4@csmonitor.com',
    avatar: 'avatar2.jpg',
    active: 'green',
  },
  {
    id: 6,
    name: 'Winfield Stapforth',
    email: 'wstapforth5@pcworld.com',
    avatar: 'avatar6.jpg',
    active: 'grey',
  },
  {
    id: 5,
    name: 'Brunhilde Panswick',
    email: 'bpanswick4@csmonitor.com',
    avatar: 'avatar2.jpg',
    active: 'green',
  },
  {
    id: 6,
    name: 'Winfield Stapforth',
    email: 'wstapforth5@pcworld.com',
    avatar: 'avatar6.jpg',
    active: 'grey',
  },
  {
    id: 5,
    name: 'Brunhilde Panswick',
    email: 'bpanswick4@csmonitor.com',
    avatar: 'avatar2.jpg',
    active: 'green',
  },
  {
    id: 6,
    name: 'Winfield Stapforth',
    email: 'wstapforth5@pcworld.com',
    avatar: 'avatar6.jpg',
    active: 'grey',
  },
];

let status = 'online';

export default {
  computed: {
    ...mapGetters('channels', {
      channels: 'joinedChannels',
      lastMessageOf: 'lastMessageOf',
    }),
    activeChannel() {
      return this.$store.state.channels.active;
    },
  },

  data() {
    return {
      displayName: 'Slack',
      status,
      // leftDrawerOpen: false,
      message: '',
      loading: false,
    };
  },
  setup() {
    return {
      channelName: ref(''),
      drawer: ref(false),
      small: ref(false),
      drawerOn: ref(true),
      onnlineOffline: ref('Online'),
      notifications: ref('On'),
      privatePublic: ref('Public'),
      DNB: ref('Off'),
      createGroup: ref(false),
      users,
      onlineColor: 'grey',
    };
  },

  methods: {
    print(text) {
      console.log(text);
    },
    logout() {
      this.$router.push('/auth');
    },
    leaveChannel(index) {
      this.channels.splice(index, 1);
    },
    changePage(to, channel_name) {
      this.displayName = channel_name;
      this.$router.push(to);
    },
    async send() {
      this.loading = true;
      await this.addMessage({
        channel: this.activeChannel,
        message: this.message,
      });
      this.message = '';
      this.loading = false;
    },
    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE',
    }),
    ...mapActions('auth', ['logout']),
    ...mapActions('channels', ['addMessage']),
  },
};
</script>

<style scoped>
.flexbox {
  display: flex;
}

.grid-box {
  /* display: grid; */
  /* grid-template-columns: 300px 1fr 300px; */
}

.icons {
  grid-column: 2/3;
  display: flex;
  justify-content: space-between;
}

.nickname {
  font-size: 16px;
}

.q-icon {
  cursor: pointer;
}

.profile {
  background-color: #d9d9d9;
}

.online {
  color: #4bb543;
}
.dnd {
  color: #ff8000;
}
.offline {
  color: grey;
}

.users {
  font-size: 24px;
}

.q-item__label.q-item__label--caption.text-caption.conversation__summary {
  max-width: 230px;
  overflow: hidden;
}
</style>
