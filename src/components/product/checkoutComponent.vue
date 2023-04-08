<template>
  <div class="q-pa-md cart-container"></div>
</template>

<script>
import { ref } from "vue";
import useQuasar from "quasar/src/composables/use-quasar.js";
import { useCounterStore } from "stores/cart";

export default {
  async setup() {
    const axios = require("axios");
    const cart = JSON.parse(localStorage.getItem("cart"));
    const store = useCounterStore();
    const $q = useQuasar();

    const addQuantity = async (intArr, objArr) => {
      // create an object to store the counts for each value in the integer array
      const counts = {};

      // loop through the integer array and count the occurrences of each value
      for (let i = 0; i < intArr.length; i++) {
        const value = intArr[i];
        if (!counts[value]) {
          counts[value] = 0;
        }
        counts[value]++;
      }

      // loop through the object array and add a "quantity" key to each object
      for (let i = 0; i < objArr.length; i++) {
        const product = objArr[i];
        const productId = product.product_id;
        if (counts[productId]) {
          product.quantity = counts[productId];
        } else {
          product.quantity = 0;
        }
      }

      // return the modified object array
      return objArr;
    };

    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    const stripeCart = params.session_id;

    console.log(stripeCart);

    $q.loading.show({
      message: "Processing your order...",
    });

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
      await addQuantity(cart, shoppingCart.data);
    }

    await axios.post(
      baseUrl + "/stripe/handleSuccess",
      { data: { cart: shoppingCart.data, session_id: stripeCart } },
      {
        withCredentials: true,
      }
    );

    return {
      stripe_cart: ref(stripeCart),
      store,
      baseUrl: ref(baseUrl),
      shoppingCart: ref(shoppingCart.data),
    };
  },
  data() {
    return {};
  },

  computed: {},
};
</script>
