<template>
  <q-layout view="hHh LpR fFf">
    <div class="grid">
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-toolbar>
            <q-btn
              flat
              @click="drawer = !drawer"
              round
              dense
              icon="menu"
              class="absolute-right"
            />

            <q-btn
              flat
              @click="createGroup = true"
              round
              dense
              icon="add"
              class="absoulte-left"
            />
          </q-toolbar>

          <q-toolbar-title class="absolute-center vertical-top">
            {{ displayName }}
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawerOn"
        show-if-above
        :width="300"
        :breakpoint="500"
        side="left"
      >
        <q-list bordered style="overflow: auto; height: calc(100% - 80px)">
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
        </q-list>

        <div class="flex absolute-bottom profile">
          <q-avatar size="xl" class="two_rows">
            <img :src="`https://cdn.quasar.dev/img/avatar3.jpg`" />
          </q-avatar>
          <div class="nickname">
            <p>Alice159</p>
          </div>
          <div class="icons">
            <q-icon size="md" name="chat_bubble" color="green" />
            <q-icon
              @click="small = true"
              size="md"
              name="settings"
              color="grey"
            />
          </div>
          <button @click="logout" class="btn two_rows">Log Out</button>
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
        :breakpoint="500"
        side="right"
        bordered
      >
        <q-toolbar-title class="top-center">Users</q-toolbar-title>
        <q-scroll-area class="fit">
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
  </q-layout>
</template>

<script>
import { ref } from 'vue';

let channels = [
  {
    id: 1,
    name: 'VPWA',
    letter: 'V',
    public: true,
  },
  {
    id: 2,
    name: 'General',
    letter: 'G',
    public: false,
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
    public: false,
  },
  {
    id: 4,
    name: 'HaHa Room1',
    letter: 'H',
    public: true,
  },
  {
    id: 5,
    name: 'HaHa Room2',
    letter: 'H',
    public: true,
  },
  {
    id: 6,
    name: 'HaHa Room3',
    letter: 'H',
    public: true,
  },
  {
    id: 7,
    name: 'HaHa Room4',
    letter: 'H',
    public: true,
  },
  {
    id: 8,
    name: 'HaHa Room5',
    letter: 'H',
    public: true,
  },
  {
    id: 9,
    name: 'HaHa Room6',
    letter: 'H',
    public: true,
  },
  {
    id: 10,
    name: 'HaHa Room7',
    letter: 'H',
    public: true,
  },
  {
    id: 11,
    name: 'HaHa Room8',
    letter: 'H',
    public: true,
  },
  {
    id: 12,
    name: 'HaHa Room9',
    letter: 'H',
    public: true,
  },
  {
    id: 13,
    name: 'HaHa Room10',
    letter: 'H',
    public: true,
  },
  {
    id: 14,
    name: 'HaHa Room11',
    letter: 'H',
    public: true,
  },
  {
    id: 15,
    name: 'HaHa Room12',
    letter: 'H',
    public: true,
  },
  {
    id: 16,
    name: 'HaHa Room13',
    letter: 'H',
    public: true,
  },
  {
    id: 17,
    name: 'HaHa Room14',
    letter: 'H',
    public: true,
  },
  {
    id: 18,
    name: 'HaHa Room15',
    letter: 'H',
    public: true,
  },
  {
    id: 19,
    name: 'HaHa Room16',
    letter: 'H',
    public: true,
  },
  {
    id: 20,
    name: 'HaHa Room17',
    letter: 'H',
    public: true,
  },
  {
    id: 21,
    name: 'HaHa Room18',
    letter: 'H',
    public: true,
  },
  {
    id: 22,
    name: 'HaHa Room19',
    letter: 'H',
    public: true,
  },
  {
    id: 23,
    name: 'HaHa Room20',
    letter: 'H',
    public: true,
  },
  {
    id: 24,
    name: 'HaHa Room21',
    letter: 'H',
    public: true,
  },
  {
    id: 25,
    name: 'HaHa Room22',
    letter: 'H',
    public: true,
  },
  {
    id: 26,
    name: 'HaHa Room23',
    letter: 'H',
    public: true,
  },
  {
    id: 27,
    name: 'HaHa Room24',
    letter: 'H',
    public: true,
  },
  {
    id: 28,
    name: 'HaHa Room25',
    letter: 'H',
    public: true,
  },
];

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
];

export default {
  computed: {},
  data() {
    return {
      channels,
      displayName: 'Slack',
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
      console.log(channels);
      console.log(index);
    },
    changePage(to, channel_name) {
      this.displayName = channel_name;
      console.log('klikol si');
      console.log(to);
      // this.$router.push('/');
      // sleep(1);
      this.$router.push(to);
    },
  },
};
</script>

<style scoped>
.flex {
  display: grid;
  /* justify-content: space-around; */
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  align-items: center;
  column-gap: 0px;
}

.flexbox {
  display: flex;
}

.two_rows {
  grid-row: 1/-1;
  align-self: center;
}

.btn.two_rows {
  grid-column: 3/4;
  cursor: pointer;
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
  background-color: red;
  width: 300px;
  grid-row: 1/-1;
}
</style>
