<template>
  <div class="home">
    <div class="content">
      <h1>Homework sender</h1>
      <p>
        Send information about homework to your friend who was absent at school
      </p>
      <router-link class="start-button" to="/editor">Start now</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style lang="scss">
@import "../styles/homepage.scss";
</style>
