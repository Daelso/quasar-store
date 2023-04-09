<template>
  <q-page class="flex flex-center">
    <Suspense>
      <viewOrder />
    </Suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import viewOrder from "src/components/product/viewOrder.vue";

export default defineComponent({
  name: "view-order",
  components: { viewOrder },
});
</script>
