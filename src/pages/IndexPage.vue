<template>
  <q-page class="flex flex-center">
    <Suspense>
      <home-page />
    </Suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import HomePage from "src/components/homePage.vue";

export default defineComponent({
  name: "IndexPage",
  components: { HomePage },
});
</script>
