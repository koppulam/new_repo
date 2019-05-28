<template>
    <div>
        <button class="btn" v-on:click="addtoCart">Add to cart</button>

        <p v-if="isAddedToCart">{{message}}</p>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import store from '../store/index.js';
export default {
    name: 'productQuantity',
    store,
    data: function() {
        return {
            isAddedToCart: false,
            message: ''
        }
    },
    computed: mapState({
        'quantity': state => state.quantity
    }),
    methods: {
        addtoCart() {
            this.isAddedToCart = true;
            this.message = `Added ${this.quantity} products to bag`
        }
    }
}
</script>

