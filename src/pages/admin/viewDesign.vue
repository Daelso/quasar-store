<template>
  <q-page class="flex flex-center">
    <Suspense>
      <viewDesign />
    </Suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import viewDesign from "src/components/admin/viewDesign";

export default defineComponent({
  name: "view-design",
  components: { viewDesign },
});
</script>
