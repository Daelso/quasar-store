<template>
  <div class="q-pa-md cart-container">
    <q-table
      title="My Previous Orders"
      :rows="order_items"
      :columns="columns"
      bordered
      row-key="name"
      dark
      :title-class="{ 'text-h4 text-white': this.mobile }"
      grid
      class="desktop"
      card-container-class="cart-table"
      card-class="card"
    >
      <template v-slot:no-data>
        <q-tr class="empty" @click="goHome()">
          <q-td colspan="100%">
            You don't have any orders! Check out our catalog.
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<style scoped>
.desktop {
  width: 1200px;
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
import { date } from "quasar";

export default defineComponent({
  name: "myOrders",
  async setup() {
    const axios = require("axios");
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    const items = await axios.get(baseUrl + "/orders/my", {
      withCredentials: true,
    });
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
          name: "order",
          required: true,
          label: "Order Number",
          align: "left",
          field: "order_id",
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "date_placed",
          align: "left",
          label: "Date Placed",
          field: "createdat",
          format: (val) => date.formatDate(val, "MM-DD-YYYY"),
        },
        {
          name: "shipping_cost",
          align: "left",
          label: "Shipping Cost",
          field: "shipping_cost",
          format: (val) => "$" + (val / 100).toFixed(2),
        },
        {
          name: "total_cost",
          align: "left",
          label: "Total Cost",
          field: (row) =>
            "$" +
            (parseFloat(row.item_cost) + row.shipping_cost / 100).toFixed(2),
        },
        {
          name: "order_status",
          align: "left",
          label: "Order Status",
          field: "order_status",
          format: (val) => val,
        },
        {
          name: "details",
          align: "left",
          label: "View More",
          field: () => "Click to View Order Details",
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
  methods: {},
  computed: {},
});
</script>
