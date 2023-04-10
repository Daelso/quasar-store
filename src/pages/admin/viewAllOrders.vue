<template>
  <q-page class="flex flex-center">
    <Suspense>
      <viewAllOrders />
    </Suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import viewAllOrders from "src/components/admin/viewAllOrders.vue";

export default defineComponent({
  name: "view-all-orders",
  components: { viewAllOrders },
});
</script>
