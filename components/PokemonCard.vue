<template>
  <div ref="container" class="relative w-full rounded-2xl p-6 text-center shadow-lg" :class="{ 'py-14': !showTitle }">
    <ClientOnly>
      <img :src="sprite" :alt="pokemon.name + shiny && ' shiny'" class="mx-auto" @load="setBackgroundColor"
        crossorigin="anonymous">
    </ClientOnly>
    <template v-if="showTitle">
      <h2 class="text-lg font-bold mt-2 text-sky-950 capitalize">{{ pokemon.name }}</h2>
      <p class="text-sm mt-2 text-gray-500">{{ padNumber(pokemon.id) }}</p>
    </template>
    <div v-else class="absolute flex gap-x-2 bottom-0 right-0 mr-4 mb-4">
      <audio ref="cries" :src="pokemon.cries.latest" type="audio/ogg"></audio>
      <button @click="cries.play()">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
        </svg>
      </button>
      <button @click="shiny = !shiny" :class="[shiny && 'text-yellow-300']">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      </button>
    </div>
    <ul class="absolute bottom-0 left-0 flex gap-2" :class="[showTitle ? 'mb-3 ml-3' : 'mb-4 ml-4']">
      <li v-for="data in pokemon.types" :key="type">
          <img :src="`/types/${data.type.name}.svg`" :alt="data.type.name" class="opacity-80" :class="[showTitle ? 'h-3 w-3' : 'h-6 w-6']"/>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();
const container = ref(null)
const cries = ref(null)
const shiny = ref(false)

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

const sprite = computed(() => {
  return shiny.value ? pokemon.sprites.other["official-artwork"].front_shiny : pokemon.sprites.other["official-artwork"].front_default
})

const setBackgroundColor = (event) => {
  fac.getColorAsync(event.target).then(color => {
    container.value.style.backgroundColor = `rgba(${color.value.slice(0, 3)}, 0.5)`
  })
};

</script>
