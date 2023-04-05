<template>
  <div class="q-pa-md fullContainer">
    <h3 class="title" style="font-family: TMUnicorn">
      {{ this.name }}
      <q-icon class="editIcon" name="edit" @click="namePrompt = true" />
    </h3>
    <div class="desc">
      {{ this.desc }}
      <q-icon class="editIcon" name="edit" @click="descPrompt = true" />
    </div>
    <div class="images">
      <div
        class="image q-my-md"
        v-for="(link, key) in this.images"
        :key="key"
        :id="key"
      >
        <q-img
          :src="link"
          alt="Uploaded image for the product"
          spinner-color="red"
          style="height: 340px; max-width: 350px"
          @click="
            () => {
              selectedImage = key;

              deleteImagePrompt = true;
            }
          "
        />
      </div>
    </div>
    <q-btn
      class="q-mt-md"
      color="primary"
      label="Upload New Image"
      @click="imgPrompt = true"
    />
    <div>
      <div class="fullContainer">
        <h4 style="font-family: TMUnicorn">Associated Products</h4>
        <q-btn
          class="q-mt-sm"
          color="primary"
          label="Add New Product"
          @click="productPrompt = true"
        />
        <div class="q-pa-md">
          <q-table
            dark
            style="width: 950px"
            title="Products"
            :rows="products"
            :columns="columns"
            row-key="name"
            separator="cell"
            :pagination="initialPagination"
            rounded
            no-data-label="No Associated Products"
            @row-click="editProduct"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Dialogues -->
  <q-dialog v-model="deleteImagePrompt" persistent>
    <q-card dark>
      <q-card-section class="row items-center">
        <q-avatar icon="delete" color="secondary" text-color="white" />
        <span class="q-ml-sm">Delete this image permanently?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="secondary" v-close-popup />
        <q-btn
          flat
          label="Delete"
          color="secondary"
          @click="deleteImage"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="imgPrompt" persistent>
    <q-card dark style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Direct Image Link</div>
      </q-card-section>

      <q-card-section dark class="q-pt-none">
        <q-input
          dark
          dense
          label="Direct Image Link Here"
          v-model="newImg"
          autofocus
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn color="secondary" flat label="Cancel" v-close-popup />
        <q-btn
          color="secondary"
          flat
          label="Add Image"
          @click="addImage()"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="descPrompt" persistent>
    <q-card dark style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Edit Description</div>
      </q-card-section>

      <q-card-section dark class="q-pt-none">
        <q-input
          dark
          dense
          label="Desc Goes Here"
          v-model="desc"
          autofocus
          autogrow
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn color="secondary" flat label="Cancel" v-close-popup />
        <q-btn
          color="secondary"
          flat
          label="Edit Desc"
          @click="updateDesign()"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="namePrompt" persistent>
    <q-card dark style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Edit Name</div>
      </q-card-section>

      <q-card-section dark class="q-pt-none">
        <q-input
          dark
          dense
          label="Name Goes Here"
          v-model="name"
          autofocus
          autogrow
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn color="secondary" flat label="Cancel" v-close-popup />
        <q-btn
          color="secondary"
          flat
          label="Edit Name"
          @click="updateDesign()"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="productPrompt" persistent>
    <Suspense>
      <createProduct
        v-model:closePrompt="productPrompt"
        v-model:designId="id"
        v-model:products="products"
        @update:close-prompt="updateData()"
      />
    </Suspense>
  </q-dialog>

  <!-- Edit Product -->
  <q-dialog v-model="editProductPrompt" persistent>
    <Suspense>
      <editProduct
        v-model:closePrompt="editProductPrompt"
        v-model:designId="id"
        v-model:rowData="selectedRow"
        @update:close-prompt="updateData()"
      />
    </Suspense>
  </q-dialog>
</template>

<style scoped>
.fullContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.desc {
  border: 1px red solid;
  border-radius: 15px;
  padding: 15px;
  width: 25rem;
  font-size: 1.01rem;
  color: white;
}

.images {
  flex-direction: row;
  display: flex;
  gap: 15px;
}

.image {
  width: 350px;
  cursor: pointer;
}

.editIcon {
  cursor: pointer;
}

@media only screen and (max-width: 600px) {
  .desc {
    width: 18rem;
    font-size: 1.02rem;
  }

  .images {
    flex-direction: column;
    display: flex;
    gap: 15px;
  }

  .image {
    width: 325px;
  }
}
</style>

<script>
import { ref } from "vue";
import createProduct from "./createProduct.vue";
import editProduct from "./editProduct.vue";

export default {
  components: { createProduct, editProduct },
  async setup() {
    const axios = require("axios");

    let baseUrl = "";
    if (window.location.href.includes("localhost")) {
      baseUrl = "http://localhost:5000";
    } else {
      baseUrl = window.location.origin;
    }
    let isAdmin = null;
    let designData = null;
    let products = null;
    const id = /[^/]*$/.exec(window.location.href)[0];

    try {
      isAdmin = await axios.get(baseUrl + "/admin/isAdmin", {
        withCredentials: true,
      });
      designData = await axios.get(baseUrl + "/designs/design/" + id, {
        withCredentials: true,
      });
      products = await axios.get(baseUrl + "/products/design/" + id);
    } catch (err) {
      router.push({ name: "login" });
    }
    const { design_name, design_desc, design_images } = designData.data;
    return {
      isAdmin: ref(isAdmin),
      baseUrl: ref(baseUrl),
      name: ref(design_name),
      desc: ref(design_desc),
      images: ref(design_images),
      deleteImagePrompt: ref(false),
      selectedImage: ref(null),
      curId: ref(id),
      newImg: ref(""),
      imgPrompt: ref(false),
      descPrompt: ref(false),
      namePrompt: ref(false),
      productPrompt: ref(false),
      editProductPrompt: ref(false),
      id: ref(id),
      products: ref(products.data),
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 25,
      },
    };
  },
  data() {
    return {
      selectedRow: "",
      columns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: "product_name",
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "category",
          align: "left",
          label: "Style",
          field: "category",
          sortable: true,
        },
        {
          name: "size",
          align: "left",
          label: "Size",
          field: "size",
          sortable: true,
        },
        {
          name: "unit_price",
          label: "Unit Price",
          align: "left",

          field: "unit_price",
          format: (val) => "$" + val,
        },
        {
          name: "sale_price",
          label: "Sale Price",
          align: "left",

          field: "sale_price",
          format: (val) => "$" + val,
        },
        {
          name: "inventory",
          align: "left",

          label: "Inventory",
          field: "inventory",
          format: (val) => (val ? val : "Sold Out"),
          sortable: true,
        },
      ],
    };
  },
  methods: {
    deleteImage() {
      this.images.splice(this.selectedImage, 1);
      this.updateDesign();
    },

    addImage() {
      this.images.push(this.newImg);
      this.updateDesign();
      this.newImg = "";
    },

    async updateDesign() {
      try {
        const updatedDesign = {
          name: this.name,
          desc: this.desc,
          images: this.images,
        };
        await this.$axios.put(
          this.baseUrl + "/designs/design/" + this.curId,
          { updatedDesign },
          {
            withCredentials: true,
          }
        );
      } catch (err) {
        console.log(err);
      }
    },
    editProduct(evt, row) {
      this.selectedRow = row;
      this.editProductPrompt = true;
    },
    async updateData() {
      try {
        const updatedData = await this.$axios.get(
          this.baseUrl + "/products/design/" + this.id
        );
        this.products = updatedData.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
