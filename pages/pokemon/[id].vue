<template>
  <div class="mx-auto p-4">
    <NuxtLink to="/">Bring me back Home</NuxtLink>
    <div>
      <h1 class="text-3xl font-bold mb-4 capitalize">{{ pokemon.name }}</h1>
      <img :src="pokemon.sprites.front_default" :alt="pokemon.name" class="mb-4">
      <div>
        <h2 class="text-2xl font-semibold mb-2">Details</h2>
        <p><strong>Height:</strong> {{ pokemon.height }}</p>
        <p><strong>Weight:</strong> {{ pokemon.weight }}</p>
        <p><strong>Base Experience:</strong> {{ pokemon.base_experience }}</p>
        <h2 class="text-2xl font-semibold mt-4 mb-2">Abilities</h2>
        <ul>
          <li v-for="ability in pokemon.abilities" :key="ability.ability.name">{{ ability.ability.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const { id } = useRoute().params
const { data: pokemon } = await useFetch('/api/pokemon/details', { query: { id } })
</script>
