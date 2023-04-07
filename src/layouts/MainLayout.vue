<template>
  <q-layout view="hhh lpR lfr">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title style="font-family: TMUnicorn">
          <router-link class="titleLogo" to="/">SchreckNet</router-link>
        </q-toolbar-title>

        <q-item clickable @click="goToCart()">
          <q-btn dense color="black" round icon="shopping_cart">
            <q-badge color="red" floating>{{ this.store.counter }}</q-badge>
          </q-btn>
        </q-item>

        <q-item v-if="!logInCheck" clickable style="align-items: center">
          <router-link to="/login">Login</router-link>
        </q-item>

        <q-item v-if="!logInCheck" clickable style="align-items: center">
          <router-link to="/register">Register</router-link>
        </q-item>

        <q-item v-if="logInCheck" clickable>
          <q-avatar @click="toggleRightDrawer">
            <img src="../assets/images/Nosfer_logo.png" />
          </q-avatar>
        </q-item>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      style="background-color: #171a1e; border-color: red"
      overlay
    >
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink />
      </q-list>
      <q-list v-if="this.currentUser && this.currentUser.is_admin">
        <q-item-label header> Admin Links </q-item-label>

        <AdminLink />
      </q-list>
    </q-drawer>

    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      overlay
      style="background-color: #171a1e; border-color: red"
    >
      <q-list>
        <q-item-label header> Profile Links </q-item-label>

        <ProfileLinks />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
      class="bg-transparent text-white text-center"
      style="opacity: 35%"
    >
      <router-link to="/privacy">Privacy</router-link> |
      <router-link to="/terms">Terms of Use</router-link> |
      <router-link to="/contact">Contact</router-link> |
      <router-link to="/faq">FAQ</router-link>
    </q-footer>
  </q-layout>
</template>

<style>
a,
a:visited,
a:hover,
a:active {
  color: inherit;
  text-decoration: none;
}

@media only screen and (max-width: 600px) {
  .titleLogo {
    display: none;
  }
}
</style>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import ProfileLinks from "components/profileLinks.vue";
import AdminLink from "src/components/AdminLink.vue";
import { useCounterStore } from "stores/cart";

const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "login",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
    ProfileLinks,
    AdminLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    let currentUser = ref(false);
    let loggedIn = ref(false);
    const store = useCounterStore();

    return {
      currentUser,
      loggedIn,
      essentialLinks: linksList,
      leftDrawerOpen,
      store,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },
    };
  },

  computed: {
    logInCheck() {
      if (this.currentUser != false) {
        return true;
      } else {
        return false;
      }
    },
  },

  methods: {
    goToCart() {
      this.$router.push({ name: "viewCart" });
    },
  },

  async mounted() {
    const axios = require("axios");

    //handling in case of refresh
    if (this.store.counter === 0) {
      const cart = JSON.parse(localStorage.getItem("cart"));
      this.store.cartSize(cart.length);
    }
    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    this.currentUser = await axios
      .get(baseUrl + "/user/currentUser", {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      });
  },
});
</script>
