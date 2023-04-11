<template>
  <div class="q-pa-md cart-container">
    <q-table
      :title="'Order #' + this.order_items[0].order_id + ' - Thank you!'"
      :rows="order_items"
      :columns="columns"
      bordered
      row-key="name"
      dark
      :title-class="{ 'text-h4 text-white': this.mobile }"
      :grid="this.mobile"
      class="desktop"
      card-container-class="cart-table"
      card-class="card"
    >
      <template v-slot:no-data>
        <q-tr class="empty" @click="goHome()">
          <q-td colspan="100%"> Something's up if you're seeing this </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom>
        <q-tr>
          <q-td class="total-price" colspan="100%">
            Shipping Cost: ${{
              (this.order_items[0].shipping_cost / 100).toFixed(2)
            }}
            - Total Price: ${{ getTotalPrice }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="btn-container">
      <div class="text-center cont-shop q-mt-sm" @click="goHome">
        Return to Catalog
      </div>
      <div class="ship-to q-mt-lg">
        Shipping to:
        {{ this.order_items[0].ship_to }}
        <div>
          {{ this.order_items[0].shipping_address }}
          {{ this.order_items[0].shipping_address_2 }}
        </div>
        <div>
          {{ this.order_items[0].shipping_city }},
          {{ this.order_items[0].shipping_state }}
          {{ this.order_items[0].shipping_zip }}
        </div>
      </div>
    </div>
  </div>
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
import { defineComponent } from "vue";
import { ref } from "vue";

export default defineComponent({
  name: "viewOrder",
  async setup() {
    const axios = require("axios");
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    const orderId = /[^/]*$/.exec(window.location.href)[0];

    const items = await axios.get(baseUrl + "/orders/order/" + orderId);
    console.log(items.data);
    return {
      order_items: ref(items.data),
      mobile: ref(false),
    };
  },
  data() {
    return {
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
  methods: {
    goHome() {
      this.$router.push({ name: "home" });
    },
  },
  computed: {
    getTotalPrice() {
      if (this.order_items.length == 1) {
        return (
          parseFloat(this.order_items[0].sale_price) +
          this.order_items[0].shipping_cost / 100
        ).toFixed(2);
      }
      return (
        this.order_items.reduce(
          (sum, item) => sum + parseFloat(item.sale_price) * item.quantity,
          0
        ) +
        this.order_items[0].shipping_cost / 100
      );
    },
  },
});
</script>
