<template>
  <div class="q-pa-md">
    <div class="text-area">
      <h3 class="nos-font">{{ this.productInfo[0].design_name }}</h3>
      <div class="price text-center">
        {{
          this.finalProduct
            ? "$" + this.finalProduct.sale_price
            : "Select a style, size and color to calculate the price."
        }}
      </div>
      <div class="desc">{{ this.productInfo[0].design_desc }}</div>
    </div>
    <div class="input-area">
      <div class="broken-console" v-if="this.styleOptions.length < 1">
        SOLD OUT
      </div>
      <q-select
        v-if="this.styleOptions.length > 0"
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
      <q-btn
        v-if="this.finalProduct"
        outline
        color="secondary"
        label="Add to Cart"
        @click="addToCart()"
      />
    </div>

    <div class="pics">
      <q-img
        class="item q-my-md"
        :src="url"
        spinner-color="red"
        style="width: 400px"
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
.allpics {
  display: flex;
  justify-content: center;
  align-items: center;
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
  position: absolute;
}

.price {
  margin-bottom: 15px;
  justify-content: center;
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
    width: 15rem;
    justify-content: center;
  }
  .input-area {
    gap: 25px;
    align-items: center;
    position: relative;
  }
  .nos-font {
    font-size: 2rem;
  }
}
</style>

<script>
import { ref } from "vue";
import nosImage from "../../assets/images/Nosfer_logo.png";
import { useCounterStore } from "stores/cart";
import { useMeta } from "quasar";

export default {
  name: "viewProduct",
  async setup() {
    const axios = require("axios");
    const store = useCounterStore();

    const title = ref("Product Page");
    const meta = {
      description: {
        name: "description",
        content:
          "Stylish, comfortable clothing. Retro and vintage style with designs from your favorite video games.",
      },
      keywords: {
        name: "keywords",
        content:
          "clothing, vintage, stylish, cool, video games, retro, comfort colors, soft,",
      },
    };

    useMeta(() => {
      return {
        title: title.value,
        meta: meta,
      };
    });

    function setAnotherTitle(newTitle) {
      title.value = newTitle; // will automatically trigger a Meta update due to the binding
    }
    function updateMetaTags(newDesc, newKeywords) {
      meta.description.content = newDesc;
      meta.keywords.content = newKeywords;
    }

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

    console.log(productInfo.data);

    return {
      store,
      baseUrl: ref(baseUrl),
      designId: ref(designId),
      productInfo: ref(productInfo.data),
      slide: ref(0),
      url: ref(productInfo.data[0].design_images[0]),
      setAnotherTitle,
      updateMetaTags,
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
  mounted() {
    this.setAnotherTitle(this.productInfo[0].design_name);
    this.updateMetaTags(
      this.productInfo[0].design_desc,
      this.productInfo[0].keywords
    );
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
          `/products/getColorBySize/${this.designId}/${this.size.product_size}/${this.style.style_id}`
      );
      this.colorOptions = arr.data;

      if (this.colorOptions.length === 1) {
        this.color = this.colorOptions[0];
        this.getProduct();
      }
    },
    async getProduct() {
      const arr = await this.$axios.get(
        this.baseUrl +
          `/products/getFinalProduct/${this.designId}/${this.style.style_id}/${this.size.product_size}/${this.color.product_color}`
      );
      this.finalProduct = arr.data[0];
      console.log(this.finalProduct);
    },
    addToCart() {
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (cart === null) {
        cart = [];
      }
      if (!this.maxQuantityCheck(cart, this.finalProduct.product_id)) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: `Maximum of 2 of the same kind of items per cart!`,
        });
        return;
      }
      cart.push(this.finalProduct.product_id);
      localStorage.setItem("cart", JSON.stringify(cart));
      this.store.increment();

      this.$q.notify({
        message: `${this.productInfo[0].design_name} - ${this.style.style} (${this.size.size_name} - ${this.color.color_name}) added to cart!`,
        color: "primary",
        avatar: nosImage,
        timeout: 9000,
      });
    },

    maxQuantityCheck(cart, newItem) {
      const dupeCount = {};
      cart.forEach((x) => {
        dupeCount[x] = (dupeCount[x] || 0) + 1;
      });

      if (dupeCount[newItem] >= 2) {
        return false;
      }
      return true;
    },
  },

  computed: {
    styleOptions() {
      const arr = [];

      this.productInfo.forEach((product) => {
        if (product.inventory == 0) return;
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
