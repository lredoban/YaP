<template>
  <div ref="container"
    class="relative w-full rounded-2xl p-6 text-center shadow-lg transition-colors duration-700 bg-gray-200"
    :class="{ 'py-14': !showTitle }">
    <NuxtImg ref="image" :src="sprite" :alt="pokemon.name + shiny && ' shiny'" @load="onImageLoaded"
      class="mx-auto aspect-square" width="256" height="256" crossorigin="anonymous" :preload="preloadImage"
      :loading="preloadImage ? 'eager' : 'lazy'" />
    <template v-if="showTitle">
      <h2 class="text-lg font-bold mt-2 text-sky-950 capitalize">{{ pokemon.name }}</h2>
      <p class="text-sm mt-2 text-gray-500">{{ padNumber(pokemon.id) }}</p>
    </template>
    <div v-else class="absolute flex gap-x-2 bottom-0 right-0 mr-4 mb-4">
      <audio ref="cries" :src="pokemon.cries.latest" type="audio/ogg"></audio>
      <button @click="cries.play()">
        <SpeakerWaveIcon class="w-6 h-6" />
      </button>
      <button @click="shiny = !shiny" :class="[shiny && 'text-yellow-300']">
        <SunIcon class="w-6 h-6" />
      </button>
    </div>
    <ul class="absolute bottom-0 left-0 flex gap-2" :class="[showTitle ? 'mb-3 ml-3' : 'mb-4 ml-4']">
      <li v-for="data in pokemon.types" :key="data.type.name">
        <img :src="`/types/${data.type.name}.svg`" :alt="data.type.name" class="opacity-80"
          :class="[showTitle ? 'h-3 w-3' : 'h-6 w-6']" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { SpeakerWaveIcon, SunIcon } from '@heroicons/vue/24/outline'
import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();
const container = ref(null)
const image = ref(null)
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
  },
  preloadImage: {
    type: Boolean,
    default: false
  }
});

const shinyImage = pokemon.sprites.other["official-artwork"].front_shiny
const sprite = computed(() => {
  return shiny.value ? shinyImage : pokemon.sprites.other["official-artwork"].front_default
})


const setBackgroundColor = (target) => {
  fac.getColorAsync(target).then(color => {
    container.value.style.backgroundColor = `rgba(${color.value.slice(0, 3)}, 0.5)`
  })
};

const onImageLoaded = (event) => {
  setBackgroundColor(event.target);
  // Preload shinyImg
  const shinyImg = new Image();
  shinyImg.src = shinyImage;
}

onMounted(() => {
  // If load event is not triggered
  if (image.value.$el.complete) setBackgroundColor(image.value.$el)
})
</script>
