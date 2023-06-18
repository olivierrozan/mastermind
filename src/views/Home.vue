<template>
  <section id="home">
    <h1 class="py-2">
      Mastermind
    </h1>
    <b-row id="home-wrapper">
      <Settings
        v-if="mode < 3"
        :mode="mode"
        @selectedMode="setMode"
        @play="setPlay"
      />
      <Game
        v-if="mode === 3"
        :settings="settings"
        :solucePlayer="soluce"
        :colorsList="colorsList"
        @selectedMode="setMode"
      />
    </b-row>
  </section>
</template>

<script>
// @ is an alias to /src
import Settings from './Settings';
import Game from './Game';
export default {
  name: "Home",
  components: {
    Settings,
    Game
  },
  data: function () {
    return {
      mode: 0,
      settings: {
        title: '',
        useColorsOnce: false,
        attempts: 0,
        codeWidth: 0
      },
      soluce: [],
      colorsList: []
    };
  },
  computed: {
  },
  created: function () {
  },
  methods: {
    setMode: function (val) {
      this.mode = val;
    },
    setPlay: function (val) {
      this.settings = val[0];
      this.soluce = val[1];
      this.colorsList = val[2];
    }
  }
};
</script>

<style lang="scss">
#home {
  h1 {
    background: burlywood;
    color: #2c3e50;
  }

  h2 {
    span {
      vertical-align: bottom;
    }
  }

  h2,
  h3 {
    color: white;
  }

  #home-wrapper {
    margin: 0;
    padding: 0;
  }
}
</style>
