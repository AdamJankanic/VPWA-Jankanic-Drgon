<template>
  <q-layout>
    <q-page-container>
      <router-view @login="login" class="centerPage"></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  methods: {
    login() {
      this.$router.push('/welcome');
    },
  },
};
</script>

<style>
.centerPage {
  display: flex;

  /* row-gap: 0; */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: auto;
}
</style>
