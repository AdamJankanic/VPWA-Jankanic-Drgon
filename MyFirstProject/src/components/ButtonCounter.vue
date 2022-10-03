<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  props: {
    title: String,
    isActive: Boolean,
  },
};
</script>

<template>
  <button
    :class="{ red: isActive }"
    @click="count++"
    v-html="title + ' ' + count"
  ></button>
  <input type="number" v-bind:value="count" />
</template>

<style scoped>
.red {
  color: red;
}
</style>
