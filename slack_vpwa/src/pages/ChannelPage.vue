<template>
  <q-page class="row items-center justify-evenly">
    <!-- <button @click="loadMore">Nieco</button> -->

    <!-- <button @click="scrollPosition">Nieco</button> -->
    <!-- <p>{{ notification }}</p> -->
    <channel-messages-component @click="loadMore" :messages="messages" />
  </q-page>
</template>

<script lang="ts">
import ChannelMessagesComponent from 'src/components/ChannelMessagesComponent.vue';
import { SerializedMessage } from 'src/contracts';
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

// let onlineMessages: SerializedMessage[] = [];

export default defineComponent({
  components: { ChannelMessagesComponent },
  name: 'ChannelPage',

  setup() {
    const $q = useQuasar();

    return {};
  },

  watch: {
    activeChannel: {
      handler: function (newVal, oldVal) {
        if (this.account[0].isOnline === 1) {
          this.onlineMessages = this.$store.getters['channels/currentMessages'];
        }
        console.log('WATCH MESSAGES', newVal, oldVal);
      },
    },

    // notification watch handler on change
    notification: {
      handler() {
        // console.log(Notification.permission);
        console.log('WATCH NOTIFICATION MANAGER', this.account[0].onlyMentions);
        if (!this.$q.appVisible && this.account[0].isDnd === 0) {
          if (
            (this.account[0].onlyMentions &&
              this.notification.message.includes(
                '@' + this.account[0].nickname
              )) ||
            !this.account[0].onlyMentions
          ) {
            console.log(
              'INSIIIIIIIIIIIIIDEEEEEEEEEEE',
              this.account[0].onlyMentions
            );
            const notification_message = new Notification(
              'Channel:   ' +
                this.notification.channel +
                '\n' +
                'User:      ' +
                this.notification.userName,
              {
                body: this.notification.message.substring(0, 20),
              }
            );
          }
        }
      },
      deep: true,
    },
  },

  data() {
    return { onlineMessages: [] };
  },

  computed: {
    ...mapGetters('users', {
      account: 'getAccount',
    }),

    messages(): SerializedMessage[] {
      if (this.account[0].isOnline === 1) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.onlineMessages = {
          ...this.$store.getters['channels/currentMessages'],
        };
        return this.$store.getters['channels/currentMessages'];
      } else {
        return this.onlineMessages;
      }
    },

    activeChannel() {
      return this.$store.state.channels.active;
    },

    notification() {
      console.log('notifikacia' + this.$store.state.channels.notification);
      return this.$store.state.channels.notification;
    },
  },
  methods: {
    async loadMore() {
      await this.$store.dispatch('channels/loadMoreMessages', {
        channel: this.$store.state.channels.active,
        lastMessageId: this.messages[0].id,
      });
    },
  },
});
</script>

<style>
.q-message-text {
  width: fit-content;
  max-width: 35rem;
}
</style>
