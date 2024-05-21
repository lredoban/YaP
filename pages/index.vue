<template>
  <h1 class="text-5xl text-sky-950 font-bold">Pokédex</h1>
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
  </div>
  <ul class="grid grid-cols-2 gap-4 mx-auto mt-8 justify-center">
    <li v-for="pokemon in filteredPokemons" :key="pokemon.id">
      <NuxtLinkLocale :to="`/pokemon/${pokemon.id}`">
        <pokemon-card :pokemon="pokemon"></pokemon-card>
      </NuxtLinkLocale>
    </li>
  </ul>
</template>

<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const { locale } = useI18n();
const { data } = await useFetch('/api/pokemon/list', {
  headers: {
    "accept-language": locale.value
  }
})
const searchQuery = ref('');

const filteredPokemons = computed(() => {
  if (!data.value) return [];
  return data.value.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    pokemon.id.toString().includes(searchQuery.value)
  );
});
</script>