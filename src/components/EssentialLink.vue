<template>
  <q-item clickable style="color: red" to="login">
    <q-item-section avatar>
      <q-icon color="secondary" name="school" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Meme</q-item-label>
      <q-item-label caption style="color: white">quasar.dev</q-item-label>
    </q-item-section>
  </q-item>

  <q-item clickable style="color: red" to="faq">
    <q-item-section avatar>
      <q-icon color="secondary" name="quiz" />
    </q-item-section>

    <q-item-section>
      <q-item-label>FAQ</q-item-label>
      <q-item-label caption style="color: white"
        >Frequently Asked Questions</q-item-label
      >
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
});
</script>
