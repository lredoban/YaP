<template>
  <div ref="container" class="w-full rounded-2xl p-6 text-center shadow-lg" :class="{ 'py-14': !showTitle }">
    <ClientOnly>
      <img :src="pokemon.sprite" :alt="pokemon.name" class="mx-auto" @load="setBackgroundColor" crossorigin="anonymous">
    </ClientOnly>
    <template v-if="showTitle">
      <h2 class="text-lg font-bold mt-2 text-sky-950 capitalize">{{ pokemon.name }}</h2>
      <p class="text-sm mt-2 text-gray-500">{{ padNumber(pokemon.id) }}</p>
    </template>
  </div>
</template>

<script setup>
import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();
const container = ref(null)

const { pokemon } = defineProps({
  pokemon: {
    type: Object,
    required: true
  },
  showTitle: {
    type: Boolean,
    default: true
  }
});

const setBackgroundColor = (event) => {
  fac.getColorAsync(event.target).then(color => {
    container.value.style.backgroundColor = `rgba(${color.value.slice(0, 3)}, 0.5)`
  })
};

</script>
