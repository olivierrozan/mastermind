<template>
  <b-col id="board" class="m-auto" cols="4">
    <div v-show="mode === 0">
      <b-button
        class="my-2 w-100"
        variant="primary"
        @click="choosePVCPU()"
      >
        Player vs CPU
      </b-button>
      <b-button
        class="my-2 w-100"
        variant="primary"
        @click="choosePVP()"
      >
        Player vs Player
      </b-button>
    </div>

    <div v-show="mode === 1 || mode === 2">
      <h2>
        <span v-show="mode === 1">Player vs CPU</span>
        <span v-show="mode === 2">Player vs Player</span>
      </h2>

      <b-form-checkbox
        v-show="mode === 1"
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
      />

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
        @change="changeSoluce"
      />

      <div v-show="mode === 2" class="mt-3">
        <h3>Choisis une combinaison</h3>

        <b-card 
          class="one-row"
          no-body
        >
          <b-card 
            class="one-column"
            no-body
          >
            <div
              v-for="(one2, index2) in soluce"
              :key="`c-${index2}`"
              class="one-cell"
            >
              <div
                class="pion"
                :class="soluce[index2]"
              ></div>
            </div>
          </b-card>
        </b-card>

        <b-card
          id="pattern"
          class="mt-2"
          no-body
        >
          <div
            v-for="(item, index) in colorsList"
            :key="index"
            class="one-cell"
          >
            <div
              class="pion"
              :class="item"
              @click="chooseColor(index)"
            ></div>
          </div>

          <b-button
            class="ml-2"
            variant="secondary"
            size="sm"
            @click="resetSoluce()"
          >
            Reset
          </b-button>
        </b-card>
      </div>


      <div class="d-inline-flex mt-4 w-100">
        <b-button
          class="mr-2 w-50"
          variant="secondary"
          @click="backToMenu()"
        >
          Retour
        </b-button>
        <b-button
          class="ml-2 w-50"
          variant="primary"
          @click="play()"
          :disabled="mode === 2 && soluce.length < 4"
        >
          Valider
        </b-button>
      </div>
    </div>
  </b-col>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Settings',
  props: ['mode'],
  components: {},
  data: function () {
    return {
      colorsList: ["red", "blue", "yellow", "green"],
      soluce: [],
      totalColorsList: ["red", "blue", "yellow", "green", "orange", "purple", "marroon", "pink"],
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
    chooseColor: function (color) {
      // Affecte la couleur sélectionnée
      if (this.soluce.length < this.settings.codeWidth) {
        this.soluce.push(this.totalColorsList[color]);
      }

    },
    resetSoluce: function () {
      this.soluce = [];
    },
    changeSoluce: function (data) {
      this.colorsList = [];
      
      for (let j = 0; j < data; j++) {
        this.colorsList.push(this.totalColorsList[j]);
      }
    },
    backToMenu: function () {
      this.$emit('selectedMode', 0);
    },
    choosePVCPU: function () {
      this.$emit('selectedMode', 1);
    },
    choosePVP: function () {
      this.$emit('selectedMode', 2);
    },
    initSoluce: function () {
      // Génère le code à trouver
      if (this.settings.useColorsOnce) {
        // Pas de duplication: shuffle
        this.soluce = this.colorsList
          .map((_value, index) => ({ index, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ index }) => index);
      } else {
        // Duplication: Possibilité d'utiliser une couleur plusieurs fois
        for (let i = 0; i < this.settings.codeWidth; i++) {
          this.soluce[i] = Math.floor(Math.random() * this.settings.codeWidth);
        }
      }
    },
    play: function () {
      if (this.mode === 1) {
        this.initSoluce();
        this.settings.title = 'CPU';
      } else {
        for (let j = 0; j < this.soluce.length; j++) {
          this.soluce[j] = this.colorsList.indexOf(this.soluce[j]);
        }

        this.settings.title = 'Player';
      }

      this.$emit('selectedMode', 3);
      this.$emit('play', [this.settings, this.soluce, this.colorsList]);
    }
  }
};
</script>

<style lang="scss">
</style>
