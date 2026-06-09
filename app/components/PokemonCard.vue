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
      <div class="relative flex">
        <button @click="playCry" @mouseenter="!canPlayCry && showCryTooltip()" @mouseleave="hideCryTooltip"
          :class="{ 'opacity-40 cursor-not-allowed': !canPlayCry }" :aria-disabled="!canPlayCry">
          <SpeakerWaveIcon class="w-6 h-6" />
        </button>
        <span v-if="cryTooltipVisible" role="tooltip"
          class="absolute bottom-full right-0 mb-2 w-44 rounded-lg bg-sky-950 px-3 py-2 text-xs text-left font-medium text-white shadow-lg">
          {{ $t('offline.cry') }}
        </span>
      </div>
      <button @click="shiny = !shiny" :class="[shiny && 'text-yellow-300']">
        <SunIcon class="w-6 h-6" />
      </button>
    </div>
    <ul class="absolute bottom-0 left-0 flex gap-2" :class="[showTitle ? 'mb-3 ml-3' : 'mb-4 ml-4']">
      <li v-for="data in pokemon.types" :key="data.type.name">
        <NuxtLinkLocale v-if="!showTitle" :to="{ path: '/', query: { type: data.type.name } }">
          <img :src="`/types/${data.type.name}.svg`" :alt="data.type.name"
            class="h-6 w-6 opacity-80 hover:opacity-100" />
        </NuxtLinkLocale>
        <img v-else :src="`/types/${data.type.name}.svg`" :alt="data.type.name" class="h-3 w-3 opacity-80" />
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
const shiny = ref(false)

const { pokemon, showTitle } = defineProps({
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

// Cries are never downloaded ahead of time: they are fetched (and cached by
// the service worker) the first time they are played, so offline they are
// only available if already heard while online.
const online = useOnline()
const cryUrl = pokemon.cries?.latest
const cryCached = ref(false)
const cryTooltipVisible = ref(false)
const canPlayCry = computed(() => Boolean(cryUrl) && (online.value || cryCached.value))
let cryAudio = null
let cryTooltipTimeout = null

const showCryTooltip = () => {
  clearTimeout(cryTooltipTimeout)
  cryTooltipVisible.value = true
}
const hideCryTooltip = () => {
  clearTimeout(cryTooltipTimeout)
  cryTooltipVisible.value = false
}

const playCry = async () => {
  if (!canPlayCry.value) {
    showCryTooltip()
    clearTimeout(cryTooltipTimeout)
    cryTooltipTimeout = setTimeout(hideCryTooltip, 2500)
    return
  }
  try {
    if (!cryAudio) {
      const response = await fetch(cryUrl)
      const blob = await response.blob()
      cryAudio = new Audio(URL.createObjectURL(blob))
      cryCached.value = true
    }
    cryAudio.currentTime = 0
    cryAudio.play()
  } catch {
    cryAudio = null
  }
}

const setBackgroundColor = (target) => {
  fac.getColorAsync(target).then(color => {
    container.value.style.backgroundColor = `rgba(${color.value.slice(0, 3)}, 0.5)`
  })
};

const onImageLoaded = (event) => {
  setBackgroundColor(event.target);
}

onMounted(async () => {
  // If load event is not triggered
  if (image.value.$el.complete) setBackgroundColor(image.value.$el)
  if (!showTitle) {
    // Preload shinyImg for the shiny toggle (detail view only)
    const shinyImg = new Image();
    shinyImg.src = shinyImage;
    // Check whether the cry is already in the service worker cache
    if (cryUrl && 'caches' in window) {
      try {
        cryCached.value = Boolean(await caches.match(cryUrl))
      } catch { /* cache inspection is best-effort */ }
    }
  }
})
</script>
