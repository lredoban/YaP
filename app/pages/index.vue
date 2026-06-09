<template>
  <header class="flex items-start justify-between">
    <h1 class="text-5xl text-sky-950 font-bold">Pokédex</h1>
    <LangSwitch />
  </header>
  <div class="mt-4">
    <label for="search">{{ $t('home.description') }}</label>
    <div class="relative mt-4 rounded-xl shadow-sm">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon class="h-5 w-5"/>
      </div>
      <input type="search" name="search" id="search" v-model="searchQuery"
        class="block w-full rounded-xl border-0 py-1.5 pl-10 pr-2 bg-gray-100 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
        :placeholder="$t('home.placeholder')">
    </div>
    <ul class="mt-4 flex flex-wrap gap-1.5" :aria-label="$t('home.filterByType')">
      <li v-for="type in allTypes" :key="type">
        <button type="button" @click="toggleType(type)" :title="type" :aria-pressed="selectedType === type"
          class="block rounded-full p-1.5 ring-1 transition"
          :class="[selectedType === type ? 'bg-gray-100 ring-gray-600 opacity-100' : 'ring-transparent opacity-40 hover:opacity-75']">
          <img :src="`/types/${type}.svg`" :alt="type" class="h-4 w-4">
        </button>
      </li>
    </ul>
  </div>
  <ul class="grid grid-cols-2 gap-4 mx-auto mt-8 justify-center">
    <li v-for="(pokemon,i) in filteredPokemons" :key="pokemon.id">
      <NuxtLinkLocale :to="`/pokemon/${pokemon.id}`">
        <pokemon-card :pokemon="pokemon" :preloadImage="i < 16"></pokemon-card>
      </NuxtLinkLocale>
    </li>
  </ul>
</template>

<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const { locale } = useI18n();
const { data } = await useFetch(`/api/pokemon/${locale.value}/list`)
const searchQuery = ref('');

const allTypes = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']

const route = useRoute();
const router = useRouter();

const selectedType = computed(() => {
  return typeof route.query.type === 'string' && allTypes.includes(route.query.type) ? route.query.type : null;
});

const toggleType = (type) => {
  router.replace({ query: { ...route.query, type: selectedType.value === type ? undefined : type } });
};

const filteredPokemons = computed(() => {
  if (!data.value) return [];
  return data.value.filter(pokemon =>
    (pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      pokemon.id.toString().includes(searchQuery.value)) &&
    (!selectedType.value || pokemon.types.some(({ type }) => type.name === selectedType.value))
  );
});
</script>
