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
              @click="rightDrawerClick()"
              round
              dense
              icon="menu"
              class="absolute-right"
            />
          </q-toolbar>

          <q-toolbar-title class="absolute-center vertical-top">
            {{ nameActiveChannel }}
            <!-- {{ width_input }} -->
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawerOn" :width="300" :breakpoint="800" side="left">
        <q-btn flat @click="createGroup = true" round dense icon="add">
          Add channel</q-btn
        >
        <q-scroll-area style="height: calc(100% - 100px)">
          <q-list>
            <q-item
              v-for="(channel, index) in channels"
              :key="index"
              clickable
              v-ripple
              @click="setActiveChannel(channel), (drawer = false)"
            >
              <q-item-section>
                <q-item-label lines="1">
                  {{ channel }}
                </q-item-label>
                <q-item-label class="conversation__summary" caption>
                  <!-- {{ lastMessageOf(channel)?.content || '' }} -->
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
              <p class="q-mb-none text-bold">{{ nickname.nickname }}</p>
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
            <q-input outlined v-model="newChannelName" label="Channel name" />

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
            <q-btn
              flat
              label="OK"
              v-close-popup
              @click="createChannel(newChannelName, privatePublic)"
            />
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
                :label="`${onlineOffline}`"
                true-value="Online"
                color="green"
                v-model="onlineOffline"
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
            <q-btn flat label="OK" @click="changeSettings(onlineOffline, DNB, notifications)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-drawer
        v-model="drawer"
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
              v-for="(contact, index) in users"
              :key="index"
              class="q-mb-sm"
              clickable
              v-ripple
            >
              <q-item-section>
                <q-item-label>{{ contact }}</q-item-label>
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
import { useQuasar } from 'quasar';
import { watch } from 'vue';
let status = 'online';

export default {
  computed: {
    ...mapGetters('channels', {
      channels: 'getJoinedChannels',
      lastMessageOf: 'lastMessageOf',
      users: 'getJoinedUsers',
    }),

    ...mapGetters('auth', {
      nickname: 'getUser',
    }),

    activeChannel() {
      return this.$store.state.channels.active;
    },

    nameActiveChannel() {
      let nameOfChannel = this.activeChannel || 'Slack';
      return nameOfChannel;
    },
  },

  data() {
    return {
      displayName: 'Slack',
      status,
      message: '',
      loading: false,
    };
  },
  setup() {
    const $q = useQuasar();

    watch(() => {
      console.log($q.appVisible);
    });
    return {
      channelName: ref('Slack'),
      drawer: ref(false),
      small: ref(false),
      drawerOn: ref(true),
      onlineOffline: ref('Online'),
      notifications: ref('On'),
      privatePublic: ref('Public'),
      DNB: ref('Off'),
      createGroup: ref(false),
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
    changePage() {
      this.$router.push('/');
    },
    async send() {
      this.loading = true;
      if (this.message === '/list') {
        await this.loadAllUsersInChannel({
          channelName: this.activeChannel,
        });
        this.drawer = true;
      } else if (this.message === '/cancel') {
        await this.leaveChannel({
          channelName: this.activeChannel,
          user: this.nickname.id,
        });
        this.setActiveChannel('Slack');
        this.drawer = false;
      }
      //adding message to database
      else if (this.nameActiveChannel !== 'Slack') {
        await this.addMessage({
          channel: this.activeChannel,
          message: this.message,
        });
      } else {
        alert('Please select a channel to send messages');
      }
      this.message = '';
      this.loading = false;
    },
    async createChannel(newChannelName, privatePublic) {
      if (newChannelName !== '') {
        await this.addChannel({
          owner: this.nickname.id,
          newChannelName: newChannelName,
          privatePublic: privatePublic,
        });
        await this.$store.dispatch('channels/join', newChannelName, {
          root: true,
        });
      }
    },

    async changeSettings(onlineOffline, DNB, notifications){+
      console.log(onlineOffline, DNB, notifications);
      await this.modifySettings({
        owner: this.nickname.id,
        onlineOffline: onlineOffline, 
        DNB: DNB,
        notifications: notifications,
      })

    },

    async rightDrawerClick() {
      this.drawer = !this.drawer;
      if (this.drawer) {
        await this.loadAllUsersInChannel({
          channelName: this.activeChannel,
        });
      }
    },
    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE',
    }),
    ...mapActions('auth', ['logout']),
    ...mapActions('channels', ['addMessage']),
    ...mapActions('channels', ['loadAllUsersInChannel']),
    ...mapActions('channels', ['addChannel']),
    ...mapActions('channels', ['leaveChannel']),
    ...mapActions('channels', ['modifySettings']),
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
