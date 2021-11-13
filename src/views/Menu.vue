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
        v-model="settings.duplicates"
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
      grille: [],
      isPlaying: true,
      soluce: [],
      selectedRow: 0,
      selectedColumn: 0,
      selectedColor: '',
      win: false,
      markersList: [],
      nbColumns: 4,
      allCellsSelected: false,
      mode_: 0,
      settings: {
        duplicates: false,
        attempts: 5,
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
.pion {
  width: 25px;
  height: 25px;
  display: inline-block;
  border-radius: 100%;
}

.pion-marker {
  width: 10px;
  height: 10px;
  display: inline-block;
  border-radius: 100%;
}

.idle {
  background: grey;
}

.target {
  background: white !important;
}

.red {
  background: #dc3545;
}

.green {
  background: #28a745;
}

.blue {
  background: #007bff;
}

.orange {
  background: #ffc107;
}

.correct {
  background: white;
}

.wrong {
  background: grey;
}

.card {
  background: transparent !important;
  border-color: white !important;
  border-left: 0 !important;
  border-right: 0 !important;
  border-radius: 0 !important;
}

#menu {
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

  #menu-wrapper {
    margin: 0;
    padding: 0;

    #board {
      #score {
        height: 60px;
      }
      
      #wrapper {
        margin: auto;

        &.width-4 {
          width: 350px;
        }
        &.width-6 {
          width: 450px;
        }
        &.width-8 {
          width: 550px;
        }
      }

      #rules {
        background: #4c4f52;
        border: 1px solid #24252e;
        border-radius: 0.25rem;
        padding: 0.5rem;

        .card {
          border: 0;
        }
      }
      
      #soluce {
        h3 {
          color: #28a745;
        }

        .card {
          border-top: 1px solid #28a745 !important;
          border-bottom: 1px solid #28a745 !important;
        }
      }
      
      .one-row {
        .one-column {
          flex-direction: row !important;
          border: 0;
          color: white;

          .one-cell,
          .marker {
            height: 30px;
            margin: 5px 0;
          }

          .one-cell {
            width: 50px;
          }

          .marker {
            width: 150px;
            border-left: 1px solid white;
          }
        }
      }

      #pattern {
        flex-direction: row !important;
        width: 100%;
        border-bottom: 0;

        .one-cell,
        .one-btn {
          margin-top: 10px;
          align-self: end;
        }

        .one-cell {
          width: 50px;
        }
      }

      #pattern {
        .pion {
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
