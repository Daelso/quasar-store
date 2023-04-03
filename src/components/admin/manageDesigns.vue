<template>
  <div class="q-pa-md" style="max-width: 400px">tnd table</div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  async setup() {
    const $q = useQuasar();
    const axios = require("axios");
    const router = useRouter();

    let loginAttempt = 0;

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    let isAdmin = null;
    try {
      isAdmin = await axios.get(baseUrl + "/admin/isAdmin", {
        withCredentials: true,
      });
    } catch (err) {
      router.push({ name: "login" });
    }

    return {
      isAdmin: ref(isAdmin),

      onSubmit() {
        let loginInfo = {
          email: email.value,
          password: password.value,
        };
        axios
          .post(baseUrl + "/user/login", loginInfo, {
            withCredentials: true,
          })
          .then(() =>
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Logged in, welcome back!",
            })
          )
          .then(() => {
            if (window.location.href.includes("localhost")) {
              window.location.replace("http://localhost:8080");
            } else {
              window.location.replace(window.location.origin);
            }
          })
          .catch(() => {
            loginAttempt++;
            if (loginAttempt <= 5) {
              $q.notify({
                color: "red-5",
                textColor: "white",
                icon: "warning",
                message: `Incorrect email or password! Login attempt ${loginAttempt}/5`,
              });
            } else {
              $q.notify({
                color: "red-5",
                textColor: "white",
                icon: "warning",
                message: `Login attempts exceeded, please try again in fifteen minutes. Try resetting your password if you continue to fail to login.`,
              });
            }
          });
      },
    };
  },
  data() {
    const router = useRouter();
    return {
      resetRedirect() {
        router.push({ name: "passwordForgot" });
      },
      registerRedirect() {
        router.push({ name: "register" });
      },
    };
  },
};
</script>
