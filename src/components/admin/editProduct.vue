<template>
  <div class="q-pa-lg bg-primary">
    <q-icon
      name="close"
      style="cursor: pointer; float: right; scale: 120%"
      @click="close"
    />
    <div class="form">
      <h4>Edit {{ this.name }}</h4>
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
          class="q-my-md"
          v-model="category"
          dark
          :options="categories"
          label="Category"
          option-label="desc"
          option-value="category_id"
        />

        <q-select
          filled
          v-model="sizes"
          dark
          :options="sizeOptions"
          label="Sizes"
          option-label="size_name"
          option-value="size_id"
        />

        <q-select
          filled
          class="q-my-md"
          v-model="colors"
          dark
          :options="colorOptions"
          label="Colors"
          option-label="color_name"
          option-value="color_id"
        />
        <q-input
          class="q-my-md"
          dark
          filled
          v-model="inventory"
          label="Updated Inventory Count"
          type="number"
        />
        <q-input
          prefix="$"
          class="q-my-md"
          dark
          filled
          v-model="unitPrice"
          label="Set Default Unit Price"
          type="number"
        />
        <q-input
          prefix="$"
          dark
          filled
          v-model="salesPrice"
          label="Set Default Sales Price"
          type="number"
        />
      </div>
      <q-btn
        class="q-my-md"
        dark
        color="primary"
        label="Edit Product"
        :disable="disableButton"
        @click="editProduct"
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
}
.inputs {
  width: 280px;
  border: 1px white solid;
  padding: 10px;
  border-radius: 15px;
}
</style>

<script>
import { ref } from "vue";

export default {
  name: "productEditor",
  props: ["closePrompt", "designId", "rowData"],
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
    const sizes = await axios.get(baseUrl + "/sizes/all");
    const colors = await axios.get(baseUrl + "/colors/all");

    return {
      categories: ref(categories.data),
      sizeOptions: ref(sizes.data),
      colorOptions: ref(colors.data),
      baseUrl: ref(baseUrl),
    };
  },
  data() {
    return {
      name: this.rowData.product_name,
      desc: this.rowData.product_desc,
      closeThatPrompt: this.closePrompt,
      category: this.rowData.category,
      sizes: this.rowData.size,
      colors: this.rowData.color,
      unitPrice: this.rowData.unit_price,
      salesPrice: this.rowData.sale_price,
      inventory: this.rowData.inventory,
    };
  },
  methods: {
    async editProduct() {
      try {
        const updateProduct = {
          name: this.name,
          desc: this.desc,
          category: this.category,
          size: this.sizes,
          color: this.colors,
          unitPrice: this.unitPrice,
          salesPrice: this.salesPrice,
          inventory: this.inventory,
          designId: this.designId,
        };
        await this.$axios.put(
          this.baseUrl + "/products/edit/" + this.rowData.product_id,
          updateProduct,
          {
            withCredentials: true,
          }
        );
      } catch (err) {
        console.log(err);
      }

      this.$emit("update:closePrompt", false);
    },
    close() {
      this.$emit("update:closePrompt", false);
    },
  },

  computed: {
    disableButton() {
      if (
        !this.name ||
        !this.desc ||
        !this.category ||
        !this.sizes ||
        !this.colors ||
        !this.unitPrice ||
        !this.salesPrice ||
        !this.inventory
      )
        return true;

      return false;
    },
  },
};
</script>
