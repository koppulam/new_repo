<template>
    <div>
        <h1>Final amount you save opting for lease program!</h1>
        <h2>{{saving}}</h2>
        <button class="btn" @click="gotoUserInputSection">
            <span> Start Over </span>
        </button>
    </div>
</template>

<script>
export default{
    name: 'summary',
    props: ['saving'],
    methods: {
        gotoUserInputSection: function() {
            this.$emit('gotoUserInputSection');
        }
    }
}
</script>