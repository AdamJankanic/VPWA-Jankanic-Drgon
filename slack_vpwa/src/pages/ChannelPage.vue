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

export default defineComponent({
  components: { ChannelMessagesComponent },
  name: 'ChannelPage',

  setup() {
    const $q = useQuasar();

    return {};
  },

  watch: {
    // notification watch handler on change
    notification: {
      handler() {
        // console.log(Notification.permission);
        console.log('WATCH NOTIFICATION MANAGER', this.account[0].onlyMentions);
        if (!this.$q.appVisible) {
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

  computed: {
    ...mapGetters('users', {
      account: 'getAccount',
    }),

    messages(): SerializedMessage[] {
      return this.$store.getters['channels/currentMessages'];
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
