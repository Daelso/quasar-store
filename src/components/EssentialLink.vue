<template>
  <q-item clickable style="color: red" @click="goToFaq">
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
  methods: {
    goToFaq() {
      this.$router.push({ name: "faq" });
    },
  },
});
</script>
