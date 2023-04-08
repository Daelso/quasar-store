<template>
  <div class="q-pa-md">
    <div class="items-container">
      <div
        class="item"
        v-for="(design, key) in designs"
        :key="key"
        @click="goToDesign(design.design_id)"
      >
        <q-img
          :src="design.design_images[0]"
          :alt="design.design_desc"
          spinner-color="red"
        />
        <div class="caption q-my-sm">{{ design.design_name }}</div>
        <div class="price">from ${{ design.low }}</div>
        <div v-if="design.totalInventory < 1" class="broken-console q-my-sm">
          SOLD OUT
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.items-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 900px; /* or any other desired value */
}

.caption {
  font-family: TMUnicorn;
  font-size: large;
}

.price {
  font-family: Geiny;
  color: white;
}

.item {
  width: 250px; /* or any other desired value */
  height: 350px; /* or any other desired value */
  margin: 10px; /* or any other desired value */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.15s ease-in-out;
}

.item:hover {
  transform: scale(1.1); /* Zoom in by 10% on hover */
  cursor: pointer;
}

@media only screen and (max-width: 812px) {
  .items-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  .item:active {
    transform: scale(1.1); /* Zoom in by 10% on hover */
    cursor: pointer;
  }
}
</style>

<script>
import { ref } from "vue";
import nosImage from "../assets/images/Nosfer_logo.png";
import { useMeta } from "quasar";

const metaData = {
  // sets document title
  title: "Nicofest",
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title) => `${title} - Catalog`,

  // meta tags
  meta: {
    description: {
      name: "description",
      content:
        "Load up on your favorite stylish and comfortable retro video-game designs.",
    },
    keywords: {
      name: "keywords",
      content:
        "Clothing, tshirt, longsleeve, crew neck, retro, video games, video game",
    },
    equiv: {
      "http-equiv": "Content-Type",
      content: "text/html; charset=UTF-8",
    },
  },
};

export default {
  async setup() {
    const axios = require("axios");
    let currentUser = ref(false);
    useMeta(metaData);

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }

    const designs = await axios.get(baseUrl + "/designs/active");

    return {
      currentUser,
      baseUrl: ref(baseUrl),
      async onSubmit() {
        await axios
          .get(baseUrl + "/user/currentUser", {
            withCredentials: true,
          })
          .then((resp) => {
            return resp.data;
          });
      },
      designs: ref(designs.data),
    };
  },
  async mounted() {
    this.currentUser = await this.$axios
      .get(this.baseUrl + "/user/currentUser", {
        withCredentials: true,
      })
      .then((resp) => {
        if (resp.data.activated != 1) {
          this.$q.notify({
            message:
              "Account not yet activated! It may be closed in 60 days if not made active.",
            color: "primary",
            avatar: nosImage,
            timeout: 25000,
            actions: [
              {
                label: "Re-send email",
                color: "secondary",
                handler: async () => {
                  let resend = await axios
                    .post(
                      baseUrl + "/user/resendActivation",
                      {},
                      {
                        withCredentials: true,
                      }
                    )
                    .then(() =>
                      $q.notify({
                        color: "green-4",
                        textColor: "white",
                        icon: "cloud_done",
                        message: "Email resent!",
                      })
                    )
                    .catch((err) => {
                      $q.notify({
                        color: "red-5",
                        textColor: "white",
                        icon: "warning",
                        message: `Failed to send email, please try again later.`,
                      });
                    });
                },
              },
              {
                label: "Dismiss",
                color: "white",
              },
            ],
          });
        }
        return resp.data;
      });
  },
  methods: {
    goToDesign(id) {
      this.$router.push({ name: "viewProduct", params: { id } });
    },
  },
  computed: {},
};
</script>
