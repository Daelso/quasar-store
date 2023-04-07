<template>
  <div class="q-pa-md">
    <q-table
      title="Current Cart"
      :rows="shoppingCart"
      :columns="columns"
      row-key="name"
      dark
      style="width: 700px"
    >
      <template v-slot:bottom>
        <q-tr>
          <q-td colspan="100%"> Total Price: ${{ getTotalPrice }} </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

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

    const shoppingCart = await axios.post(baseUrl + "/products/getCart", {
      data: cart,
    });
    console.log(shoppingCart.data);
    return {
      store,
      baseUrl: ref(baseUrl),
      shoppingCart: ref(shoppingCart.data),
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
  data() {
    return {};
  },
  computed: {
    getTotalPrice() {
      let price = 0;
      this.shoppingCart.forEach((product) => {
        price += parseFloat(product.sale_price);
      });
      return price;
    },
  },
};
</script>
