<template>
  <header class="flex items-start justify-between">
    <h1 class="text-5xl text-sky-950 font-bold">Pokédex</h1>
    <LangSwitch />
  </header>
  <div class="mt-4">
    <label for="search">{{ $t('home.description') }}</label>
    <div class="mt-4 flex gap-2">
      <div class="relative flex-grow rounded-xl shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon class="h-5 w-5"/>
        </div>
        <input type="search" name="search" id="search" v-model="searchQuery"
          class="block w-full rounded-xl border-0 py-1.5 pl-10 pr-2 bg-gray-100 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          :placeholder="$t('home.placeholder')">
      </div>
      <button type="button" @click="toggleFilters" :aria-expanded="filtersOpen" :aria-label="$t('home.filterByType')"
        class="rounded-xl px-3 shadow-sm ring-1 ring-inset transition"
        :class="[filtersOpen ? 'bg-gray-100 ring-gray-600 text-sky-950' : 'bg-gray-100 ring-gray-100 text-gray-400 hover:text-gray-600']">
        <FunnelIcon class="h-5 w-5"/>
      </button>
    </div>
    <div v-if="filtersOpen" class="mt-4">
      <!-- Fixed height so the icons row doesn't shift when the selected
           type name appears or disappears -->
      <p class="flex items-baseline gap-1.5 h-5 text-xs font-medium uppercase tracking-wider text-gray-400">
        {{ $t('home.filterByType') }}
        <span v-if="selectedType" class="capitalize normal-case tracking-normal text-sm font-semibold text-sky-950">{{ typeName(selectedType) }}</span>
      </p>
      <ul class="mt-2 flex flex-wrap gap-1.5">
        <li v-for="type in allTypes" :key="type">
          <button type="button" @click="toggleType(type)" :title="typeName(type)" :aria-pressed="selectedType === type"
            class="block rounded-full p-1.5 ring-1 transition"
            :class="[selectedType === type ? 'bg-gray-100 ring-gray-600 opacity-100' : 'ring-transparent opacity-40 hover:opacity-75']">
            <!-- The type icons are white, brightness-0 turns them black so
                 they show up on the light background -->
            <img :src="`/types/${type}.svg`" :alt="typeName(type)" class="h-4 w-4 brightness-0">
          </button>
        </li>
      </ul>
    </div>
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
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/vue/24/outline'

const { locale } = useI18n();
const [{ data }, { data: typeNames }] = await Promise.all([
  useFetch(`/api/pokemon/${locale.value}/list.json`),
  useFetch(`/api/pokemon/${locale.value}/types.json`),
])
const searchQuery = ref('');

const allTypes = pokemonTypes
const typeName = (type) => typeNames.value?.[type] ?? type

const route = useRoute();
const router = useRouter();

const selectedType = computed(() => {
  return typeof route.query.type === 'string' && allTypes.includes(route.query.type) ? route.query.type : null;
});

// Open when landing with a type in the URL (e.g. coming from a Pokémon page)
const filtersOpen = ref(Boolean(selectedType.value));

const toggleFilters = () => {
  filtersOpen.value = !filtersOpen.value;
  // Closing the panel stops filtering
  if (!filtersOpen.value && selectedType.value) {
    router.replace({ query: { ...route.query, type: undefined } });
  }
};

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
