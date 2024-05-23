<template>
  <div>
    <header class="flex items-start">
      <NuxtLinkLocale to="/" class="inline-block pt-2">
        <HomeIcon class="w-6 h-6" />
      </NuxtLinkLocale>
      <div class="text-center flex-grow">
        <h1 class="text-2xl font-bold text-sky-950 capitalize">{{ pokemon.name }}</h1>
        <p class="text-sm text-gray-500 font-bold">{{ padNumber(pokemon.id) }}</p>
      </div>
    </header>
    <div class="mt-6">
      <PokemonCard :pokemon :showTitle="false" preloadImage/>
      <div class="flex space-x-4 mt-6 font-semibold overflow-x-scroll scrollbar-hide">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
          :class="[activeTab === tab ? 'text-sky-950 opacity-100' : 'opacity-45']" class="text-lg capitalize">
          {{ $t('id.tabs.' + tab) }}
        </button>
      </div>
      <div class="mt-6">
        <div v-if="activeTab === 'details'">
          <p>{{ pokemon.flavor_text }}</p><br>
          <p><strong class="capitalize">{{ $t('id.details.height') }}:</strong> {{ pokemon.height }}</p>
          <p><strong class="capitalize">{{ $t('id.details.weight') }}:</strong> {{ pokemon.weight }}</p>
          <p><strong class="capitalize">{{ $t('id.details.baseExperience') }}:</strong> {{ pokemon.base_experience }}</p>
        </div>
        <div v-if="activeTab === 'sprites'">
          <ul class="grid grid-cols-4 gap-2">
            <li v-for="([key, sprite]) in sprites" :key="sprite">
              <img :src="sprite" :alt="key">
            </li>
          </ul>
        </div>
        <div v-if="activeTab === 'stats'">
          <ul>
            <li v-for="stat in pokemon.stats" :key="stat.stat.name"><strong class="capitalize">{{ stat.stat.name
                }}</strong>: {{
              stat.base_stat }}</li>
          </ul>
        </div>
        <div v-if="activeTab === 'abilities'">
          <ul>
            <li v-for="ability in pokemon.abilities" :key="ability.name"><strong class="capitalize">{{ ability.name
                }}</strong>: {{
              ability.description }}</li>
          </ul>
        </div>
      </div>
    </div>
    <footer class="w-full py-4 mt-6">
      <nav class="grid grid-cols-2">
        <NuxtLinkLocale v-if="id != 1" :to="`/pokemon/${id - 1}`" class="hover:underline flex items-center">
          <ChevronLeftIcon class="mr-1 h-5 w-5"/>{{ $t('id.previous') }}
        </NuxtLinkLocale>
        <NuxtLinkLocale v-if="id != maxPokemon" :to="`/pokemon/${id + 1}`" prefetch class="hover:underline flex items-center col-start-2 justify-end">
          {{ $t('id.next') }}<ChevronRightIcon class="ml-1 h-5 w-5"/>
        </NuxtLinkLocale>
      </nav>
    </footer>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon, HomeIcon } from '@heroicons/vue/24/outline'
const maxPokemon = useRuntimeConfig().public.maxPokemon;

const id = +useRoute().params.id
const { locale } = useI18n()
const { data: pokemon } = await useFetch('/api/pokemon/details', {
  query: { id }, headers: {
    "accept-language": locale
  }
})
const tabs = ['details', 'abilities', 'sprites', 'stats' ]
const activeTab = ref(tabs[0])

const sprites = computed(() => {
  const filteredAndSortedSprites = Object.entries(pokemon.value.sprites)
    .filter(([key, value]) => typeof value === 'string')
    .sort(([keyA], [keyB]) => {
      if (keyA.startsWith('f') && !keyB.startsWith('f')) return -1;
      if (!keyA.startsWith('f') && keyB.startsWith('f')) return 1;
      return 0;
    })
  return filteredAndSortedSprites;
})
</script>

<style scoped>
 .scrollbar-hide {
   -ms-overflow-style: none;  /* Internet Explorer 10+ */
   scrollbar-width: none;  /* Firefox */
 }
 .scrollbar-hide::-webkit-scrollbar {
   display: none;  /* Safari and Chrome */
 }
</style>