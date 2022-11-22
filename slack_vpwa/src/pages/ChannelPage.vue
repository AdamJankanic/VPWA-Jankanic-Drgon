<template>
  <q-page class="row items-center justify-evenly">
    <channel-messages-component :messages="messages" />
    <button @click="loadMore">Nieoc</button>
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
  },
  methods: {
    loadMore() {
      // console.log('load more PAGE');
      // this.$store.dispatch('channels/loadMoreMessages', {
      //   channel: this.$store.state.channels.active,
      //   lastMessageId: this.messages[this.messages.length - 1].id,
      // });

      //console log least id from messages

      let test = this.$store.dispatch('channels/loadMoreMessages', {
        channel: this.$store.state.channels.active,
        lastMessageId: this.messages[this.messages.length - 1].id,
      });

      console.log(this.messages[this.messages.length - 1].id);
      console.log(...test);
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
