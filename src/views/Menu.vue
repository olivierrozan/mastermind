<template>
  <b-col id="board" class="m-auto" cols="4">
    <div v-show="mode === 0">
      <b-button
        class="my-2 w-100"
        variant="primary"
        @click="choosePVP()"
      >
        Player vs IA
      </b-button>
    </div>

    <div v-show="mode === 1">
      <b-button
        class="my-2 w-100"
        variant="primary"
        @click="backToMenu()"
      >
        Retour
      </b-button>

      <b-form-checkbox
        id="checkbox-1"
        class="my-2"
        name="checkbox-1"
        v-model="settings.useColorsOnce"
        switch
      >
        Utilise les couleurs une seule fois
      </b-form-checkbox>

      <label
        for="attempt"
        class="my-2"
      >
        Nombre d'essais
      </label>
      <b-form-select
        id="attempt"
        v-model="settings.attempts"
        :options="AttemptsList"
      ></b-form-select>

      <label
        for="code-Width"
        class="my-2"
      >
        Longueur de code
      </label>
      <b-form-select
        id="code-Width"
        v-model="settings.codeWidth"
        :options="codeWidthsList"
      ></b-form-select>

      <b-button
        class="mt-4 w-100"
        variant="primary"
        @click="play()"
      >
        Valider
      </b-button>
    </div>
  </b-col>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Menu',
  props: ['mode'],
  components: {},
  data: function () {
    return {
      colorsList: ['red', 'blue', 'green', 'orange'],
      mode_: 0,
      settings: {
        useColorsOnce: false,
        attempts: 10,
        codeWidth: 4
      },
      AttemptsList: [
        { value: 5, text: '5' },
        { value: 10, text: '10' },
        { value: 15, text: '15' },
        { value: 20, text: '20' }
      ],
      codeWidthsList: [
        { value: 4, text: '4' },
        { value: 6, text: '6' },
        { value: 8, text: '8' }
      ]
    };
  },
  created: function () {
  },
  computed: {
  },
  methods: {
    backToMenu: function () {
      this.mode_ = 0;
      this.$emit('selectedMode', this.mode_);
    },
    choosePVP: function () {
      this.mode_ = 1;
      this.$emit('selectedMode', this.mode_);
    },
    play: function () {
      this.mode_ = 3;
      this.$emit('selectedMode', this.mode_);
      this.$emit('play', this.settings);
    }
  }
};
</script>

<style lang="scss">
</style>
