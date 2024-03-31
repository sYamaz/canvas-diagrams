<script setup lang="ts">
import { onMounted } from 'vue'
import { createDiagram } from '@sYamaz/canvas-diagrams';
defineProps<{ msg: string }>()

let select1: () => void
let select2: () => void

onMounted(() => {
  const div = document.getElementById("canvas-container")
  const canvas = document.createElement('canvas')

  canvas.style.background = 'white'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.width = 500
  canvas.height = 500
  const {useStroke, useRectangle} = createDiagram(canvas)
  select1 = useStroke
  select2 = useRectangle

  div?.appendChild(canvas)
})



</script>

<template>
  <button @click="select1">stroke</button>
  <button @click="select2">rectangle</button>
  <div id="canvas-container">
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
