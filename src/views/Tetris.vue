<template>
  <img :src="backgroundImage" alt="background" id="bg" @load="fadeIn" />
  <div
    class="background_loading"
    id="bgl"
    :style="{ background: averageColor }"></div>
  <nav>
    <router-link
      :to="$route.params.projectId && `/dashboard/${$route.params.projectId}`"
      >< Back
    </router-link>
  </nav>
  <div id="Tetris">
    <div
      id="playArea"
      :style="`
            --playAreaWidth: ${playAreaWidth}; 
            --playAreaHeight: ${playAreaHeight}`">
      <div
        v-for="(cell, cellIndex) in playAreaLinear"
        :key="cell ? cell.tetrominoIndex + `-` + cell.blockIndex : cellIndex"
        class="cell"
        :class="tetromino.type"
        :style="`--tetrominoColor: ${
          cell ? tetrominoTypes[cell.type].color : '#ffffff30'
        };   
                    --x: ${cellIndex % playAreaWidth}; 
                    --y: ${Math.floor(cellIndex / playAreaWidth)}; `">
        <!-- {{ cell ? cell.tetrominoIndex+`-`+cell.blockIndex  : cellIndex }} -->
      </div>

      <div
        id="tetromino"
        :key="tetromino.tetrominoIndex"
        :style="`
                --x: ${tetromino.x}; 
                --y: ${tetromino.y};
                --r: ${tetromino.r};
                `">
        <div
          v-for="(block, i) in tetromino.blocks"
          :key="tetromino.tetrominoIndex + `-` + i"
          class="block"
          :class="tetromino.type"
          :style="`
                        --x: ${tetrominoTypes[tetromino.type].offsets[i].x}; 
                        --y: ${tetrominoTypes[tetromino.type].offsets[i].y}; 
                        --tetrominoColor: ${
                          tetrominoTypes[tetromino.type].color
                        };`"></div>
      </div>
    </div>
    <div id="nextTetrominoDiv">
      {{ Math.round(points) }} - Next:
      <div id="nextTetromino">
        <div
          v-for="(block, i) in nextTetromino.blocks"
          :key="i"
          class="nextTetrominoBlock"
          :class="tetromino.type"
          :style="`
                        --playAreaHeight: ${block.y}; 
                        --playAreaWidth: ${block.x}; 
                        --x: ${
                          tetrominoTypes[nextTetromino.type].offsets[i].x
                        }; 
                        --y: ${
                          tetrominoTypes[nextTetromino.type].offsets[i].y
                        }; 
                        --tetrominoColor: ${
                          tetrominoTypes[nextTetromino.type].color
                        };`"></div>
      </div>
      <hr />
      <span id="question">{{ question }}</span>
      <div class="buttonContainer">
        <button :disabled="isMoving" @click="() => handleAnswer(0)">
          {{ answers[0].a }}
        </button>
        <button :disabled="isMoving" @click="() => handleAnswer(1)">
          {{ answers[1].a }}
        </button>
        <button :disabled="isMoving" @click="() => handleAnswer(2)">
          {{ answers[2].a }}
        </button>
        <button :disabled="isMoving" @click="() => handleAnswer(3)">
          {{ answers[3].a }}
        </button>
      </div>
    </div>
    <div>
      <div id="controls">
        <button style="grid-area: l" @click="left">&lt;</button>
        <button style="grid-area: d" @click="down">v</button>
        <button style="grid-area: r" @click="right">&gt;</button>
        <button style="grid-area: c" @click="clockwise">&#8635;</button>
        <button style="grid-area: cc" @click="counterclock">&#8634;</button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getAverageColor,
  getUsersBackground,
  setPoints,
  getPoints,
  getProject,
  getPlayArea,
  setPlayArea,
  updatePercentage,
  getPercentage,
} from '@/assets/js/firebase';
import { generate4AnswerQuestion } from '@/assets/js/openai';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      question: 'Loading...',
      answers: [
        { a: 'Loading...', correct: false },
        { a: 'Loading...', correct: false },
        { a: 'Loading...', correct: false },
        { a: 'Loading...', correct: false },
      ],
      generatedTetrominos: 0,
      points: 0,
      playAreaWidth: 10,
      playAreaHeight: 20,
      playArea: [],
      isMoving: true,
      tetrominoTypes: {
        I: {
          color: 'cyan',
          offsets: [
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
          ],
        },
        J: {
          color: 'blue',
          offsets: [
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 1 },
          ],
        },
        L: {
          color: 'orange',
          offsets: [
            { x: 0, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
          ],
        },
        O: {
          color: 'yellow',
          offsets: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
          ],
        },
        S: {
          color: 'green',
          offsets: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 1 },
          ],
        },
        T: {
          color: 'purple',
          offsets: [
            { x: 0, y: 0 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
          ],
        },
        Z: {
          color: 'red',
          offsets: [
            { x: 0, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
          ],
        },
      },
      tetromino: {
        tetrominoIndex: 0,
      },
      nextTetromino: {
        tetrominoIndex: 1,
      },
      averageColor: '#000000',
      projectId: this.$route.params.projectId,
    };
  },
  computed: {
    playAreaLinear() {
      return this.playArea.flat();
    },
    ...mapGetters(['user']),
  },
  async mounted() {
    this.initPlayArea();
    this.tetromino = this.newTetromino();
    this.nextTetromino = this.newTetromino();
    const _points = await getPoints(this.user.uid, this.projectId);
    if (_points !== null && _points !== undefined && !isNaN(_points)) {
      this.points = _points;
    }

    await this.createQuestions();

    // this.playArea = await getPlayArea(this.user.uid, this.projectId);
    this.averageColor = await getAverageColor(this.user.uid);
    document.getElementById('bgl').style.opacity = 1;
    if (!this.user || !this.user.uid) return;
    try {
      const url = await getUsersBackground(this.user.uid);
      this.backgroundImage = url || defaultBackground;
      document.getElementById('bg').style.opacity = 1;
    } catch (error) {
      console.error('Error fetching background image:', error);
      this.backgroundImage = defaultBackground;
    }

    window.addEventListener('keydown', this.handleKeydown);

    window.setInterval(() => {
      this.down();
    }, 321);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    async handleAnswer(id) {
      if (this.answers[id].correct) {
        this.points += 100;
        setPoints(this.user.uid, this.projectId, this.points).then(() => {
          console.log('Points set');
        });
        this.isMoving = true;
        this.createQuestions();
        const current = await getPercentage(this.user.uid, this.projectId);
        await updatePercentage(this.user.uid, this.projectId, current + 1);
      } else {
        this.points -= 50;
        alert('Incorrect');
        setPoints(this.user.uid, this.projectId, this.points).then(() => {
          console.log('Points set');
        });
      }
    },

    async createQuestions() {
      const project = await getProject(this.user.uid, this.projectId);
      console.log(project);
      const { question } = await generate4AnswerQuestion(
        project.fileData || 'No Data',
        project.documentType || 'unkown',
        project.title || 'Untitled',
        project.description || '',
        `Have this mood: ${
          project.AI_Theme || 'Be a helpful AI assistant'
        }, and this is what the user wrote: ${
          project.extraPrompt || '(no extra prompt)'
        }`,
      );

      console.log(question);

      this.question = question.q;
      this.answers = question.answers;
    },
    handleKeydown(event) {
      switch (event.key) {
        case 's':
        case 'ArrowDown':
          this.down();
          if (!this.isMoving) break;
          this.points += 0.25;
          setPoints(this.user.uid, this.projectId, this.points).then(() => {
            console.log('Points set');
          });
          break;
        case 'a':
        case 'ArrowLeft':
          this.left();
          break;
        case 'd':
        case 'ArrowRight':
          this.right();
          break;
        case 'w':
        case 'e':
        case 'ArrowUp':
          this.clockwise();
          break;
        case 'q':
        case 'Control':
          this.counterclock();
          break;
        case 'r':
        case 'tab':
          this.swapTetrominos();
          break;
      }
    },
    calculateRotationClockwise(block, center) {
      return {
        x: center.x - (block.y - center.y),
        y: center.y + (block.x - center.x),
      };
    },
    calculateRotationCouterclock(block, center) {
      return {
        x: center.x + (block.y - center.y),
        y: center.y - (block.x - center.x),
      };
    },
    down() {
      if (!this.isMoving) return;
      let collision = false;
      for (let block of this.tetromino.blocks) {
        if (block.y < 0) continue;
        if (
          this.playAreaHeight <= block.y + 1 ||
          this.playArea[block.y + 1][block.x] !== undefined
        ) {
          collision = true;
          break;
        }
      }
      if (collision) {
        this.place();
      } else {
        for (let block of this.tetromino.blocks) {
          block.y++;
        }
        this.tetromino.y++;
      }
    },
    left() {
      let collision = false;
      for (let block of this.tetromino.blocks) {
        if (block.y < 0 && block.x > 0) continue;
        if (block.x <= 0 || this.playArea[block.y][block.x - 1] !== undefined) {
          collision = true;
          break;
        }
      }
      if (!collision) {
        for (let block of this.tetromino.blocks) {
          block.x--;
        }
        this.tetromino.x--;
      }
    },
    right() {
      let collision = false;
      for (let block of this.tetromino.blocks) {
        if (block.y < 0 && block.x < this.playAreaWidth - 1) continue;
        if (
          block.x >= this.playAreaWidth - 1 ||
          this.playArea[block.y][block.x + 1] !== undefined
        ) {
          collision = true;
          break;
        }
      }
      if (!collision) {
        for (let block of this.tetromino.blocks) {
          block.x++;
        }
        this.tetromino.x++;
      }
    },
    clockwise() {
      if (this.tetromino.type === 'O') return;
      let potential = [];
      for (let i = 0; i < 4; i++) {
        potential.push(
          this.calculateRotationClockwise(this.tetromino.blocks[i], {
            x: this.tetromino.x,
            y: this.tetromino.y,
          }),
        );
        if (
          potential[i].x < 0 ||
          potential[i].x >= this.playAreaWidth ||
          potential[i].y >= this.playAreaHeight
        ) {
          return;
        }
        if (
          potential[i].y >= 0 &&
          this.playArea[potential[i].y][potential[i].x] !== undefined
        ) {
          return;
        }
      }
      for (let i = 0; i < 4; i++) {
        this.tetromino.blocks[i].x = potential[i].x;
        this.tetromino.blocks[i].y = potential[i].y;
      }
      this.tetromino.r++;
    },
    counterclock() {
      if (this.tetromino.type === 'O') return;
      let potential = [];
      for (let i = 0; i < 4; i++) {
        potential.push(
          this.calculateRotationCouterclock(this.tetromino.blocks[i], {
            x: this.tetromino.x,
            y: this.tetromino.y,
          }),
        );
        if (
          potential[i].x < 0 ||
          potential[i].x >= this.playAreaWidth ||
          potential[i].y >= this.playAreaHeight
        ) {
          return;
        }
        if (
          potential[i].y >= 0 &&
          this.playArea[potential[i].y][potential[i].x] !== undefined
        ) {
          return;
        }
      }
      for (let i = 0; i < 4; i++) {
        this.tetromino.blocks[i].x = potential[i].x;
        this.tetromino.blocks[i].y = potential[i].y;
      }
      this.tetromino.r--;
    },
    swapTetrominos() {
      let tempX = this.tetromino.x;
      let tempY = this.tetromino.y;
      let tempR = this.tetromino.r;

      let tempTetromino = this.tetromino;
      this.tetromino = this.nextTetromino;
      this.nextTetromino = tempTetromino;

      this.tetromino.x = tempX;
      this.tetromino.y = tempY;
      this.tetromino.r = tempR;

      this.tetromino.blocks = this.tetrominoTypes[
        this.tetromino.type
      ].offsets.map((offset) => {
        return {
          x: this.tetromino.x + offset.x,
          y: this.tetromino.y + offset.y,
        };
      });

      if (this.checkCollision(this.tetromino.blocks)) {
        this.tetromino.x = Math.max(
          0,
          Math.min(this.playAreaWidth - 1, this.tetromino.x),
        );
        this.tetromino.y = Math.max(0, this.tetromino.y - 1);
      }
    },
    checkCollision(blocks) {
      return blocks.some(
        (block) =>
          block.x < 0 ||
          block.x >= this.playAreaWidth ||
          block.y >= this.playAreaHeight ||
          (block.y >= 0 && this.playArea[block.y][block.x] !== undefined),
      );
    },
    place() {
      this.points += 10;
      console.log('t: ' + this.tetromino.type);
      console.log('n: ' + this.nextTetromino.type);
      for (let block of this.tetromino.blocks) {
        if (block.y < 0) {
          // alert('Game Over');
          this.restart();
          return;
        }
        this.playArea[block.y][block.x] = {
          tetrominoIndex: this.tetromino.tetrominoIndex,
          type: this.tetromino.type,
          blockIndex: block.blockIndex,
        };
      }
      this.tetromino = this.nextTetromino;
      this.nextTetromino = this.newTetromino();

      for (let i = this.playAreaHeight - 1; i >= 0; i--) {
        if (this.playArea[i].every((cell) => cell !== undefined)) {
          this.playArea.splice(i, 1);
          this.playArea.unshift(Array(this.playAreaWidth).fill(undefined));
          this.points += 85;
          i++;
        }
      }
      setPoints(this.user.uid, this.projectId, this.points).then(() => {
        console.log('Points set');
      });
      // setPlayArea(this.user.uid, this.projectId, this.playArea || []).then(
      //   () => {
      //     console.log('Play Area set');
      //   },
      // );
    },
    initPlayArea() {
      for (let i = 0; i < this.playAreaHeight; i++) {
        this.playArea.push([]);
        for (let j = 0; j < this.playAreaWidth; j++) {
          this.playArea[i].push(undefined);
        }
      }
    },
    newTetromino() {
      if (this.generatedTetrominos == 4) {
        this.isMoving = false;
        this.generatedTetrominos = 0;
      }

      this.generatedTetrominos++;
      let tetrominoTypes = Object.keys(this.tetrominoTypes);
      let randomType =
        tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
      let preparingTetromino = {};
      preparingTetromino.tetrominoIndex = this.tetromino.tetrominoIndex + 1;
      preparingTetromino.type = randomType;
      preparingTetromino.x = Math.floor(this.playAreaWidth / 2);
      preparingTetromino.y = -4;
      preparingTetromino.r = 0;
      preparingTetromino.blocks = this.tetrominoTypes[randomType].offsets.map(
        (offset) => {
          return {
            x: preparingTetromino.x + offset.x,
            y: preparingTetromino.y + offset.y,
          };
        },
      );
      for (let i = 0; i < preparingTetromino.blocks.length; i++) {
        preparingTetromino.blocks[i].blockIndex = i;
      }
      return preparingTetromino;
    },
    restart() {
      this.playArea = [];
      this.initPlayArea();
      this.tetromino = this.newTetromino();
      this.nextTetromino = this.newTetromino();
    },
  },
};
</script>
<style scoped>
nav > a {
  font-family: 'League Spartan', serif;
  font-size: 1.3rem;
  color: white;
  text-decoration: none;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-image: linear-gradient(to bottom, #00000081, #0000);
  color: white;
  width: 100%;
  position: fixed;
  height: 6rem;
}
.buttonContainer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  grid-template-rows: 1fr 1fr;
  width: 20rem;
  margin-left: 1rem;
}
.buttonContainer button {
  width: 10rem;
  font-size: 1rem;
  height: 2.75rem;
}
.buttonContainer button:disabled {
  background: #ffffff30;
  color: #ffffff30;
}
hr {
  all: unset;
  width: 100%;
  height: 2px;
  background: #fff3;
}
#bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s;
  transition-delay: 0.25s;
  /* filter: contrast(0.8); */
}
.background_loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s;
}
span {
  text-align: center;
}
#Tetris {
  --cellSize: 2.5rem;
  --gapSize: 0.0625rem;

  display: grid;
  grid-template-columns: auto 10rem;
  grid-template-areas: 'tetris nextTetromino' 'tetris controls';
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  margin-inline: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#playArea {
  grid-area: tetris;

  position: relative;

  width: calc(
    var(--playAreaWidth) * (var(--cellSize) + var(--gapSize)) + var(--gapSize)
  );
  height: calc(
    var(--playAreaHeight) * (var(--cellSize) + var(--gapSize)) + var(--gapSize)
  );

  padding: var(--gapSize);
  background-color: #ffffff30;
  backdrop-filter: blur(10px);

  max-width: 80vh;
  max-width: 80vh;
}
.cell,
.block,
.nextTetrominoBlock {
  background-color: var(--tetrominoColor, #ffffff30);
  /* background: radial-gradient(
      ellipse at top right,
      color-mix(in srgb, var(--tetrominoColor, #ffffff30), white 10%),
      transparent
    ),
    radial-gradient(
      ellipse at bottom left,
      color-mix(in srgb, var(--tetrominoColor, #ffffff30), white 5%),
      var(--tetrominoColor, #ffffff30) 50%
    );

  border: 0.125rem solid #222;
  border-radius: 0.125rem;
  border-color: color-mix(in srgb, var(--tetrominoColor, #ffffff30), white 4%)
    color-mix(in srgb, var(--tetrominoColor, #ffffff30), white 1%)
    color-mix(in srgb, var(--tetrominoColor, #ffffff30), white 4%)
    color-mix(in srgb, var(--tetrominoColor, #ffffff30), white 1%); */
  padding: 0.25rem;

  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  aspect-ratio: 1;

  width: var(--cellSize);
  height: var(--cellSize);

  overflow: hidden;
  text-overflow: clip;
}
.cell {
  /* box-shadow: 0.0625rem 0.0625rem 0.25rem var(--tetrominoColor, #ffffff30); */

  position: absolute;
  top: calc(var(--y) * (var(--cellSize) + var(--gapSize)) + var(--gapSize));
  left: calc(var(--x) * (var(--cellSize) + var(--gapSize)) + var(--gapSize));

  transition: all 0.125s;
}
#tetromino {
  position: absolute;
  top: calc(var(--y) * (var(--cellSize) + var(--gapSize)) + var(--gapSize));
  left: calc(var(--x) * (var(--cellSize) + var(--gapSize)) + var(--gapSize));
  transform: rotateZ(calc(var(--r) * 90deg));
  transform-origin: calc(var(--cellSize) / 2) calc(var(--cellSize) / 2);

  transition: 0.125s;
}
.block {
  position: absolute;
  top: calc(var(--y) * (var(--cellSize) + var(--gapSize)) + var(--gapSize));
  left: calc(var(--x) * (var(--cellSize) + var(--gapSize)) + var(--gapSize));

  transition: top 0.125s, left 0.125s;

  /* box-shadow: 0.0625rem 0.0625rem 0.25rem var(--tetrominoColor, #ffffff30); */
}
.nextTetrominoBlock {
  position: absolute;
  top: calc(var(--y) * (var(--cellSize) + var(--gapSize)) + var(--gapSize));
  left: calc(var(--x) * (var(--cellSize) + var(--gapSize)) + var(--gapSize));

  transition: top 0.125s, left 0.125s;

  /* box-shadow: 0.0625rem 0.0625rem 0.25rem var(--tetrominoColor, #ffffff30); */
}
#controls {
  grid-area: controls;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: 'cc . c' 'l d r';
  gap: 0.25rem;
  justify-content: center;
}
button {
  border: none;
  background-color: #ffffff30;
  color: #fff;
  border-radius: 0.25rem;
  padding: 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
  box-shadow: 7px 7px 20px 0px rgba(0, 0, 0, 0.25);
}
#nextTetrominoDiv {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 0.5rem;
  width: 20rem;
  /* margin-left: 10rem; */
}
#nextTetromino {
  position: relative;
  padding: 1rem;
  margin-bottom: 6rem;
  margin-top: 2rem;
}
</style>
