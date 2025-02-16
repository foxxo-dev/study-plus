<template>
  <div id="Tetris">
    <div
      id="playArea"
      :style="`--playAreaWidth: ${playAreaWidth}; --playAreaHeight: ${playAreaHeight}`">
      <template v-for="(row, rowIndex) in playArea" :key="rowIndex">
        <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="cell"
        :style="'background-color: ' + (cell ? tetrominoTypes[cell].color : '#444')">
        </div>
      </template>
      <div
        v-for="block in tetromino.blocks"
        :key="block.x + block.y"
        class="block"
        :style="`--playAreaHeight: ${block.y}; --playAreaWidth: ${block.x}; --x: ${block.x}; --y: ${block.y}; background-color: ${tetrominoTypes[tetromino.type].color}`">
      </div>
    </div>
  </div>
  <button @click="down">Down</button>
</template>
<script>
export default {
  data() {
    return {
      playAreaWidth: 10,
      playAreaHeight: 20,
      playArea: [],
      tetrominoTypes: {
        'I': {
          color: 'cyan',
          offsets: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
            { x: 0, y: 3 },
          ]
        },
        'J': {
          color: 'blue',
          offsets: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
          ]
        },
        'L': {
          color: 'orange',
          offsets: [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
            { x: 0, y: 2 },
          ]
        },
        'O': {
          color: 'yellow',
          offsets: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
          ]
        },
        'S': {
          color: 'green',
          offsets: [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 0, y: 2 },
          ]
        },
        'T': {
          color: 'purple',
          offsets: [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 2 },
          ]
        },
        'Z': {
          color: 'red',
          offsets: [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 1 },
            { x: 1, y: 2 },
          ]
        },
      },
      tetromino: {
        type: 'I',
        rotation: 0,
        x: 0,
        y: 0,
        blocks: [
          { x: 8, y: 8 },
          { x: 8, y: 9 },
          { x: 8, y: 10 },
          { x: 8, y: 11 },
        ],
      },
    };
  },
  mounted() {
    this.initPlayArea();
  },
  methods: {
    down() {
      this.tetromino.y++;
      let collision = false;
      for(let block of this.tetromino.blocks) {
        if( block.y < 0 ) continue;
        if(this.playAreaHeight <= block.y + 1 || this.playArea[block.y + 1][block.x] !== undefined) {
          collision = true;
          break;
        }
      }
      if(collision) {
        for(let block of this.tetromino.blocks) {
          this.playArea[block.y][block.x] = this.tetromino.type;
        }
        this.newTetromino();
      }
      else
      {
        for (let block of this.tetromino.blocks) {
          block.y++;
        }
    } 
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
      let tetrominoTypes = Object.keys(this.tetrominoTypes);
      let randomType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
      this.tetromino.type = randomType;
      this.tetromino.rotation = 0;
      this.tetromino.x = Math.floor(this.playAreaWidth / 2);
      this.tetromino.y = -4;
      this.tetromino.blocks = this.tetrominoTypes[randomType].offsets.map(offset => {
        return {
          x: this.tetromino.x + offset.x,
          y: this.tetromino.y + offset.y,
        };
      });
    }
  },
};
</script>
<style>
#Tetris {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#playArea {
  --cellSize: 3rem;
  --gapSize: 0.5rem;

  position: relative;

  display: grid;
  grid-template-columns: repeat(var(--playAreaWidth), var(--cellSize));
  grid-template-rows: repeat(var(--playAreaHeight), var(--cellSize));

  grid-gap: var(--gapSize);
  padding: var(--gapSize);
  background-color: #333;

  max-width: 80vh;
  max-width: 80vh;
}
.cell {
  background-color: #444;
  border: 1px solid #222;
  padding: 0.25rem;

  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  aspect-ratio: 1;
}
.block {
  position: absolute;
  top: calc(var(--y) * (var(--cellSize) + var(--gapSize)) + var(--gapSize));
  left: calc(var(--x) * (var(--cellSize) + var(--gapSize)) + var(--gapSize));

  background-color: red;
  border: 1px solid #222;
  padding: 0.25rem;

  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  aspect-ratio: 1;

  width: var(--cellSize);
  height: var(--cellSize);
}
</style>
