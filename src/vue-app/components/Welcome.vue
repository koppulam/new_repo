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

    .btn {
        position: relative;

        display: block;
        margin: 30px auto;
        padding: 0;

        overflow: hidden;

        border-width: 0;
        outline: none;
        border-radius: 2px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, .6);
        
        background-color: #2ecc71;
        color: #ecf0f1;
        
        transition: background-color .3s;
    }

    .btn:hover, .btn:focus {
        background-color: #27ae60;
    }

    .btn > * {
        position: relative;
    }

    .btn span {
        display: block;
        padding: 12px 24px;
    }

    .btn:before {
        content: "";
        
        position: absolute;
        top: 50%;
        left: 50%;
        
        display: block;
        width: 0;
        padding-top: 0;
            
        border-radius: 100%;
        
        background-color: rgba(236, 240, 241, .3);
        
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .btn:active:before {
        width: 120%;
        padding-top: 120%;
        
        transition: width .2s ease-out, padding-top .2s ease-out;
    }


    .btn.orange {
        background-color: #e67e22;
    }

    .btn.orange:hover, .btn.orange:focus {
        background-color: #d35400;
    }

    .btn.red {
        background-color: #e74c3c;
    }

    .btn.red:hover, .btn.red:focus {
        background-color: #c0392b;
    }
</style>
