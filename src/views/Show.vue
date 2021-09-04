<template>
  <div class="huge-card">
    <h1>View homework information</h1>

    <fieldset
      v-for="(subject, index) in subjects"
      :key="index"
      class="editor-subject"
    >
      <legend>{{ subject.name }}</legend>

      <div
        class="wysiwyg"
        style="padding: 20px; font-size: 1rem; list-style-position: inside"
      >
        <div v-html="subject.notes"></div>
      </div>

      <div class="files-grid">
        <img
          v-for="(photo, photoIndex) in subject.photos"
          :key="photoIndex"
          :src="photo"
          class="files-grid-item"
          @click="
            showedImage.subjectIndex = index;
            showedImage.photoIndex = photoIndex;
          "
        />
      </div>
    </fieldset>

    <div class="modal-overlay" v-if="showedImage.photoIndex != undefined"></div>
    <div
      class="modal-wrapper"
      v-if="showedImage.photoIndex != undefined"
      @click.self="
        showedImage.subjectIndex = undefined;
        showedImage.photoIndex = undefined;
      "
    >
      <div
        class="modal modal--huge"
        :style="{
          transform: `rotate(${showedImage.rotation}deg)`,
          filter: `contrast(${showedImage.c}%)`,
        }"
      >
        <div style="max-height: 90vh; overflow: hidden">
          <img
            :src="
              subjects[showedImage.subjectIndex].photos[showedImage.photoIndex]
            "
            alt=""
            style="max-width: 100%; max-height: 100%"
          />
        </div>
      </div>

      <div class="modal modal--tools">
        Controls<br /><br />
        <button @click="showedImage.rotation += 90">Rotate</button>
        <input type="range" min="100" max="200" v-model="showedImage.c" />
      </div>
    </div>
  </div>
</template>

<script>
import { firestore } from "../firebase/firebase";
export default {
  props: ["id"],
  data() {
    return {
      loading: true,
      subjects: [],
      showedImage: {
        subjectIndex: undefined,
        photoIndex: undefined,
        rotation: 0,
        c: 100,
      },
    };
  },
  async mounted() {
    const doc = await firestore.collection("sets").doc(this.id).get();
    this.subjects = doc.data().data;
    window.addEventListener("keyup", this.handleKeyboardShortcut);
  },
  methods: {
    handleKeyboardShortcut(evt) {
      if (evt.key == "ArrowRight") this.nextImage();
      if (evt.key == "ArrowLeft") this.previousImage();
    },
    nextImage() {
      if (
        this.subjects[this.showedImage.subjectIndex].photos[
          this.showedImage.photoIndex + 1
        ] != undefined
      )
        this.showedImage.photoIndex++;
      // show next photo by incrementing photoIndex
      else if (
        this.subjects[this.showedImage.subjectIndex + 1] != undefined &&
        this.subjects[this.showedImage.subjectIndex + 1].photos[0] != undefined
      ) {
        // show first photo in the next subject
        this.showedImage.subjectIndex += 1;
        this.showedImage.photoIndex = 0;
      } else if (this.subjects[0].photos[0] != undefined) {
        // it was last photo
        // show the first photo
        this.showedImage.subjectIndex = 0;
        this.showedImage.photoIndex = 0;
      }
    },

    previousImage() {
      if (
        this.subjects[this.showedImage.subjectIndex].photos[
          this.showedImage.photoIndex - 1
        ] != undefined
      ) {
        this.showedImage.photoIndex--; // show next photo by decrementing photoIndex
      } else if (
        this.subjects[this.showedImage.subjectIndex - 1] != undefined &&
        this.subjects[this.showedImage.subjectIndex - 1].photos[
          this.subjects[this.showedImage.subjectIndex - 1].photos.length - 1
        ] != undefined
      ) {
        // show the last photo in the previous subject
        this.showedImage.subjectIndex -= 1;
        this.showedImage.photoIndex =
          this.subjects[this.showedImage.subjectIndex].photos.length - 1;
      } else if (
        this.subjects[this.subjects.length - 1].photos[
          this.subjects[this.subjects.length - 1].photos.length - 1
        ] != undefined
      ) {
        // it was first photo
        // show the last
        this.showedImage.subjectIndex = this.subjects.length - 1;
        this.showedImage.photoIndex =
          this.subjects[this.showedImage.subjectIndex].photos.length - 1;
      }
    },
  },
};
</script>