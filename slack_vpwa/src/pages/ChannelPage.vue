<template>
  <q-page class="row items-center justify-evenly">
    <button @click="loadMore">Nieco</button>
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
  computed: {
    messages(): SerializedMessage[] {
      return this.$store.getters['channels/currentMessages'];
    },

    // users(): string[] {
    //   return this.$store.getters['channels/getJoinedChannels'];
    // },
  },
  methods: {
    async loadMore() {
      //load all users in active channel
      //   await this.$store.dispatch('channels/loadAllUsersInChannel', {
      //   channelName: 'general',
      //   channelID: 1,
      // });

      // console.log('load more kokot');

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
