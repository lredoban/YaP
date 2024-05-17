<template>
  <div class="mx-auto p-4 max-w-md">
    <header class="p-4 flex items-start">
      <NuxtLink to="/" class="inline-block">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </NuxtLink>
      <div class="text-center flex-grow">
        <h1 class="text-3xl font-bold text-gray-800 capitalize">{{ pokemon.name }}</h1>
        <p class="text-sm text-gray-500">{{ padNumber(pokemon.id) }}</p>
      </div>
    </header>
    <div>
      <PokemonCard :pokemon :showTitle="false" />
      <div class="flex justify-center space-x-4 mt-4">
        <button @click="activeTab = 'details'"
          :class="{ 'text-blue-500 border-b-2 border-blue-500': activeTab === 'details' }" class="pb-2">Detail</button>
        <button @click="activeTab = 'types'"
          :class="{ 'text-blue-500 border-b-2 border-blue-500': activeTab === 'types' }" class="pb-2">Types</button>
        <button @click="activeTab = 'stats'"
          :class="{ 'text-blue-500 border-b-2 border-blue-500': activeTab === 'stats' }" class="pb-2">Stats</button>
        <button @click="activeTab = 'abilities'"
          :class="{ 'text-blue-500 border-b-2 border-blue-500': activeTab === 'weaknesses' }"
          class="pb-2">Abilities</button>
      </div>
      <div class="text-left">
        <div v-if="activeTab === 'details'">
          <h2 class="text-2xl font-semibold mb-2">Details</h2>
          <p><strong>Height:</strong> {{ pokemon.height }}</p>
          <p><strong>Weight:</strong> {{ pokemon.weight }}</p>
          <p><strong>Base Experience:</strong> {{ pokemon.base_experience }}</p>
        </div>
        <div v-if="activeTab === 'types'">
          <h2 class="text-2xl font-semibold mb-2">Types</h2>
          <ul>
            <li v-for="type in pokemon.types" :key="type.type.name">{{ type.type.name }}</li>
          </ul>
        </div>
        <div v-if="activeTab === 'stats'">
          <h2 class="text-2xl font-semibold mb-2">Stats</h2>
          <ul>
            <li v-for="stat in pokemon.stats" :key="stat.stat.name"><strong>{{ stat.stat.name }}</strong>: {{
              stat.base_stat }}</li>
          </ul>
        </div>
        <div v-if="activeTab === 'abilities'">
          <h2 class="text-2xl font-semibold mb-2">Abilities</h2>
          <ul>
            <li v-for="ability in pokemon.abilities" :key="ability.name"><strong>{{ ability.name }}</strong>: {{
              ability.description }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { id } = useRoute().params
const { data: pokemon } = await useFetch('/api/pokemon/details', { query: { id } })
const activeTab = ref('details')
</script>
