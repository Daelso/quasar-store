<template>
  <q-page class="flex flex-center">
    <Suspense>
      <myOrders />
    </Suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import myOrders from "src/components/product/myOrders.vue";

export default defineComponent({
  name: "my-orders",
  components: { myOrders },
});
</script>
