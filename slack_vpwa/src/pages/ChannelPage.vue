<template>
  <q-page class="row items-center justify-evenly">
    <button @click="loadMore">Nieoc</button>
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
      // console.log(this.$store.getters['channels/currentMessages']);
      return this.$store.getters['channels/currentMessages'];
    },
  },
  methods: {
    async loadMore() {
      console.log(this.$store.getters['channels/currentMessages']);

      await this.$store.dispatch('channels/loadMoreMessages', {
        channel: this.$store.state.channels.active,
        lastMessageId: this.messages[0].id,
      });

      // console.log(this.messages);
      // console.log(this.messages[this.messages.length - 1].id);
      // console.log(this.messages);
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
