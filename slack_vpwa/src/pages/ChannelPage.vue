<template>
  <q-page class="row items-center justify-evenly">
    <!-- <button @click="loadMore">Nieco</button> -->
    <p>{{ notification }}</p>
    <channel-messages-component :messages="messages" />
  </q-page>
</template>

<script lang="ts">
import ChannelMessagesComponent from 'src/components/ChannelMessagesComponent.vue';
import { SerializedMessage } from 'src/contracts';

import { defineComponent } from 'vue';

export default defineComponent({
  components: { ChannelMessagesComponent },
  name: 'ChannelPage',

  watch: {
    notification() {
      console.log(Notification.permission);
      console.log('WATCH NOTIFICATION MANAGER');
      const notification = new Notification('Ahoj priatel', {
        body: 'Ahoj priatelu, co robis?',
      });
    },
  },

  computed: {
    messages(): SerializedMessage[] {
      return this.$store.getters['channels/currentMessages'];
    },

    notification() {
      console.log('notifikacia' + this.$store.state.channels.notification);
      console.log(this.$store.state.channels.notification);
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
