<template>
  <v-app class="scroll-y">
    <!-- Product list -->
    <v-container grid-list-lg>
      <v-layout row wrap>
        <LandingCard
          v-for="product in filteredProducts"
          :key="product.product_id"
          :product="product"
        ></LandingCard>
        <v-btn color="primary" dark red small bottom right fab floating fixed @click="scrollToTop">
          <v-icon>keyboard_arrow_up</v-icon>
        </v-btn>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import browserCookies from "browser-cookies";
import Toasted from "vue-toasted";
import LandingCard from "./LandingCard.vue";
import ShoppingCart from "../ShoppingCart.vue";
import axios from "../../../axios.js";

export default {
  data() {
    return {
      products: [],
      interval: null,
      snacksProducts: [],
      drinksProducts: [],
      personalProducts: [],
      electronicsProducts: [],
      school_suppliesProducts: [],
      miscProducts: [],
      favoriteProducts: []
    };
  },
  mounted: function loadProducts() {
    const loadingProductsToast = this.$toasted.show("Loading products...", {
      theme: "bubble",
      duration: 4000,
      position: "top-center",
      icon: "hourglass_empty"
    });

    axios
      .get("/api/products")
      .then(response => {
        this.products = response.data;
        loadingProductsToast.text("Products loaded!").goAway(500);
        this.sortProducts();
      })
      .catch(error => {
        if (error.response) {
          console.log(error);
          loadingProductsToast.goAway();
          this.$toasted.error("Something went wrong", {
            theme: "bubble",
            duration: 4000,
            position: "top-center",
            icon: "report_problem"
          });
        }
      });
  },
  computed: {
    searchTerm() {
      return this.$store.getters["dashboard/getSearchTerm"];
    },
    selectedCategory() {
      return this.$store.getters["dashboard/getSelectedCategory"];
    },
    filteredProducts() {
      if (this.searchTerm) {
        return this.products.filter(
          product =>
            product.product_name
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase()) ||
            product.category
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase())
        );
      }
      const category = this.selectedCategory
        .toLowerCase()
        .split(" ")
        .join("_");
      if (category === "popular" || !category) {
        return this.products;
      }
      if (category === "favorites") {
        return this.products.filter(product => product.is_favorite === "true");
      }
      return this.products.filter(product => product.category === category);
    }
  },
  components: {
    LandingCard,
    ShoppingCart
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    sortProducts() {
      const allProducts = this.products;
      this.snacksProducts = allProducts.filter(product => {
        allProducts.splice(
          allProducts.indexOf(allProducts[product]),
          allProducts.indexOf(allProducts[product]) + 1
        );
        return product.category === "snacks";
      });
      this.drinksProducts = allProducts.filter(product => {
        allProducts.splice(
          allProducts.indexOf(allProducts[product]),
          allProducts.indexOf(allProducts[product]) + 1
        );

        return product.category === "drinks";
      });
      this.personalProducts = allProducts.filter(product => {
        allProducts.splice(
          allProducts.indexOf(allProducts[product]),
          allProducts.indexOf(allProducts[product]) + 1
        );
        return product.category === "personal";
      });
      this.electronicsProducts = allProducts.filter(
        product => product.category === "electronics"
      );
      this.school_suppliesProducts = allProducts.filter(product => {
        allProducts.splice(
          allProducts.indexOf(allProducts[product]),
          allProducts.indexOf(allProducts[product]) + 1
        );
        return product.category === "school_supplies";
      });
      this.miscProducts = allProducts.filter(
        product => product.category === "misc"
      );
    }
  }
};
</script>

<style lang="scss" src="../../../assets/css/landing.scss">
a {
  text-decoration: none !important;
}
</style>
