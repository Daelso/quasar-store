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
