<template>
  <div id="app">
    <transition name="component-fade" mode="out-in">
      <component v-bind:is="view"
        v-on:gotoUserInputSection="onGotoInputSection"
        v-on:gotoFinalSummarySection="gotoFinalSummarySection"
        v-bind="optionalProps"
      ></component>
    </transition>
  </div>
</template>

<script>
import Welcome from '../components/Welcome.vue';
import UserInputSection from '../components/UserInputSection.vue';
import SummarySection from '../components/SummarySection.vue';

export default {
  name: 'app',
  components: {
    Welcome,
    inputSection: UserInputSection,
    summarySection: SummarySection
  },
  data: function() {
    return {
      view: 'Welcome',
      optionalProps: {}
    };
  },
  methods: {
    onGotoInputSection: function() {
      this.view = 'inputSection';
    },
    gotoFinalSummarySection: function(properties) {
      this.view = 'summarySection';
      this.optionalProps = properties;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

h1 {
  text-align: center;
}
.heading {
  padding-bottom: 0;
}

.description {
  padding-bottom: 24px;
}
</style>
