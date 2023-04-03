<template>
  <q-page class="flex flex-center">
    <Suspense>
      <LoginForm />
    </Suspense>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import LoginForm from "src/components/registry/loginForm.vue";

export default defineComponent({
  name: "manage-products",
  components: { LoginForm },
});
</script>
