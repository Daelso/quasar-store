<template>
  <q-page class="contain">
    <header class="faq">Frequently Asked Questions</header>
    <div class="q-pa-md" style="max-width: 480px">
      <q-list bordered class="rounded-borders expansion">
        <q-expansion-item
          icon="local_shipping"
          label="Return Policy"
          caption="All Sales Are Final"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              As it stands, all sales are final on all orders. In the event you
              receive a product that was damaged in shipping, please contact us
              at insertemail@gmail.com and we will do our best to resolve the
              situation.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="design_services"
          label="Where do we get our designs?"
          caption="All designs are made in-house!"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              We have a talented team of designers who hand-craft each of our
              products.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="account_circle"
          label="Do I Need an Account to Order?"
          caption="No, but it helps speed things along and has some benefits."
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              A user account is completely optional and not required to complete
              a purchase. A user account will help move your order along faster
              as it allows us to store your information for next time. It also
              allows you to be the first to know whenever we drop new products
              as members will receive the first wave of emails.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="schedule"
          caption="We typically estimate 4-6 weeks."
          label="How Long Do Orders Take?"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              We aim for every order to arrive within 4-6 weeks following
              processing. We hope to get the item to you even faster but wait
              times can vary depending on the volume of sales.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="paid"
          label="Acceptable Forms of Payment"
          caption="We accept Payoal and all major US credit card carriers."
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              At the moment we accept all major US credit card carriers (Visa,
              Discovery, Mastercard, American Express, etc). Paypal is also a
              perfectly fine way to pay. We no longer accept crypto payments.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="paid"
          label="Is My Information Safe With You?"
          caption="We use the utmost care with all user information."
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              All sensitive data such as passwords or credit cards are hashed
              before entering our database. In the event of a leak, it would be
              nearly impossible for hackers to decrypt and access your
              information. In the unfortunate event of a breach we will inform
              all users ASAP. All payments are processed through stripe, a
              trusted processor also used by companies like Amazon, Target and
              Sony.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="email"
          label="How Can You Reach Us?"
          caption="Try the contact form or insertemail@gmail.com"
          dark
        >
          <q-card>
            <q-card-section class="backgroundDefault">
              Depending on what it is you need from us, the contact form may be
              the most appropriate avenue to reach us and often times will get
              the fastest response. If you have a question that falls outside
              the purview of the contact form, don't hesitate to email us at the
              above.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </q-page>
</template>

<style>
.backgroundDefault {
  background-color: #171a1e;
}
.contain {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.faq {
  font-family: TMUnicorn;
  font-size: 2rem;
}

.expansion {
  color: white;
}

@media only screen and (max-width: 600px) {
  .faq {
    font-size: 1rem;
  }
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "frequently-asked-questions",
});
</script>
