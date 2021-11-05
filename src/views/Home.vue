<template>
  <section id="home">
    <h1 class="py-2">Mastermind</h1>
    <div id="score">
      <h2 v-if="nbCorrect === 4">GAGNE</h2>
      <h2 v-if="selectedRow > 9">PERDU</h2>
    </div>
      
    <b-row id="home-wrapper">
      <b-col id="board" class="m-auto" cols="4">
        <b-card 
          class="one-row"
          v-for="(one, index) in grille"
          :key="index"
          no-body
        >
          <b-card 
            class="one-column"
            no-body
          >
            <div
              class="one-cell"
              v-for="(one2, index2) in one"
              :key="index2"
            >
              <div
                class="pion"
                :class="{
                          target: selectedRow === index && selectedColumn === index2,
                          idle: selectedRow === index,
                          red: grille[index][index2] === 0,
                          blue: grille[index][index2] === 1,
                          green: grille[index][index2] === 2,
                          orange: grille[index][index2] === 3
                        }"
                @click="chooseCell(index, index2)"
              ></div>
            </div>

            <div class="marker">
              <span
                class="pion-marker mx-1"
                :class="{
                          incorrect: false,
                          wrong: false,
                          correct: true
                        }"
              ></span>
              <span
                class="pion-marker mx-1"
                :class="{
                          incorrect: false,
                          wrong: false,
                          correct: true
                        }"
              ></span>
              <span
                class="pion-marker mx-1"
                :class="{
                          incorrect: false,
                          wrong: false,
                          correct: true
                        }"
              ></span>
              <span
                class="pion-marker mx-1"
                :class="{
                          incorrect: false,
                          wrong: false,
                          correct: true
                        }"
              ></span>
            </div>
          </b-card>
        </b-card>

        <b-card
          id="pattern"
          class="mt-5"
          no-body
        >
          <div class="one-cell">
            <div
              class="pion red"
              @click="chooseColor(0)"
            ></div>
          </div>
          <div class="one-cell">
            <div
              class="pion blue"
              @click="chooseColor(1)"
            ></div>
          </div>
          <div class="one-cell">
            <div
              class="pion green"
              @click="chooseColor(2)"
            ></div>
          </div>
          <div class="one-cell">
            <div
              class="pion orange"
              @click="chooseColor(3)"
            ></div>
          </div>
          <div  class="one-cell">
            <b-button
              class="w-100"
              variant="primary"
              @click="submitLine()"
              :disabled="selectedColumn < 4 || !this.isPlaying"
            >
              Valider
            </b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <b-modal id="modal-1" title="Règles du jeu">
      <p class="my-4">Trouve la combinaison correcte.</p>
      <div><span class="pion mx-1 black"></span> Un pion de couleur n'est pas dans la combinaison.</div>
      <div><span class="pion mx-1 red"></span>Un pion de couleur est bien dans la combinaison mais pas à la bonne place.</div>
      <div><span class="pion mx-1 green"></span>Un pion de couleur est bien dans la combinaison et à la bonne place</div>
      <div></div>
      <div></div>
    </b-modal>
  </section>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
  data: function () {
    return {
      colorsList: ["red", "blue", "green", "orange"],
      grille: [],
      selectedX: 0,
      selectedY: 0,
      isPlaying: true,
      soluce: [],
      nbWrongPlace: 0,
      nbIncorrect: 0,
      nbCorrect: 0,
      selectedRow: 0,
      selectedColumn: 0,
      selectedColor: ''
    };
  },
  created: function () {
    this.init();
  },
  methods: {
    init: function () {
      /*
        rouge: 0
        bleu: 1
        vert: 2
        orange: 3
      */
      this.grille = [
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1]
      ];
      this.soluce = [1, 2, 1, 2];
    },
    chooseCell: function (index, index2) {
      if (this.selectedRow === index) {
        this.selectedColumn = index2;
      }
    },
    chooseColor: function (color) {
      this.selectedColor = color;

      if (this.selectedColumn < 4) {
        this.grille[this.selectedRow][this.selectedColumn] = color;
        this.selectedColumn++;
      }
    },
    submitLine: function () {
      this.checkSoluce();

      if (this.isPlaying) {
        this.selectedRow++;
        this.selectedColumn = 0;
      }

      if (this.selectedRow > 9) {
        this.isPlaying = false;
      }
    },
    checkSoluce: function () {
      /*
        - La couleur est à la bonne place
        - La couleur à la mauvaise place, mais elle est dans la liste
        - La couleur n'est pas dans la liste
      */

      this.nbCorrect = 0;
      this.nbWrongPlace = 0;
      this.nbIncorrect = 0;

      for (var i = 0; i < 4; ++i) {
        if (this.grille[this.selectedRow][i] === this.soluce[i]) {
          this.nbCorrect++;
        } else if (this.soluce.indexOf(this.grille[this.selectedRow][i]) >= 0) {
          this.nbWrongPlace++;
        }else {
          this.nbIncorrect++;
        }
      }

      if (this.nbCorrect === 4) {
        this.isPlaying = false;
      }

      // const td = tr.getElementsByClassName("board-col").item(5);
      // for (var j = 0; j < this.nbWrongPlace; ++j) {
      //   td.innerHTML += '<span class="pion mx-1 red"></span>';
      // }

      // for (var k = 0; k < this.nbIncorrect; ++k) {
      //   td.innerHTML += '<span class="pion mx-1 black"></span>';
      // }

      // for (var l = 0; l < this.nbCorrect; ++l) {
      //   td.innerHTML += '<span class="pion mx-1 green"></span>';
      // }

      // return { wrong: nbWrongPlace, incorrect: nbIncorrect };
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
  background: white;
}

.red {
  background: red;
}

.green {
  background: green;
}

.blue {
  background: blue;
}

.orange {
  background: orange;
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
  }

  h2 {
    color: white;
  }

  #score {
    height: 40px;
  }

  #home-wrapper {
    margin: 0;
    padding: 0;

    #board {
      .one-row {
        .one-column {
          flex-direction: row !important;
          border: 0;
          color: white;

          .one-cell,
          .marker {
            width: 20%;
            height: 30px;
            margin: 5px 0;
          }

          .marker {
            border-left: 1px solid white;
          }
        }
      }

      #pattern {
        flex-direction: row !important;
        width: 100%;
        border-bottom: 0;

        .one-cell {
          margin-top: 10px;
          width: 20%;

          .pion {
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
