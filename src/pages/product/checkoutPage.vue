<template>
  <q-page class="flex flex-center">
    <Suspense>
      <checkoutComponent />
    </Suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import checkoutComponent from "src/components/product/checkoutComponent.vue";

export default defineComponent({
  name: "checkout-page",
  components: { checkoutComponent },
});
</script>
