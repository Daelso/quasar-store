<template>
  <div class="q-pa-md cart-container">
    <q-table
      title="Current Cart"
      :rows="shoppingCart"
      :columns="columns"
      bordered
      row-key="name"
      dark
      :title-class="{ 'text-h4 text-white': this.mobile }"
      :grid="this.mobile"
      class="desktop"
      card-container-class="cart-table"
      card-class="card"
      @row-click="removeItemPromptFunc"
    >
      <template v-slot:no-data>
        <q-tr class="empty" @click="goHome()">
          <q-td colspan="100%">
            The cart is empty! Check out our catalog.
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom>
        <q-tr>
          <q-td class="total-price" colspan="100%">
            Total Price: ${{ getTotalPrice }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="btn-container">
      <div
        v-if="this.shoppingCart"
        class="text-center cont-shop q-mt-sm"
        @click="goHome"
      >
        Continue Shopping
      </div>
      <div
        v-if="this.shoppingCart && this.shoppingCart.length > 0"
        @click="checkout()"
        class="checkout text-center broken-console"
      >
        Checkout
      </div>
    </div>
  </div>

  <!-- Dialogues -->

  <q-dialog v-model="removeItemPrompt" persistent>
    <q-card dark>
      <q-card-section class="row items-center">
        <span class="q-ml-sm"
          >Remove {{ this.selectedRow.product_name }} from your cart?</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="secondary" v-close-popup />
        <q-btn
          flat
          label="Remove"
          color="secondary"
          @click="removeItem()"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
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
    if (cart !== null && cart.length > 0) {
      shoppingCart = await axios.post(baseUrl + "/products/getCart", {
        data: cart,
      });
    }

    return {
      store,
      localCart: ref(cart),
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
        {
          name: "quantity",
          align: "left",
          label: "Quantity",
          field: "quantity",
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
    return {
      run:
        this.localCart !== null && this.shoppingCart
          ? this.addQuantity(this.localCart, this.shoppingCart)
          : "",
    };
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
    async checkout() {
      try {
        this.$q.loading.show({
          delay: 450, // ms
        });
        const stripe = await this.$axios.post(
          this.baseUrl + "/stripe/create-checkout-session",
          { data: this.shoppingCart },
          {
            withCredentials: true,
          }
        );
        this.$q.loading.hide();
        window.location.href = stripe.data;
      } catch (err) {
        console.log(err);
      }
    },
    addQuantity(intArr, objArr) {
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
    },
  },
  computed: {
    getTotalPrice() {
      let price = 0;
      this.shoppingCart.forEach((product) => {
        price += parseFloat(product.sale_price) * product.quantity;
      });
      return price.toFixed(2);
    },
  },
};
</script>
