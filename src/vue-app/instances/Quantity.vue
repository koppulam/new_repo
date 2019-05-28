<template>
    <div class="pdp-quantity">
        <button class="btn" v-on:click="decreaseQuantity">-</button>
        <span class="pdp-quantity__value">{{quantity}}</span>
        <button class="btn" v-on:click="increaseQuantity">+</button>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import store from '../store/index.js';

export default {
    name: 'productQuantity',
    store,
    props: ['maxquantity'],
    computed: mapState({
        'quantity': state => state.quantity
    }),
    methods: {
        increaseQuantity() {
            this.$store.dispatch('incrementQuantity');
        },
        decreaseQuantity() {
            this.$store.dispatch('decrementQuantity');
        }
    }
}
</script>
<style lang="scss">
.pdp-quantity {
    .pdp-quantity {
        &__value {
            font-size: 24px;
            padding: 8px;
        }
    }
    .btn {
        display: inline;
    }
}
</style>

