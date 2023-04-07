<template>
  <div class="q-pa-md">
    <h4 class="text-center">Create a New Design</h4>

    <div class="form-container">
      <q-input dark filled v-model="name" label="Design Name" />
      <q-input dark filled autogrow v-model="desc" label="Description" />
      <q-input
        dark
        filled
        label="Keywords"
        v-model="keywords"
        autofocus
        autogrow
        hint="Comma separated"
      />
      <q-input
        dark
        filled
        v-model="image"
        label="Direct Image Link"
        hint="Use imgur or something similar, hit enter to submit. One link at a time."
        v-on:keydown.enter="
          (event) => {
            event.preventDefault();

            this.images.push(image);
            this.image = '';
          }
        "
      />
    </div>
    <div v-if="this.images.length > 0" class="imageBox">
      <q-btn
        :disable="this.images.length < 1 || !this.name || !this.desc"
        color="primary"
        class="q-mt-md"
        label="Create Design"
        @click="this.createDesign"
      />

      <h4>Uploaded Images</h4>

      <div class="imageContainer">
        <div class="image" v-for="(link, key) in this.images" :key="key">
          <q-img
            :src="link"
            alt="Sample image for demo"
            spinner-color="white"
            style="height: 340px; max-width: 350px"
          />
        </div>
      </div>
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
.imageBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.imageContainer {
  display: flex;
  max-width: 1200px;
  align-items: center;
  justify-content: center;
  gap: 25px;
}
.image {
  width: 350px;
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
      image: "",
      keywords: "",
    };
  },
  methods: {
    async createDesign() {
      try {
        const newDesign = {
          name: this.name,
          desc: this.desc,
          images: this.images,
          keywords: this.keywords,
        };
        await this.$axios.post(
          this.baseUrl + "/designs/new",
          { newDesign },
          {
            withCredentials: true,
          }
        );
        this.$router.go({ name: "manageDesigns" });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
