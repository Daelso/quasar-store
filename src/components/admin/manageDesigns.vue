<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      dark
      class="table"
      title="Designs"
      :rows="rows"
      grid
      :columns="columns"
      row-key="name"
      :filter="filter"
      hide-header
      :pagination="initialPagination"
      @row-click="goToDesign"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          dark
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:top-left>
        <q-btn color="primary" label="Add New Design" @click="addDesign" />
      </template>
    </q-table>
  </div>
</template>

<style scoped>
.table {
  width: 100%;
  height: 100%;
}
</style>

<script>
import { ref } from "vue";

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
    try {
      isAdmin = await axios.get(baseUrl + "/admin/isAdmin", {
        withCredentials: true,
      });
    } catch (err) {
      router.push({ name: "login" });
    }

    let rows = await axios.get(baseUrl + "/designs/all", {
      withCredentials: true,
    });

    return {
      isAdmin: ref(isAdmin),
      rows: ref(rows.data),
      initialPagination: {
        sortBy: "design_id",
        descending: false,
        page: 1,
        rowsPerPage: 25,
      },
    };
  },
  data() {
    return {
      filter: "",
      columns: [
        {
          name: "design_id",
          required: true,
          label: "Design ID",
          align: "left",
          field: "design_id",
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "design_name",
          align: "center",
          label: "Design Name",
          field: "design_name",
          sortable: true,
        },
        {
          name: "design_desc",
          label: "Design Description",
          field: "design_desc",
          sortable: true,
        },
      ],
    };
  },
  methods: {
    addDesign() {
      this.$router.push({ name: "newDesign" });
    },
    goToDesign(evt, row) {
      this.$router.push({
        name: "manageDesign",
        params: { id: row.design_id },
      });
    },
  },
};
</script>
