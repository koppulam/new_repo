import Vue from 'vue'
import App from './instances/App.vue'
import ProductPreview from './instances/ProductPreview.vue'
import ProductQuatity from './instances/Quantity.vue'
import AddToCart from './instances/AddToCart.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(ProductPreview),
}).$mount('#productPreview');

new Vue({
  render: h => h(App),
}).$mount('#app2');


new Vue({
  render: h => h(ProductQuatity),
}).$mount('#quantity');


new Vue({
  render: h => h(AddToCart),
}).$mount('#addtocart');


