<template>
  <div class="q-pa-md cart-container"></div>
</template>

<style scoped>
.desktop {
  width: 700px;
}

.btn-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.checkout {
  margin-top: 15px;
  width: 200px;
  cursor: pointer;
  transition: 0.5s;
  display: inline-block;
  position: relative;
}

.checkout:after {
  content: " >>";
  color: white;
  opacity: 0;
  transition: 0.5s;
}

.checkout:hover {
  padding-right: 14px;
  padding-left: 4px;
}

.checkout:hover:after {
  opacity: 1;
  right: 5px;
}

.cont-shop {
  cursor: pointer;
}

.empty {
  cursor: pointer;
}
.cart-table {
  display: flex;
  flex-direction: column;
  width: 600px;
  align-items: center;
  justify-content: center;
}

@media only screen and (max-width: 812px) {
  .desktop {
    width: 350px;
  }
  .empty {
    display: flex;
    margin: auto;
    font-size: 1rem;
  }
  .total-price {
    font-size: 1.5rem;
  }
}
</style>

<script>
import { ref } from "vue";
import { useCounterStore } from "stores/cart";

export default {
  async setup() {
    const axios = require("axios");
    const cart = JSON.parse(localStorage.getItem("cart"));
    const store = useCounterStore();

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    let shoppingCart = "";
    if (cart.length > 0) {
      shoppingCart = await axios.post(baseUrl + "/products/getCart", {
        data: cart,
      });
    }
    return {
      store,
      baseUrl: ref(baseUrl),
      shoppingCart: ref(shoppingCart.data),
      mobile: ref(false),
      removeItemPrompt: ref(false),
      selectedRow: ref(null),
      columns: [
        {
          name: "product",
          required: true,
          label: "Product",
          align: "left",
          field: "product_name",
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "size",
          align: "left",
          label: "Size",
          field: "size_name",
        },
        { name: "style", align: "left", label: "Style", field: "desc" },
        { name: "color", align: "left", label: "Color", field: "color_name" },
        {
          name: "price",
          align: "left",
          label: "Price",
          field: "sale_price",
          format: (val) => "$" + val,
        },
      ],
    };
  },
  mounted() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  },
  data() {
    return {};
  },
  methods: {
    goHome() {
      this.$router.push({ name: "home" });
    },

    removeItemPromptFunc(evt, row) {
      this.selectedRow = row;
      this.removeItemPrompt = true;
    },
    removeItem() {
      let localStorageCart = JSON.parse(localStorage.getItem("cart"));

      this.shoppingCart = this.shoppingCart.filter(
        (product) => product.product_id !== this.selectedRow.product_id
      );

      localStorageCart = localStorageCart.filter(
        (product) => product !== this.selectedRow.product_id
      );
      this.store.cartSize(localStorageCart.length);
      localStorage.setItem("cart", JSON.stringify(localStorageCart));
    },
    goToCheckout() {
      this.$router.push({ name: "checkout" });
    },
  },
  computed: {
    getTotalPrice() {
      let price = 0;
      this.shoppingCart.forEach((product) => {
        price += parseFloat(product.sale_price);
      });
      return price.toFixed(2);
    },
  },
};
</script>
