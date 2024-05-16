<template>
  <h1 class="text-2xl">Pokédex</h1>
  <p>Search for a Pokémon by name or using its National Pokédex number.</p>
  <div><label for="search" class="hidden">search</label>
    <div class="relative mt-2 rounded-md shadow-sm">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><svg
          class="pointer-events-none h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clip-rule="evenodd"></path>
        </svg></div>
      <input type="search" name="search" id="search" v-model="searchQuery"
        class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Name or Number">
    </div>
  </div>
  <ul class="grid grid-cols-2 gap-4 mx-auto justify-center">
    <li v-for="pokemon in filteredPokemons" :key="pokemon.id">
      <NuxtLink :to="`/pokemon/${pokemon.id}`">
        <pokemon-card :pokemon="pokemon"></pokemon-card>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/pokemon/list')
const searchQuery = ref('');

const filteredPokemons = computed(() => {
  if (!data.value) return [];
  return data.value.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    pokemon.id.toString().includes(searchQuery.value)
  );
});
</script>