<template>
  <q-item clickable style="color: red" @click="goToDesigns">
    <q-item-section avatar>
      <q-icon color="secondary" name="design_services" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Manage Designs</q-item-label>
      <q-item-label caption style="color: white"
        >View/Manage/Create Designs</q-item-label
      >
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminLink",

  methods: {
    goToDesigns() {
      this.$router.push({ name: "manageDesigns" });
    },
  },
});
</script>
