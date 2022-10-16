<template>
  <router-view @login="login"></router-view>
</template>

<script>
export default {
  methods: {
    login() {
      this.$router.push('/');
    },
  },
};
</script>

<style></style>
