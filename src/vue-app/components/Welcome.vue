<template>
    <div>
        <h1>Welcome to lease evaluator!</h1>
        <div>
            <h3 class="heading">Here is what you can expect here </h3>
            <p class="description">How much would you be able to save when you take a car through lease program (from AVIS)</p>

            <h3 class="heading"> Information expected from you </h3>
            <div class="description">
                <ol>
                <li>
                    <p><strong>Overall Details</strong></p>
                    <ul>
                    <li> Taxable salary per year <span>(this after all dedecutions like HRA, 80C, 80CC, 80D etc.) </span></li>
                    <li>Car value</li>
                    <li>Term of car loan (36 or 48)</li>
                    </ul>
                </li>
                <li>
                    <p><strong>Information for Car loan</strong></p>
                    <ul>
                    <li>ROI for car loan</li>
                    <li>Expected car maintenace charges for specified Term(like insurance, Accident Depreciation Waiver, tyre maintenance etc)</li>
                    </ul>
                </li>
                <li>
                    <p><strong>Details from Avis</strong></p>
                    <ul>
                    <li>Monthly EMI charged</li>
                    <li>Expected residual amount to be paid at end of lease</li>
                    </ul>
                </li>
                </ol>
            </div>
        </div>
        <button class="btn" @click="gotoUserInputSection"><span> Get Started </span></button>
    </div>
</template>

<script>
export default{
    name: 'Welcome',
    methods: {
        gotoUserInputSection: function() {
            this.$emit('gotoUserInputSection');
        }
    }
}
</script>
<style>
@import './css/global.css'
</style>
