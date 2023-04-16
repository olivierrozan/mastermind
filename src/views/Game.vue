<template>
  <b-col
    id="board"
    class="m-auto"
    cols="4"
  >
    <b-card
      class="p-2"
      no-body
    >
      <h2>{{ settings.title }}</h2>
      <div v-if="settings.useColorsOnce">
        Utilise les couleurs une seule fois
      </div>
      <div v-else>
        Utilise les couleurs plusieurs fois
      </div>
      <div>Nombre d'essais: {{ settings.attempts }}</div>
      <div>Longueur de code: {{ settings.codeWidth }}</div>
    </b-card>
    
    <span
      id="score"
      class="d-inline-block"
    >
      <h2>
        <span v-show="win">GAGNE</span>
        <span v-show="selectedRow === settings.attempts">PERDU</span>
        <b-button
          v-if="!isPlaying"
          class="mt-2 ml-2 d-inline-block"
          variant="primary"
          @click="replay()"
        >
          Rejouer
        </b-button>
      </h2>
    </span>
    
    <div
      id="wrapper"
      :class="`width-${settings.codeWidth}`"
    >
      <div
        v-show="selectedRow === settings.attempts"
        id="soluce"
      >
        <h3>Soluce</h3>
        <b-card 
          class="one-row my-2"
          no-body
        >
          <b-card 
            class="one-column"
            no-body
          >
            <div
              v-for="(one9, index9) in solucePlayer"
              :key="`soluce-${index9}`"
              class="one-cell"
            >
              <div
                class="pion"
                :class="colorsList[one9]"
              />
            </div>

            <div class="marker" />
          </b-card>
        </b-card>
      </div>
      
      <b-card 
        v-for="(one, index) in grille"
        :key="`r-${index}`"
        class="one-row"
        no-body
      >
        <b-card 
          class="one-column"
          no-body
        >
          <div
            v-for="(one2, index2) in one.data"
            :key="`c-${index2}`"
            class="one-cell"
          >
            <div
              class="pion"
              :class="{
                target: selectedRow === index && selectedColumn === index2,
                idle: selectedRow === index,
                [colorsList[one2]]: true
              }"
              @click="chooseCell(index, index2)"
            />
          </div>

          <div class="marker">
            <span
              v-for="(i, index3) in markersList[index].correct"
              :key="`c-${index3}`"
              class="pion-marker mx-1 correct"
            />
            <span
              v-for="(j, index4) in markersList[index].wrong"
              :key="`w-${index4}`"
              class="pion-marker mx-1 wrong"
            />
          </div>
        </b-card>
      </b-card>

      <b-card
        v-show="selectedRow < settings.attempts && !win"
        id="pattern"
        class="mt-5"
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
          />
        </div>
        <div class="one-btn">
          <b-button
            class="w-100"
            variant="primary"
            :disabled="disableBtn()"
            @click="submitLine()"
          >
            Valider
          </b-button>
        </div>
      </b-card>

      <b-button
        class="d-block mt-2"
        variant="primary"
        @click="giveUp()"
      >
        Abandonner la partie
      </b-button>

      <div class="mt-2 mb-5">
        <b-button
          v-b-toggle.rules
          class="d-block"
          variant="primary"
        >
          Règles du jeu
        </b-button>
        <b-collapse
          id="rules"
          class="mt-2"
        >
          <b-card no-body>
            <p class="mb-2">
              Trouve la combinaison correcte.
            </p>
            <div class="text-left">
              <span class="pion-marker mr-2 correct" />Un pion de couleur est bien dans la combinaison et à la bonne place
            </div>
            <div class="text-left">
              <span class="pion-marker mr-2 wrong" />Un pion de couleur est bien dans la combinaison mais pas à la bonne place.
            </div>
          </b-card>
        </b-collapse>
      </div>
    </div>
  </b-col>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Game",
  components: {},
  props: ['settings', 'solucePlayer', 'colorsList'],
  data: function () {
    return {
      totalColorsList: ["red", "blue", "yellow", "green", "orange", "purple", "marroon", "pink"],
      grille: [],
      isPlaying: true,
      selectedRow: 0,
      selectedColumn: 0,
      selectedColor: '',
      win: false,
      markersList: [],
      allCellsSelected: false
    };
  },
  computed: {
  },
  created: function () {
    this.init();
  },
  methods: {
    replay: function () {
      this.$router.go();
    },
    giveUp: function () {
      const that = this;

      that.$bvModal.msgBoxConfirm('Etes-vous sûr de vouloir abandonner la partie en cours ?', {
        title: 'Abandon',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'primary',
        okTitle: 'Oui',
        cancelTitle: 'Non',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
          if (value) {
            that.$router.go();
          }
        })
        .catch(err => {
          console.error(err.message);
        });
    },
    disableBtn: function () {
      // Désactive le bouton "valider"
      if (this.selectedRow < this.settings.attempts) {
        this.allCellsSelected = this.grille[this.selectedRow].data.some(function (cell) {
          return cell === -1;
        });
        
        return this.allCellsSelected || !this.isPlaying;
      } else {
        return !this.isPlaying;
      }
    },
    init: function () {
      /*
        Initialise la partie
        rouge: 0
        bleu: 1
        jaune: 2
        vert: 3
        orange: 4
        violet: 5
        marron: 6
        rose: 7
      */

      this.grille = [];
      this.markersList = [];

      for (let i = 0; i < this.settings.attempts; i++) {
        this.grille.push({
          data: []
        });
        this.markersList.push({
          correct: 0,
          wrong: 0
        });

        this.grille[i].data = new Array(this.settings.codeWidth).fill(-1);
      }

      this.isPlaying = true;
      this.selectedRow = 0;
      this.selectedColumn = 0;
      this.selectedColor = '';
      this.win = false;
    },
    chooseCell: function (index, index2) {
      // Affecte la cellule sélectionnée
      if (this.selectedRow === index) {
        this.selectedColumn = index2;
      }
    },
    chooseColor: function (color) {
      // Affecte la couleur sélectionnée
      this.selectedColor = color;

      if (this.selectedColumn < this.settings.codeWidth) {
        this.grille[this.selectedRow].data[this.selectedColumn] = this.selectedColor;
        this.selectedColumn++;

        if (this.grille[this.selectedRow].data[this.selectedColumn + 1] !== -1) {
          this.selectedColumn = -1;
        }

        for (let i = 0; i < this.settings.codeWidth; i++) {
          if (this.grille[this.selectedRow].data[i] === -1) {
            this.selectedColumn = i;
            break;
          }
        }
      }
    },
    submitLine: function () {
      // Clic sur "valider"
      this.checkSoluce();

      if (this.isPlaying) {
        this.selectedRow++;
        this.selectedColumn = 0;
      }

      if (this.selectedRow > (this.settings.attempts - 1)) {
        this.isPlaying = false;
      }
    },
    checkSoluce: function () {
      /*
        Compare le code proposé avec le code à trouver
        - La couleur est à la bonne place
        - La couleur à la mauvaise place, mais elle est dans la liste
        - La couleur n'est pas dans la liste
      */

      let selTMP = this.grille[this.selectedRow].data.slice(0);
      let soluceTMP = this.solucePlayer.slice(0);

      for (let i = 0; i < this.settings.codeWidth; i++) {
        if (selTMP[i] === soluceTMP[i]) {
          this.markersList[this.selectedRow].correct++;
          selTMP[i] = -1;
          soluceTMP[i] = -1;
        }
      }

      if (this.markersList[this.selectedRow].correct === this.settings.codeWidth) {
        this.isPlaying = false;
        this.win = true;
      }

      for (let i = 0; i < this.settings.codeWidth; i++) {
        if (selTMP[i] === -1) {
          continue;
        }

        const loc = soluceTMP.indexOf(selTMP[i]);

        if (loc !== -1) {
          this.markersList[this.selectedRow].wrong++;
          selTMP[i] = -1;
          soluceTMP[loc] = -1;
        }
      }
    },
  },
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
  background: #fd7e14;
}
.yellow {
  background: #ffe607;
}
.purple {
  background: #cd07ff;
}
.marroon {
  background: #814f04;
}
.pink {
  background: #ff07c1;
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
        height: 42px;
        
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
        border: 0;

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
