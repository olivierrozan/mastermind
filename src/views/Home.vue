<template>
  <section id="home">
    <h1>Mastermind</h1>
    <div id="score">
      <h2 v-if="nbCorrect === 4">GAGNE</h2>
      <h2 v-if="currentLine > 9">PERDU</h2>
    </div>
      
    <b-row id="home-wrapper">
      <b-col id="board" cols="6">
        <div id="line" :class="`top-${currentLine + 1}`"></div>
        <b-table-simple id="board-table">
          <b-tbody>
            <b-tr class="board-row" :class="i" v-for="i in 10" :key="i">
              <b-td
                class="board-col"
              >
                {{ i }}
              </b-td>
              <b-td
                class="board-col"
                :class="`${i - 1}-${j - 1}`"
                v-for="j in 4"
                :key="j"
              >
              </b-td>
              <b-td
                class="board-col"
              >
                <!-- <span class="pion-1 mx-1"></span>
                <span class="pion-2 mx-1"></span>
                <span class="pion-3 mx-1"></span>
                <span class="pion-4 mx-1"></span> -->
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-col>
      <b-col id="menu" cols="6">
        <b-button-group vertical>
          <b-button class="my-1" variant="info">Nouvelle partie</b-button>
          <b-button class="my-1" variant="info">Vider la ligne</b-button>
          <b-button
            class="my-1"
            variant="info"
            @click="submitLine()"
            :disabled="!isPlaying"
            >Valider la ligne</b-button
          >
        </b-button-group>

        <b-table-simple id="pattern-table" class="mt-3" v-if="isPlaying">
          <b-tbody>
            <b-tr
              class="pattern-row"
              :class="i"
              v-for="(i, index) in colorsList"
              :key="index"
            >
              <b-td
                class="pattern-col"
                :class="j"
                v-for="j in 4"
                :key="j"
                @click="chooseColor(index, j)"
              ></b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
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
      currentLine: 0,
      grille: [],
      selectedX: 0,
      selectedY: 0,
      isPlaying: true,
      soluce: [],
      nbWrongPlace: 0,
      nbIncorrect: 0,
      nbCorrect: 0
    };
  },
  created: function () {
    this.init();
  },
  methods: {
    disableBtn: function () {
      // console.log(this.grille[this.currentLine][0]);
      return this.currentLine > 9 ||
        this.grille[this.currentLine][0] === -1 ||
        this.grille[this.currentLine][1] === -1 ||
        this.grille[this.currentLine][2] === -1 ||
        this.grille[this.currentLine][3] === -1;
    },
    init: function () {
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
    chooseColor: function (i, j) {
      this.selectedX = i;
      this.selectedY = j;
      const table = document.getElementById("board-table");
      const tr = table
        .getElementsByClassName("board-row")
        .item(this.currentLine);
      const td = tr.getElementsByClassName("board-col").item(this.selectedY);
      td.style.backgroundColor = this.colorsList[this.selectedX];
      this.grille[this.currentLine][this.selectedY] = this.selectedX;
      // console.log(this.soluce, this.grille[this.currentLine]);
    },
    submitLine: function () {
      // console.log('soluce', this.soluce);
      // console.log('proposition', this.grille[this.currentLine]);
      this.checkSoluce();
      this.currentLine++;

      if (this.currentLine > 9) {
        this.isPlaying = false;
      }
    },
    checkSoluce: function () {
      this.nbCorrect = 0;
      this.nbWrongPlace = 0;
      this.nbIncorrect = 0;
      const table = document.getElementById("board-table");
      const tr = table
        .getElementsByClassName("board-row")
        .item(this.currentLine);      

      for (var i = 0; i < 4; ++i) {
        if (this.grille[this.currentLine][i + 1] === this.soluce[i]) {
          this.nbCorrect++;
        } else if (this.soluce.indexOf(this.grille[this.currentLine][i + 1]) >= 0) {
          this.nbWrongPlace++;
        } else {
          this.nbIncorrect++;
        }
      }

      const td = tr.getElementsByClassName("board-col").item(5);
      for (var j = 0; j < this.nbWrongPlace; ++j) {
        td.innerHTML += '<span class="pion mx-1 red"></span>';
      }

      for (var k = 0; k < this.nbIncorrect; ++k) {
        td.innerHTML += '<span class="pion mx-1 black"></span>';
      }

      for (var l = 0; l < this.nbCorrect; ++l) {
        td.innerHTML += '<span class="pion mx-1 green"></span>';
      }

      if (this.nbCorrect === 4) {
        this.isPlaying = false;
      }

      // return { wrong: nbWrongPlace, incorrect: nbIncorrect };
    },
  },
};
</script>

<style lang="scss">
#home {
  h1 {
    background: burlywood;
  }

  #score {
    height: 40px;
  }

  #home-wrapper {
    margin: 0;
    padding: 0;

    .red {
      background: red;
      height: 100%;
    }
    .blue {
      background: blue;
      height: 100%;
    }
    .green {
      background: green;
      height: 100%;
    }
    .orange {
      background: orange;
      height: 100%;
    }

    #board {
      #line {
        width: 20px;
        height: 20px;
        background: #000;
        position: relative;
        left: 150px;
      }

      .top-1 {
        top: 35px;
      }
      .top-2 {
        top: 85px;
      }
      .top-3 {
        top: 135px;
      }
      .top-4 {
        top: 185px;
      }
      .top-5 {
        top: 235px;
      }
      .top-6 {
        top: 285px;
      }
      .top-7 {
        top: 335px;
      }
      .top-8 {
        top: 385px;
      }
      .top-9 {
        top: 435px;
      }
      .top-10,
      .top-11 {
        top: 485px;
      }

      #board-table {
        margin: auto;
        width: 40%;
        background: antiquewhite;

        .pion {
          width: 10px;
          height: 10px;
          display: inline-block;
        }

        .red {
           background: red;
        }

        .black {
           background: black;
        }

        .board-col {
          padding: 0;
          width: 50px;
          height: 50px;
          border: 1px solid #000;
        }
      }
    }

    #pattern-table {
      margin: auto;
      width: 20%;

      .pattern-col {
        padding: 0;
        width: 25px;
        height: 25px;
        border: 1px solid #000;
      }
    }
  }
}
</style>
