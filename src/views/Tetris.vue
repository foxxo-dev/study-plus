<template>
  <div id="playArea">
    <template v-for="(row, rowIndex) in playArea" :key="rowIndex">
        <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="cell" :class="{ active: cell === 1 }">
            {{ rowIndex }} - {{ cellIndex }}
        </div>
    </template>
  </div>
</template>
<script>

export default {
  data() {
    return {
      backgroundImage: bookBg,

      playAreaWidth: 10,
      playAreaHeight: 20,
      playArea: [],
    };
  },
  mounted() {
    this.initPlayArea();
  },
  methods: {
    initPlayArea() {
      for (let i = 0; i < this.playAreaHeight; i++) {
        this.playArea.push([]);
        for (let j = 0; j < this.playAreaWidth; j++) {
          this.playArea[i].push(0);
        }
      }
    },
  },
}
</script>
<style>

</style>