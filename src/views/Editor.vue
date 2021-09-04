<template>
  <div class="huge-card">
    <div class="editor">
      <h1>Editor</h1>

      <fieldset
        v-for="(subject, index) in subjects"
        :key="index"
        class="editor-subject"
      >
        <legend>{{ subject.name }}</legend>

        <quill-editor
          class="wysiwyg"
          v-model="subject.notes"
          :options="{
            theme: 'bubble',
            placeholder: 'You can add additional information here',
            modules: {
              toolbar: toolbarOptions,
            },
          }"
        />

        <div class="dropzone">
          <div
            class="p-12 bg-gray-100 border border-gray-300"
            @drop="drop($event, index)"
            @dragover="dragover"
          >
            <input
              type="file"
              multiple
              name="fields[assetsFieldHandle][]"
              class="w-px h-px opacity-0 overflow-hidden absolute"
              style="opacity: 0; width: 0; height: 0"
              @change="previewFiles($event, index)"
              :ref="`file${index}`"
              :id="`file${index}`"
              accept=".pdf,.jpg,.jpeg,.png"
            />

            <label :for="`file${index}`" class="block cursor-pointer">
              <div>
                Drag and drop photos or
                <span class="underline">click here</span> to select files.
              </div>
            </label>
          </div>
        </div>

        <div class="files-grid">
          <img
            v-for="(photo, index) in subject.photos"
            :key="index"
            :src="photo"
            class="files-grid-item"
          />
        </div>
      </fieldset>

      <button @click="send">Submit</button>
    </div>

    <div v-if="subjects.length == 0">
      <div class="modal-overlay"></div>
      <div class="modal-wrapper">
        <div class="modal">
          <h1>Enter subjects names</h1>

          <textarea
            class="wysiwyg enter-subjects-textarea"
            v-model="subjectsNames"
            :placeholder="`Enter each subject in the new line; eg:\nBiology\nEnglish\nGeography`"
          ></textarea>

          <button @click="createSubjectsArr">Start</button>
        </div>
      </div>
    </div>

    <FinishModal
      :progress="
        Math.round((finishModal.uploadedFiles / finishModal.allFiles) * 100)
      "
      :code="accessCode"
      :finished="finishModal.isFinished"
      v-if="finishModal.isShown"
    />
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import FinishModal from "../components/FinishModal.vue";

import { nanoid } from "nanoid";
import uploadAndGetURL from "../firebase/uploadPromise";
import { firestore as db, firebaseRef as firebase } from "../firebase/firebase";

export default {
  data() {
    return {
      subjects: [],
      finishModal: {
        isShown: false,
        isFinished: false,
        allFiles: 0,
        uploadedFiles: 0,
      },
      accessCode: "",
      subjectsNames: "",
      toolbarOptions: ["bold", "italic", "underline", "strike", "link"],
    };
  },

  mounted() {
    this.accessCode = nanoid();
    window.addEventListener("beforeunload", this.prventTabClose);
  },

  methods: {
    prventTabClose(e) {
      e.preventDefault();
      e.returnValue =
        "Your work will be lost if you close the tab now. Are you sure?";
    },

    previewFiles(event, index) {
      const photos = [];
      const files = event.target.files;

      files.forEach((file) => {
        photos.push(URL.createObjectURL(file));
        this.finishModal.allFiles++;
      });

      this.subjects[index].photos = photos;
      this.subjects[index].files = files;
    },

    async send() {
      this.finishModal.isShown = true;

      for (let i = 0; i < this.subjects.length; i++) {
        await this.uploadAllImages(i);
        delete this.subjects[i].files;
      }

      await this.saveToDB();

      this.finishModal.isFinished = true;
      window.removeEventListener("beforeunload", this.prventTabClose);
    },

    async uploadAllImages(subjectIndex) {
      for (let i = 0; i < this.subjects[subjectIndex].files.length; i++) {
        const downloadURL = await uploadAndGetURL(
          this.subjects[subjectIndex].files[i],
          `uploaded/${this.accessCode}/${subjectIndex}/${i}`
        );
        this.subjects[subjectIndex].photos[i] = downloadURL;
        this.finishModal.uploadedFiles++;
      }
    },

    async saveToDB() {
      await db.collection("sets").doc(this.accessCode).set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        data: this.subjects,
      });
    },

    createSubjectsArr() {
      if (this.subjectsNames.length == 0)
        alert("Enter at least one subject name");
      else {
        const names = this.subjectsNames.split("\n");

        names.forEach((name) => {
          this.subjects.push({
            name: name,
            notes: "",
            files: [],
            photos: [],
          });
        });
      }
    },

    drop(event, index) {
      event.preventDefault();
      this.$refs[`file${index}`].files = event.dataTransfer.files;
      this.previewFiles(
        {
          target: {
            files: event.dataTransfer.files,
          },
        },
        index
      );
    },

    dragover(event) {
      event.preventDefault();
    },
  },

  components: {
    quillEditor,
    FinishModal,
  },
};
</script>

<style lang="scss">
@import "../styles/huge-card.scss";
@import "../styles/editor.scss";
</style>>