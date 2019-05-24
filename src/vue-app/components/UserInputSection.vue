<template>
    <div>
        <h1>Please enter below details</h1>
        <form class="userInputform">
            <h3>1. Overall details </h3>
            <div class="overall-details">
                <div class="group">
                    <input type="text" v-model="initialTaxableSalary" required="required">
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label class="text">Taxable salary per year</label>
                </div>
                <div class="group">
                    <input type="text" v-model="carValue" required="required">
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label class="text">Car value (including road tax)</label>
                </div>
                <div class="group">
                    <label>Term</label>
                    <div class="form-radio">
                        
                        <div class="radio" @click="setTerm(36)">
                            <label>
                                <input type="radio" value="36" name="radio" :checked="term === 36" >
                                <i class="helper"></i>
                                36
                            </label>
                        </div>
                        <div class="radio" @click="setTerm(48)">
                            <label>
                                <input type="radio" value="48" name="radio" :checked="term === 48" >
                                <i class="helper"></i>
                                48
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <h3>2. Car loan information</h3>
            <div class="loan-information">
                <div class="group">
                    <input type="text" v-model="carloanROI" required="required">
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label class="text">Car loan ROI</label>
                </div>
                <div class="group">
                    <input type="text" v-model="carMaintanence" required="required">
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label class="text">Expected car maintanence</label>
                </div>
            </div>

            <h3>3. Details from Avis</h3>
            <div class="avis-information">
                <div class="group">
                    <input type="text" v-model="monthlyEmi" required="required">
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label class="text">Monthly EMI</label>
                </div>
                <div class="group">
                    <input type="text" v-model="residualVal" required="required">
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label class="text">Expected residual value (at end of lease)</label>
                </div>
            </div>
            <div class="group">
                <button type="button" class="btn" @click="calculateSavings">
                    <span>Calculate your Savings</span>
                </button>
            </div>
            <div>
                <p>Final Saving <code> (income tax saved + Bank loan car value - Lease Car value) </code> </p>
                <strong>{{saving ? saving.toFixed(2).toLocaleString() : ''}}</strong>

                <hr />
                <p>Incometax saved </p>
                <strong>{{incomeTaxSaved ? incomeTaxSaved.toFixed(2).toLocaleString() : ''}}</strong>
                <p>Initial IncomeTax <strong>{{initialIncomeTax ? initialIncomeTax.toFixed(2).toLocaleString() : ''}}</strong></p>
                <p>Post Lease IncomeTax <strong>{{postLeaseTax ? postLeaseTax.toFixed(2).toLocaleString() : ''}}</strong></p>
                <hr />
                <p>Lease Car Value (end of tenure) </p>
                <strong> {{leasNetValue ? leasNetValue.toFixed(2).toLocaleString() : ''}}</strong>
                <p>Bank loan Car value (end of tenure) </p>
                <strong>{{totalLoanCarValue ? totalLoanCarValue.toFixed(2).toLocaleString() : ''}}</strong>
                <p>Bank Loan EMI <strong>{{this.regularEmi ? this.regularEmi.toFixed(2).toLocaleString() : ''}}</strong></p>
                <p>Downpayment <strong>{{this.carValue*0.1.toLocaleString()}}</strong></p>
                <p></p>
            </div>
            <table>
            </table>

        </form>
    </div>
</template>
<script>
export default {
    name: 'inputSection',
    data: function() {
        return {
            initialTaxableSalary: '',
            carloanROI: '',
            carValue: '',
            term: '',
            carMaintanence: '',
            monthlyEmi: '',
            residualVal: '',
            saving: '',
            incomeTaxSaved: '',
            leasNetValue: '',
            totalLoanCarValue: '',
            regularEmi: '',
            postLeaseTax: '',
            initialIncomeTax: ''
        }
    },
    methods: {
        setTerm: function(term) {
            this.term = term;
        },
        calcluateIncomeTax: function(salary) {
            if (salary > 1000000) {
                return this.calcluateIncomeTax(1000000) + (salary - 1000000)*0.3;
            } else if (salary > 500000) {
                return (salary - 500000)*0.2 + this.calcluateIncomeTax(500000);
            } else if (500000 >= salary && salary > 250000) {
                return 0;
            }
        },
        calculateSavings: function() {
            this.initialTaxableSalary = parseFloat(this.initialTaxableSalary)*1.04;
            this.monthlyEmi = parseFloat(this.monthlyEmi);
            this.carloanROI = parseFloat(this.carloanROI);
            this.carValue = parseFloat(this.carValue);
            this.carMaintanence = parseFloat(this.carMaintanence);
            this.residualVal = parseFloat(this.residualVal);

            this.initialIncomeTax = this.calcluateIncomeTax(this.initialTaxableSalary)*1.04;
            const postLeaseTaxableIncome = this.initialTaxableSalary - this.monthlyEmi * 12;
            this.postLeaseTax = this.calcluateIncomeTax(postLeaseTaxableIncome);

            const carloanROIpm = this.carloanROI/1200;
            const random = Math.pow(1 + carloanROIpm, this.term);
            this.regularEmi = ((this.carValue - this.carValue*0.1) * carloanROIpm) * (random/(random-1));

            this.totalLoanCarValue = this.regularEmi*this.term + this.carValue*0.1 + this.carMaintanence;
            this.incomeTaxSaved = ((this.initialIncomeTax - this.postLeaseTax) * (this.term/12));
            this.leasNetValue = this.monthlyEmi*this.term + this.residualVal;
            this.saving = this.totalLoanCarValue - this.leasNetValue + this.incomeTaxSaved;
            // this.$emit('gotoFinalSummarySection', { saving: finalSaving });
        }
    }
}
</script>
<style scoped>
    .wrapper {
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        -webkit-flex-direction: row;
        flex-grow: 0;
        -webkit-flex-grow: 0;
        justify-content: space-between;
    }
    .text {
        flex-grow: 1;
        -webkit-flex-grow: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-right: 20px;
    }
    .userInputform {
        max-width: 360px;
        margin: 0 auto;
    }

    h3 {
        text-align: center; 
    }

    .group {
        position: relative;
        margin: 45px 0;
    }
    textarea {
        resize: none;
    }

    input,
    textarea {
        background: none;
        color: #000;
        font-size: 18px;
        padding: 10px 10px 10px 5px;
        display: block;
        width: 320px;
        border: none;
        border-radius: 0;
        border-bottom: 1px solid #000;
    }

    input:focus {
        outline: none;
    }

    input:focus ~ label,
    input:valid ~ label {
        top: -14px;
        font-size: 12px;
        color: #000;
    }

    input[type="password"] {
        letter-spacing: 0.3em;
    }

    label.text {
        color: #000;
        font-size: 16px;
        font-weight: normal;
        position: absolute;
        pointer-events: none;
        left: 5px;
        top: 10px;
        transition: 300ms ease all;
    }

    .bar {
        position: relative;
        display: block;
        width: 320px;
        
    }

    .bar:before {
        content: '';
        height: 2px;
        width: 0;
        bottom: 0px;
        position: absolute;
        background: #000;
        transition: 300ms ease all;
        left: 0%;
    }


    .checkbox label,
    .form-radio label {
        position: relative;
        cursor: pointer;
        padding-left: 2rem;
        text-align: left;
        color: #333;
        display: block;
    }
    .checkbox input,
    .form-radio input {
        width: auto;
        opacity: 0.00000001;
        position: absolute;
        left: 0;
    }

    .radio {
        margin-bottom: 1rem;
    }
    .radio .helper {
        position: absolute;
        top: -0.25rem;
        left: -0.25rem;
        cursor: pointer;
        display: block;
        font-size: 1rem;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        color: #999;
    }
    .radio .helper::before, .radio .helper::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        margin: 0.25rem;
        width: 1rem;
        height: 1rem;
        -webkit-transition: -webkit-transform 0.28s ease;
        transition: -webkit-transform 0.28s ease;
        transition: transform 0.28s ease;
        transition: transform 0.28s ease, -webkit-transform 0.28s ease;
        border-radius: 50%;
        border: 0.125rem solid currentColor;
    }
    .radio .helper::after {
        -webkit-transform: scale(0);
                transform: scale(0);
        background-color: #337ab7;
        border-color: #337ab7;
    }
    .radio label:hover .helper {
        color: #337ab7;
    }
    .radio input:checked ~ .helper::after {
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
    }
    .radio input:checked ~ .helper::before {
        color: #337ab7;
    }
</style>


