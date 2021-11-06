<template>
  <section id="home">
    <h1 class="py-2">Mastermind</h1>
    <div id="score">
      <h2 v-show="win">GAGNE</h2>
      <h2 v-show="selectedRow === 10">PERDU</h2>
    </div>
      
    <b-row id="home-wrapper">
      <b-col id="board" class="m-auto" cols="4">
        <div id="soluce" v-show="selectedRow === 10">
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
                class="one-cell"
                v-for="(one9, index9) in soluce"
                :key="`soluce-${index9}`"
              >
                <div
                  class="pion"
                  :class="{
                            red: one9 === 0,
                            blue: one9 === 1,
                            green: one9 === 2,
                            orange: one9 === 3
                          }"
                ></div>
              </div>
            
            </b-card>
          </b-card>
        </div>
        
        <b-card 
          class="one-row"
          v-for="(one, index) in grille"
          :key="`r-${index}`"
          no-body
        >
          <b-card 
            class="one-column"
            no-body
          >
            <div
              class="one-cell"
              v-for="(one2, index2) in one.data"
              :key="`c-${index2}`"
            >
              <div
                class="pion"
                :class="{
                          target: selectedRow === index && selectedColumn === index2,
                          idle: selectedRow === index,
                          red: one.data[index2] === 0,
                          blue: one.data[index2] === 1,
                          green: one.data[index2] === 2,
                          orange: one.data[index2] === 3
                        }"
                @click="chooseCell(index, index2)"
              ></div>
            </div>

            <div class="marker">
              <span
                v-for="(i, index3) in markersList[index].correct"
                :key="`c-${index3}`"
                class="pion-marker mx-1 correct"
              ></span>
              <span
                v-for="(j, index4) in markersList[index].wrong"
                :key="`w-${index4}`"
                class="pion-marker mx-1 wrong"
              ></span>
              <span
                v-for="(k, index5) in markersList[index].incorrect"
                :key="`i-${index5}`"
                class="pion-marker mx-1 incorrect"
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
              :disabled="disableBtn()"
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
      isPlaying: true,
      soluce: [],
      selectedRow: 0,
      selectedColumn: 0,
      selectedColor: '',
      win: false,
      markersList: []
    };
  },
  created: function () {
    this.init();
  },
  computed: {
  },
  methods: {
    disableBtn: function () {
      if (this.selectedRow < 10) {
        return this.grille[this.selectedRow].data[3] === -1 || !this.isPlaying;
      } else {
        return !this.isPlaying;
      }
    },
    init: function () {
      /*
        rouge: 0
        bleu: 1
        vert: 2
        orange: 3
      */

      for (let i = 0; i < 10; i++) {
        this.grille.push({
          data: []
        });
        this.markersList.push({
          correct: 0,
          wrong: 0,
          incorrect: 0
        });

        for (let j = 0; j < 4; j++) {
          this.grille[i].data.push(-1);
        }
      }
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
        this.grille[this.selectedRow].data[this.selectedColumn] = color;
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

      for (var i = 0; i < 4; ++i) {
        if (this.grille[this.selectedRow].data[i] === this.soluce[i]) {
          this.markersList[this.selectedRow].correct++;
        } else if (this.soluce.indexOf(this.grille[this.selectedRow].data[i]) >= 0) {
          this.markersList[this.selectedRow].wrong++;
        }else {
          this.markersList[this.selectedRow].incorrect++;
        }
      }

      if (this.markersList[this.selectedRow].correct === 4) {
        this.isPlaying = false;
        this.win = true;
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

.correct {
  background: white;
}

.wrong {
  background: grey;
}

.incorrect {
  background: black;
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

  h2,
  h3 {
    color: white;
  }

  #score {
    height: 40px;
  }

  #home-wrapper {
    margin: 0;
    padding: 0;

    #board {
      #soluce {
        h3 {
          color: green;
        }

        .card {
          border-top: 1px solid green !important;
          border-bottom: 1px solid green !important;
        }
      }
      
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
