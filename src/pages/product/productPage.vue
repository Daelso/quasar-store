<template>
  <q-page class="flex flex-center">
    <Suspense>
      <viewProduct />
    </Suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import viewProduct from "src/components/product/viewProduct.vue";

export default defineComponent({
  name: "view-product",
  components: { viewProduct },
});
</script>
