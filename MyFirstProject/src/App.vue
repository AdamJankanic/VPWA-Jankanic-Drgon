<script>
export default {
  data() {
    return {
      titleDynamicProp: "<strong>Klikol si na mňa</strong>",
    };
  },
};
</script>

<template>
  <h1>Počítadlo kliknutí</h1>
  <ButtonCounter
    :isActive="true"
    v-bind:title="titleDynamicProp"
  ></ButtonCounter>
</template>
