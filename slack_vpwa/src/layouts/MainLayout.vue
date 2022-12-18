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
              :clickable="channel.isInvited === 0"
              v-ripple
              @click="setActiveChannel(channel.name), (drawer = false)"
              :class="channel.isInvited === 1 ? 'invitation' : ''"
            >
              <div v-if="channel.isInvited === 0" class="flexbox space-between">
                <q-item-section side>
                  <q-item-label lines="1">
                    {{ channel.name }}
                    <!-- {{ channel.isInvited }} -->
                    <!-- <p>{{ channel.isInvited }}</p> -->
                  </q-item-label>

                  <q-item-label class="conversation__summary" caption>
                    <!-- {{ lastMessageOf(channel)?.content || '' }} -->
                  </q-item-label>
                </q-item-section>

                <q-item-section>
                  <!--q-item-label caption>
                  {{ channel }}
                </q-item-label-->
                  <q-icon
                    v-if="channel.private === 1"
                    name="lock"
                    color="black"
                    size="xs"
                  />
                  <q-icon v-else name="people" color="black" size="xs" />
                </q-item-section>
                <q-item-section class="absolute-right">
                  <q-icon
                    v-if="channel.name !== 'general'"
                    name="delete"
                    color="red"
                    size="xs"
                    @click="
                      leaveChannel({
                        channelName: channel.name,
                        user: nickname.id,
                      })
                    "
                  />
                </q-item-section>
              </div>

              <div v-else class="flexbox">
                <q-item-section side>
                  <q-item-label lines="1">
                    {{ channel.name }}
                    <!-- {{ channel.isInvited }} -->
                  </q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-icon
                    name="done"
                    color="green"
                    size="xs"
                    @click="responseInvitation(channel.name, true)"
                  />
                </q-item-section>

                <q-item-section>
                  <q-icon
                    name="close"
                    color="red"
                    size="xs"
                    @click="responseInvitation(channel.name, false)"
                  />
                </q-item-section>
              </div>
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
              <p class="q-mb-none text-bold">{{ account[0].nickname }}</p>
              <!-- <p>{{ account.isOnline }}</p> -->
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
                :class="stateUser(account[0])"
              />
              <q-icon
                @click="(small = true), setOptions()"
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
              <h6>Notifications on mention</h6>
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
            <q-btn
              flat
              label="OK"
              @click="changeSettings(onlineOffline, DNB, notifications)"
              v-close-popup
            />
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
                <q-item-label class="flex"
                  >{{ contact.nickname }}
                  <div class="icons">
                    <q-icon
                      size="md"
                      name="chat_bubble"
                      class="q-mr-xs"
                      :class="stateUser(contact)"
                    />
                  </div>
                </q-item-label>
                <!-- <p>{{ users }}</p> -->
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container v-if="nameActiveChannel !== 'Slack'">
        <router-view></router-view>
      </q-page-container>
    </div>

    <q-footer>
      <q-toolbar
        class="bg-grey-3 text-black row fixed-bottom"
        :style="{
          left: [drawerOn ? 300 : 0] + 'px',
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
  watch: {
    channels: {
      handler() {
        console.log('pocet kanalov');
      },
      deep: true,
    },
  },

  computed: {
    ...mapGetters('channels', {
      channels: 'getJoinedChannels',
      lastMessageOf: 'lastMessageOf',
      users: 'getJoinedUsers',
    }),

    ...mapGetters('auth', {
      nickname: 'getUser',
    }),

    ...mapGetters('users', {
      account: 'getAccount',
    }),

    activeChannel() {
      return this.$store.state.channels.active;
    },

    dndOption() {
      return this.$store.state.users.user.isDnd;
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
      onlineOffline: ref(false),
      notifications: ref(false),
      privatePublic: ref('Public'),
      DNB: ref(true),
      createGroup: ref(false),
      onlineColor: 'grey',
    };
  },

  methods: {
    stateUser(user) {
      if (!user.isOnline) {
        return 'offline';
      } else if (user.isDnd) {
        return 'dnd';
      } else {
        return 'online';
      }
    },

    setOptions() {
      if (this.account[0].isDnd) {
        this.DNB = 'On';
      } else {
        this.DNB = 'Off';
      }

      if (this.account[0].isOnline) {
        this.onlineOffline = 'Online';
      } else {
        this.onlineOffline = 'Offline';
      }

      if (this.account[0].onlyMentions) {
        this.notifications = 'On';
      } else {
        this.notifications = 'Off';
      }
    },

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
      } else if (
        this.message === '/cancel' &&
        this.activeChannel !== 'general'
      ) {
        await this.leaveChannel({
          channelName: this.activeChannel,
          user: this.nickname.id,
        });
        this.setActiveChannel('Slack');
        this.drawer = false;
      } else if (this.message.startsWith('/invite ')) {
        for (let i = 0; i < this.channels.length; i++) {
          if (this.channels[i].name === this.activeChannel) {
            if (
              this.channels[i].private &&
              this.channels[i].creator_id !== this.nickname.id
            ) {
              alert(
                'You can not invite users to private channel unless you are creator'
              );
              this.message = '';
              this.loading = false;
              return;
            }
          }
        }

        let nickname = this.message.split(' ')[1];
        if (nickname === this.nickname.nickname) {
          alert('You can not invite yourself to channel');
          this.message = '';
          this.loading = false;
          return;
        }
        console.log(nickname);
        await this.inviteUser({
          channelName: this.activeChannel,
          nickname: nickname,
        });
      } else if (this.message.startsWith('/join')) {
        let channelName = this.message.split(' ')[1];
        let privatePublic = this.message.split(' ')[2];

        // console.log('SKUSKA VYPISU1', channelName, privatePublic);
        if (privatePublic === undefined || privatePublic.trim() === '') {
          privatePublic = 'public';
        }
        // console.log('SKUSKA VYPISU2', channelName, privatePublic);
        if (privatePublic !== 'public' && privatePublic !== 'private') {
          alert('Please type private or nothing after channel name');
          this.message = '';
          this.loading = false;
          return;
        }

        await this.$store.dispatch('channels/joinViaMessage', {
          channelName: channelName,
          userID: this.nickname.id,
          privatePublic: privatePublic,
        });
      } else if (this.message === '/quit') {
        console.log(this.nickname);
        let creatorID;
        for (let i = 0; i < this.channels.length; i++) {
          if (this.channels[i].name === this.activeChannel) {
            creatorID = this.channels[i].creator_id;
            break;
          }
        }
        if (creatorID === this.nickname.id) {
          await this.leaveChannel({
            channelName: this.activeChannel,
            user: this.nickname.id,
          });
          this.setActiveChannel('Slack');
        } else {
          alert('Only creator can destroy channel');
        }
      } else if (this.message.startsWith('/revoke')) {
        let nicknameRevoke = this.message.split(' ')[1];
        let channelInfo;
        for (let i = 0; i < this.channels.length; i++) {
          if (this.channels[i].name === this.activeChannel) {
            channelInfo = this.channels[i];
            break;
          }
        }

        console.log('SKUSKA VYPISU', channelInfo);
        if (channelInfo.private === 0) {
          alert('You can not revoke users from public channel');
          this.message = '';
          this.loading = false;
          return;
        }

        if (channelInfo.creator_id !== this.nickname.id) {
          alert('You can not revoke users from channel unless you are creator');
          this.message = '';
          this.loading = false;
          return;
        }

        if (nicknameRevoke === this.nickname.nickname) {
          alert('You can not revoke yourself from channel');
          this.message = '';
          this.loading = false;
          return;
        }

        await this.revokeUser({
          channelName: this.activeChannel,
          nickname: nicknameRevoke,
        });
      } else if (this.message.startsWith('/kick')) {
        let nicknameKick = this.message.split(' ')[1];
        let channelInfo;
        for (let i = 0; i < this.channels.length; i++) {
          if (this.channels[i].name === this.activeChannel) {
            channelInfo = this.channels[i];
            break;
          }
        }

        console.log('SKUSKA VYPISU', channelInfo);
        if (channelInfo.private === 1) {
          alert(
            'You can not kick users from private channel (use /revoke nickname instead)'
          );
          this.message = '';
          this.loading = false;
          return;
        }

        if (channelInfo.creator_id !== this.nickname.id) {
          alert('You can not kick users from channel unless you are creator');
          this.message = '';
          this.loading = false;
          return;
        }

        if (nicknameKick === this.nickname.nickname) {
          alert('You can not kick yourself from channel');
          this.message = '';
          this.loading = false;
          return;
        }

        await this.revokeUser({
          channelName: this.activeChannel,
          nickname: nicknameKick,
        });
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
        console.log('Add channel', newChannelName, privatePublic);
        await this.addChannel({
          owner: this.nickname.id,
          newChannelName: newChannelName,
          privatePublic: privatePublic,
        });
        // await this.$store.dispatch('channels/join', newChannelName, {
        //   root: true,
        // });
      }
    },

    async changeSettings(onlineOffline, DNB, notifications) {
      console.log('change settings', onlineOffline, DNB, notifications);
      await this.modifySettings({
        owner: this.nickname.id,
        onlineOffline: onlineOffline,
        DNB: DNB,
        notifications: notifications,
        // allChannels: this.channels,
      });
    },

    async rightDrawerClick() {
      this.drawer = !this.drawer;
      if (this.drawer) {
        await this.loadAllUsersInChannel({
          channelName: this.activeChannel,
        });
      }
    },

    async responseInvitation(channelName, response) {
      console.log('response', channelName, response);
      await this.$store.dispatch('channels/inviteChoice', {
        channelName: channelName,
        nickname: this.nickname.nickname,
        choice: response,
      });
    },

    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE',
    }),
    ...mapActions('auth', ['logout']),
    ...mapActions('channels', ['addMessage']),
    ...mapActions('channels', ['loadAllUsersInChannel']),
    ...mapActions('channels', ['addChannel']),
    ...mapActions('channels', ['leaveChannel']),
    ...mapActions('channels', ['inviteUser']),
    ...mapActions('channels', ['revokeUser']),
    ...mapActions('users', ['modifySettings']),
  },
};
</script>

<style scoped>
.flexbox {
  display: flex;
}

.space-between {
  justify-content: space-between;
}

.invitation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fdcdcd;
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
