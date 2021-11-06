<template>
  <section id="home">
    <h1 class="py-2">Mastermind</h1>
    <span id="score" class="d-inline-block">
      <h2>
        <span v-show="win">GAGNE</span>
        <span v-show="selectedRow === 10">PERDU</span>
        <b-button
          v-if="!isPlaying"
          class="mt-2 ml-2 d-inline-block"
          variant="primary"
          @click="init()"
        >
          Rejouer
        </b-button>
      </h2>
    </span>
      
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
                class="pion-marker mx-1 correct"
                v-for="(i, index3) in markersList[index].correct"
                :key="`c-${index3}`"
              ></span>
              <span
                class="pion-marker mx-1 wrong"
                v-for="(j, index4) in markersList[index].wrong"
                :key="`w-${index4}`"
              ></span>
              <span
                class="pion-marker mx-1 incorrect"
                v-for="(k, index5) in markersList[index].incorrect"
                :key="`i-${index5}`"
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

        <b-button
          class="d-block"
          v-b-toggle.rules
          variant="primary"
        >
          Règles du jeu
        </b-button>
        <b-collapse id="rules" class="mt-2">
          <b-card no-body>
            <p class="mb-2">Trouve la combinaison correcte.</p>
            <div class="text-left"><span class="pion-marker mr-2 correct"></span>Un pion de couleur est bien dans la combinaison et à la bonne place</div>
            <div class="text-left"><span class="pion-marker mr-2 wrong"></span>Un pion de couleur est bien dans la combinaison mais pas à la bonne place.</div>
            <div class="text-left"><span class="pion-marker mr-2 incorrect"></span>Un pion de couleur n'est pas dans la combinaison.</div>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>

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
      // Désactive le bouton "valider"
      if (this.selectedRow < 10) {
        return (
          this.grille[this.selectedRow].data[0] === -1
          || this.grille[this.selectedRow].data[1] === -1
          || this.grille[this.selectedRow].data[2] === -1
          || this.grille[this.selectedRow].data[3] === -1
        )
          || !this.isPlaying;
      } else {
        return !this.isPlaying;
      }
    },
    init: function () {
      /*
        Initialise la partie
        rouge: 0
        bleu: 1
        vert: 2
        orange: 3
      */

     this.grille = [];
     this.soluce = [];
     this.markersList = [];

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

      this.initSoluce();
      this.isPlaying = true;
      this.selectedRow = 0;
      this.selectedColumn = 0;
      this.selectedColor = '';
      this.win = false;
    },
    initSoluce: function () {
      // Génère le code à trouver
      const min = Math.ceil(0);
      const max = Math.floor(3);

      for (let i = 0; i < 4; i++) {
        const nb = Math.floor(Math.random() * (max - min + 1)) + min;
        this.soluce.push(nb);
      }
    },
    chooseCell: function (index, index2) {
      // Affecte la cellule sélectionnée
      if (this.selectedRow === index) {
        this.selectedColumn = index2;
        // this.grille[this.selectedRow].data[this.selectedColumn] = -1;
      }
    },
    chooseColor: function (color) {
      // Affecte la couleur sélectionné
      this.selectedColor = color;

      if (this.selectedColumn < 4) {
        this.grille[this.selectedRow].data[this.selectedColumn] = this.selectedColor;
        this.selectedColumn++;

        if (this.grille[this.selectedRow].data[this.selectedColumn + 1] !== -1) {
          this.selectedColumn = -1;
        }

        if (this.grille[this.selectedRow].data[0] === -1) {
          this.selectedColumn = 0;
        } else if (this.grille[this.selectedRow].data[1] === -1) {
          this.selectedColumn = 1;
        } else if (this.grille[this.selectedRow].data[2] === -1) {
          this.selectedColumn = 2;
        } else if (this.grille[this.selectedRow].data[3] === -1) {
          this.selectedColumn = 3;
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

      if (this.selectedRow > 9) {
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

  #score {
    height: 60px;
  }

  #home-wrapper {
    margin: 0;
    padding: 0;

    #board {
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
