<template>
  <q-page class="flex flex-center">
    <Suspense>
      <manageDesigns />
    </Suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import manageDesigns from "src/components/admin/manageDesigns";

export default defineComponent({
  name: "manage-designs",
  components: { manageDesigns },
});
</script>
