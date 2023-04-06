<template>
  <div class="q-pa-md">
    <div class="text-area">
      <h3 class="nos-font">{{ this.productInfo[0].design_name }}</h3>
      <div class="price">
        {{
          this.finalProduct
            ? "$" + this.finalProduct.sale_price
            : "Select a style, size and color to calculate the price."
        }}
      </div>
      <div class="desc">{{ this.productInfo[0].design_desc }}</div>
    </div>
    <div class="input-area">
      <q-select
        dark
        filled
        v-model="style"
        :options="styleOptions"
        label="Style"
        style="width: 150px"
        option-label="style"
        option-value="style_id"
        menu-placement="top"
        @update:model-value="getSizes()"
      />
      <q-select
        v-if="this.style"
        dark
        filled
        v-model="size"
        option-label="size_name"
        option-value="product_size"
        :options="this.sizeOptions"
        @update:model-value="getColors()"
        label="Size"
        style="width: 150px"
      />
      <q-select
        v-if="this.size"
        dark
        filled
        v-model="color"
        option-label="color_name"
        option-value="product_color"
        :options="this.colorOptions"
        label="Color"
        style="width: 150px"
        @update:model-value="getProduct()"
      />
    </div>

    <div class="pics">
      <q-img
        class="item q-my-md"
        :src="url"
        spinner-color="red"
        style="width: 300px"
      />
      <div class="allpics" v-if="this.productInfo[0].design_images.length > 1">
        <q-img
          v-for="(image, key) in this.productInfo[0].design_images"
          :key="key"
          class="sub-item"
          :src="image"
          spinner-color="red"
          style="width: 100px"
          @click="changePrimaryImage(image)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pics {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  flex-wrap: wrap;
}
.text-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 1000px;
}

.input-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 1000px;
  gap: 15px;
}

.desc {
  width: 300px;
  align-items: end;
}
.item {
  transition: transform 0.15s ease-in-out;
  position: relative;
  z-index: 100;
}
.sub-item {
  transition: transform 0.15s ease-in-out;
}
.item:hover {
  transform: scale(1.8); /* Zoom in by 10% on hover */
}

.sub-item:hover {
  transform: scale(1.2); /* Zoom in by 10% on hover */
  cursor: pointer;
}

@media only screen and (max-width: 812px) {
  .text-area {
    align-items: center;
    margin-bottom: 15px;
  }
  .price {
    margin-bottom: 15px;
  }
  .input-area {
    gap: 25px;
    align-items: center;
  }
  .nos-font {
    font-size: 2rem;
  }
}
</style>

<script>
import { ref } from "vue";

export default {
  name: "viewProduct",

  async setup() {
    const axios = require("axios");

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    const designId = /[^/]*$/.exec(window.location.href)[0];

    const productInfo = await axios.get(
      baseUrl + "/designs/viewProduct/" + designId
    );

    return {
      baseUrl: ref(baseUrl),
      designId: ref(designId),
      productInfo: ref(productInfo.data),
      slide: ref(0),
      url: ref(productInfo.data[0].design_images[0]),
    };
  },
  data() {
    return {
      style: "",
      size: "",
      color: "",
      sizeOptions: [],
      colorOptions: [],
      price: "",
      finalProduct: null,
    };
  },
  methods: {
    changePrimaryImage(image) {
      this.url = image;
    },
    async getSizes() {
      this.size = "";
      this.color = "";
      this.finalProduct = null;
      const arr = await this.$axios.get(
        this.baseUrl +
          `/products/getSizeByStyle/${this.designId}/${this.style.style_id}`
      );
      this.sizeOptions = arr.data;
    },
    async getColors() {
      this.color = "";
      this.finalProduct = null;

      const arr = await this.$axios.get(
        this.baseUrl +
          `/products/getColorBySize/${this.designId}/${this.size.product_size}`
      );
      this.colorOptions = arr.data;
    },
    async getProduct() {
      const arr = await this.$axios.get(
        this.baseUrl +
          `/products/getFinalProduct/${this.designId}/${this.style.style_id}/${this.size.product_size}/${this.color.product_color}`
      );
      this.finalProduct = arr.data[0];
      console.log(this.finalProduct);
    },
  },

  computed: {
    styleOptions() {
      const arr = [];

      this.productInfo.forEach((product) => {
        const styleObj = {
          style: product.styles,
          style_id: product.category_id,
        };
        arr.push(styleObj);
      });

      return arr;
    },
  },
};
</script>
