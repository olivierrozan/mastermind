<template>
  <div id="board" class="m-auto col-4">
    <div v-show="mode === 0">
      <button
        class="my-2 w-100 btn btn-primary"
        @click="choosePVCPU()"
      >
        Player vs CPU
      </button>
      <button
        class="my-2 w-100 btn btn-primary"
        @click="choosePVP()"
      >
        Player vs Player
      </button>
    </div>

    <div v-show="mode === 1 || mode === 2">
      <h2>
        <span v-show="mode === 1">Player vs CPU</span>
        <span v-show="mode === 2">Player vs Player</span>
      </h2>

      <div
        v-show="mode === 1"
        id="checkbox-1"
        class="form-check form-switch my-2"
        name="checkbox-1"
      >
        <input
          id="flexCheckDefault"
          class="form-check-input"
          type="checkbox"
          v-model="settings.useColorsOnce"
          value="1"
        >
        <label class="form-check-label" for="flexCheckDefault">
          Utilise les couleurs une seule fois
        </label>
      </div>

      <label
        for="attempt"
        class="my-2"
      >
        Nombre d'essais
      </label>

      <select
        id="attempt"
        class="form-select"
        v-model="settings.attempts"
        aria-label="attempts"
      >
        <option
          v-for="(attempt, index) in AttemptsList"
          :key="index"
          :value="attempt.id"
        >
          {{ attempt.label }}
        </option>
      </select>

      <label
        for="code-Width"
        class="my-2"
      >
        Longueur de code
      </label>

      <select
        id="code-Width"
        class="form-select"
        v-model="settings.codeWidth"
        aria-label="code width"
        @change="changeSoluce"
      >
        <option
          v-for="(codeWidth, index) in codeWidthsList"
          :key="index"
          :value="codeWidth.id"
        >
          {{ codeWidth.label }}
        </option>
      </select>

      <div v-show="mode === 2" class="mt-3">
        <h3>Choisis une combinaison</h3>

        <div class="card one-row">
          <div class="card one-column">
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
          </div>
        </div>

        <div
          id="pattern"
          class="card mt-2"
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

          <button
            class="ms-2 btn btn-secondary btn-sm"
            @click="resetSoluce()"
          >
            Reset
          </button>
        </div>
      </div>

      <div class="d-inline-flex mt-4 w-100">
        <button
          class="me-2 w-50 btn btn-secondary"
          @click="backToMenu()"
        >
          Retour
        </button>
        <button
          class="ms-2 w-50 btn btn-primary"
          @click="play()"
          :disabled="mode === 2 && soluce.length < 4"
        >
          Valider
        </button>
      </div>
    </div>
  </div>
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
        { id: 5, label: '5' },
        { id: 10, label: '10' },
        { id: 15, label: '15' },
        { id: 20, label: '20' }
      ],
      codeWidthsList: [
        { id: 4, label: '4' },
        { id: 6, label: '6' },
        { id: 8, label: '8' }
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
      
      for (let j = 0; j < data.target.value; j++) {
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
