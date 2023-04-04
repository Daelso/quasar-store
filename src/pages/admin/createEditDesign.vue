<template>
  <q-page class="flex flex-center">
    <Suspense>
      <createDesigns />
    </Suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import createDesigns from "src/components/admin/createEditDesign";

export default defineComponent({
  name: "create-edit-designs",
  components: { createDesigns },
});
</script>
