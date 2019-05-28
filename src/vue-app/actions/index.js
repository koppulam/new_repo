
function incrementQuantity(context) {
    context.commit('INCREMENT_QUANTITY');
}

function decrementQuantity(context) {
    context.commit('DECREMENT_QUANTITY');
}
export default {
    incrementQuantity,
    decrementQuantity
};