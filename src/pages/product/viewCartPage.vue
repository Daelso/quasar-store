<template>
  <q-page class="flex flex-center">
    <Suspense>
      <viewCart />
    </Suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import viewCart from "src/components/product/viewCart.vue";

export default defineComponent({
  name: "view-cart-page",
  components: { viewCart },
});
</script>
