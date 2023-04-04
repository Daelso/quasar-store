<template>
  <div class="q-pa-md">
    <h4>Create a New Design</h4>

    <div class="form-container">
      <q-input dark filled v-model="name" label="Design Name" />
      <q-input dark filled autogrow v-model="desc" label="Description" />
      <q-uploader
        :url="this.imageUploadUrl"
        with-credentials
        label="Upload Images"
        dark
        multiple
        batch
        accept=".jpg, image/*"
        max-files="6"
        @rejected="onRejected"
        rounded
        @uploaded="getids"
      />
    </div>
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
  border: 0.5px white solid;
  padding: 15px;
  border-radius: 15px;
}
</style>

<script>
import { ref } from "vue";

export default {
  async setup() {
    const axios = require("axios");

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    let isAdmin = null;
    try {
      isAdmin = await axios.get(baseUrl + "/admin/isAdmin", {
        withCredentials: true,
      });
    } catch (err) {
      router.push({ name: "login" });
    }

    return {
      isAdmin: ref(isAdmin),
      baseUrl: ref(baseUrl),
    };
  },
  data() {
    return {
      name: "",
      desc: "",
      images: [],
      imageUploadUrl: this.baseUrl + "/designs/upload",
    };
  },
  methods: {
    onRejected(rejectedEntries) {
      this.$q.notify({
        type: "negative",
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
      });
    },
    getids(event) {
      event.files.forEach((file) => {
        this.images.push(file.name);
      });
      console.log(this.images);
    },
  },
};
</script>
