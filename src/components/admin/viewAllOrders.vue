<template>
  <div class="q-pa-md">
    <q-table
      dark
      style="width: 1250px"
      title="All Orders"
      :rows="orders"
      :columns="columns"
      row-key="name"
      separator="cell"
      :pagination="initialPagination"
      rounded
      no-data-label="No Orders"
      @row-click="goToOrder"
    />
  </div>
</template>

<style scoped>
.fullContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.desc {
  border: 1px red solid;
  border-radius: 15px;
  padding: 15px;
  width: 25rem;
  font-size: 1.01rem;
  color: white;
}

.images {
  flex-direction: row;
  display: flex;
  gap: 15px;
}

.image {
  width: 350px;
  cursor: pointer;
}

.editIcon {
  cursor: pointer;
}

@media only screen and (max-width: 600px) {
  .desc {
    width: 18rem;
    font-size: 1.02rem;
  }

  .images {
    flex-direction: column;
    display: flex;
    gap: 15px;
  }

  .image {
    width: 325px;
  }
}
</style>

<script>
import { ref } from "vue";
import { date } from "quasar";

export default {
  async setup() {
    const axios = require("axios");

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    let isAdmin = null;
    let orders = null;

    try {
      isAdmin = await axios.get(baseUrl + "/admin/isAdmin", {
        withCredentials: true,
      });
      orders = await axios.get(baseUrl + "/orders/all", {
        withCredentials: true,
      });
    } catch (err) {
      router.push({ name: "login" });
    }
    console.log(orders);
    return {
      isAdmin: ref(isAdmin),
      baseUrl: ref(baseUrl),
      orders: ref(orders.data),
      initialPagination: {
        descending: false,
        page: 1,
        rowsPerPage: 25,
      },
    };
  },
  data() {
    return {
      selectedRow: "",
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
  methods: {
    goToOrder(evt, row) {
      this.$router.push({
        name: "viewOrder",
        params: { cart: row.stripe_checkout_id, id: row.order_id },
      });
    },
  },
};
</script>
