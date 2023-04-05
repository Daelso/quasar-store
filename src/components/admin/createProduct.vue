<template>
  <div class="q-pa-lg bg-primary">
    <div class="form">
      <h4>Create a New Product</h4>
      <div class="inputs">
        <q-input dark filled v-model="name" label="Product Name" />
        <q-input
          class="q-my-md"
          dark
          filled
          autogrow
          v-model="desc"
          label="Product Description"
        />

        <q-select
          filled
          v-model="category"
          dark
          :options="categories"
          label="Category"
          option-label="desc"
          option-value="category_id"
        />
      </div>
      <q-btn
        class="q-my-md"
        dark
        color="primary"
        label="Create Product"
        @click="createProduct"
      />
    </div>
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 450px;
}
.inputs {
  width: 300px;
}
</style>

<script>
import { ref } from "vue";

export default {
  name: "productCreator",
  props: ["closePrompt"],
  emits: ["update:closePrompt"],
  async setup() {
    const axios = require("axios");

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    const categories = await axios.get(baseUrl + "/categories/all");
    console.log(categories.data);
    return {
      categories: ref(categories.data),
    };
  },
  data(props) {
    return {
      name: "",
      desc: "",
      closeThatPrompt: props.closePrompt,
      category: "",
    };
  },
  methods: {
    createProduct() {
      this.$emit("update:closePrompt", false);
    },
  },
};
</script>
