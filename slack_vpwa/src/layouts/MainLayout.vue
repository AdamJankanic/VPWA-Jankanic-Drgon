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
          </q-toolbar>

          <q-toolbar-title class="absolute-center vertical-top">
            Slack
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="300"
        :breakpoint="500"
        side="left"
      >
      <q-list bordered style="overflow: auto; height: calc(100% - 80px);">
        <q-item
          v-for="channel in channels"
          :key="channel.id"
          class="q-my-sm"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              {{ channel.letter }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ channel.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      
      <div class="flex absolute-bottom profile" >
        <q-avatar size="xl" class="two_rows">
          <img :src="`https://cdn.quasar.dev/img/avatar3.jpg`" />
        </q-avatar>
        <div class="nickname">
          <p>Alice159</p>
        </div>
        <div class="icons">
          <q-icon size="md" name="chat_bubble" color="green" />
          <q-icon size="md" name="settings" color="grey" />
        </div>
        <button class="btn two_rows">Log Out</button>
      </div>
      </q-drawer>

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
                <q-icon name="chat_bubble" color="grey" />
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
const channels = [
  {
    id: 1,
    name: 'VPWA',
    letter: 'V',
  },
  {
    id: 2,
    name: 'General',
    letter: 'G',
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 4,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 4,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 4,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 4,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 4,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 4,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 4,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 4,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 4,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 4,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 4,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 4,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 3,
    name: 'HaHa Room',
    letter: 'H',
  },
  {
    id: 4,
    name: 'HaHa Room',
    letter: 'H',
  },
];

const users = [
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
  computed: {},
  setup() {
    return {
      drawer: ref(false),
      channels,
      users,
    };
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
