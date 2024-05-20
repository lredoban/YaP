<template>
  <div>
    <header class="flex items-start">
      <NuxtLink to="/" class="inline-block pt-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </NuxtLink>
      <div class="text-center flex-grow">
        <h1 class="text-2xl font-bold text-sky-950 capitalize">{{ pokemon.name }}</h1>
        <p class="text-sm text-gray-500 font-bold">{{ padNumber(pokemon.id) }}</p>
      </div>
    </header>
    <div class="mt-6">
      <PokemonCard :pokemon :showTitle="false" />
      <div class="flex space-x-4 mt-6 font-semibold overflow-x-scroll scrollbar-hide">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
          :class="[activeTab === tab ? 'text-sky-950 opacity-100' : 'opacity-45']" class="text-lg capitalize">
          {{ tab }}
        </button>
      </div>
      <div class="mt-6">
        <div v-if="activeTab === 'details'">
          <p>{{ pokemon.flavor_text }}</p><br>
          <p><strong>Height:</strong> {{ pokemon.height }}</p>
          <p><strong>Weight:</strong> {{ pokemon.weight }}</p>
          <p><strong>Base Experience:</strong> {{ pokemon.base_experience }}</p>
        </div>
        <div v-if="activeTab === 'sprites'">
          <ul class="grid grid-cols-4 gap-2">
            <li v-for="sprite in Object.values(pokemon.sprites).filter(s => typeof s === 'string')" :key="sprite">
              <img :src="sprite" :alt="Object.keys(pokemon.sprites).find(k => pokemon.sprites[k] === sprite)" class="">
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
  </div>
</template>

<script setup>
const { id } = useRoute().params
const { data: pokemon } = await useFetch('/api/pokemon/details', { query: { id } })
const tabs = ['details', 'abilities', 'sprites', 'stats' ]
const activeTab = ref(tabs[0])
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