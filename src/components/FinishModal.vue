<template>
  <div>
    <div class="modal-overlay"></div>
    <div class="modal-wrapper">
      <div class="modal">
        <h1>High five!</h1>
        <p>
          We are now uploading your photos and information to the server. While
          you are waiting give your pal this code so he/she can get access to
          the photos.
        </p>

        <div class="finished" v-if="finished">
          Done! Now you can copy the link and close the browser window.
        </div>

        <div v-else>
          <div class="warning">
            Do not close this browser tab until the upload is complete. ({{
              progress
            }}% done)
          </div>
        </div>

        <div class="code">
          <input readonly v-model="link" ref="link">
          <button @click="copyLink">Copy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["progress", "code", "finished"],
  data() {
    return {
      link: `${process.env.VUE_APP_URL}/s/${this.code}`,
    };
  },
  methods: {
    copyLink() {
      this.$refs.link.select()
      document.execCommand("copy");
    }
  }
};
</script>

<style lang="sass">
@import "../styles/modal.scss"
</style>