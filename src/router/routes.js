const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        name: "register",
        path: "/register",
        component: () => import("pages/registry/registerPage.vue"),
      },
      {
        name: "login",
        path: "/login",
        component: () => import("pages/registry/loginPage.vue"),
      },
      {
        name: "passwordForgot",
        path: "passwordForgot",
        component: () => import("pages/registry/passwordForgot.vue"),
      },
      {
        name: "passwordReset",
        path: "passwordReset/:user",
        component: () => import("pages/registry/passwordReset.vue"),
      },
      {
        name: "activateAccount",
        path: "activateAccount",
        component: () => import("pages/registry/activateAccount.vue"),
      },
      {
        name: "privacyPolicy",
        path: "privacy",
        component: () => import("pages/policy/privacyPolicy.vue"),
      },
      {
        name: "termsofuse",
        path: "terms",
        component: () => import("pages/policy/termsOfUse.vue"),
      },
      {
        name: "faq",
        path: "faq",
        component: () => import("pages/policy/faq.vue"),
      },
      {
        name: "contact",
        path: "contact",
        component: () => import("pages/policy/contact.vue"),
      },
      {
        name: "manageDesigns",
        path: "admin/designs",
        component: () => import("src/pages/admin/manageDesigns.vue"),
      },
      {
        name: "manageProducts",
        path: "admin/products",
        component: () => import("src/pages/admin/manageProducts.vue"),
      },
      {
        name: "newDesign",
        path: "admin/designs/new",
        component: () => import("src/pages/admin/createEditDesign.vue"),
      },
      {
        name: "manageDesign",
        path: "admin/designs/:id",
        component: () => import("src/pages/admin/viewDesign.vue"),
      },
      {
        name: "viewProduct",
        path: "designs/:id",
        component: () => import("src/pages/product/productPage.vue"),
      },
      {
        name: "viewCart",
        path: "cart",
        component: () => import("src/pages/product/viewCartPage.vue"),
      },
      {
        name: "checkoutComponent",
        path: "order-complete",
        component: () => import("src/pages/product/checkoutPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
