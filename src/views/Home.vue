<template>
  <section id="home">
    <h1 class="py-2">Mastermind</h1>
    <b-row id="home-wrapper">
      <Menu
        v-if="mode < 3"
        :mode="mode"
        @selectedMode="setMode"
        @play="setPlay"
      />
      <Game
        v-if="mode === 3"
        :mode="mode"
        :settings="settings"
        @selectedMode="setMode"
      />
    </b-row>

  </section>
</template>

<script>
// @ is an alias to /src
import Menu from './Menu';
import Game from './Game';
export default {
  name: "Home",
  components: {
    Menu,
    Game
  },
  data: function () {
    return {
      mode: 0,
      settings: {
        duplicates: false,
        attempts: 0,
        codeWidth: 0
      },
    };
  },
  created: function () {
  },
  computed: {
  },
  methods: {
    setMode: function (val) {
      this.mode = val;
    },
    setPlay: function (val) {
      this.settings = val;
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
