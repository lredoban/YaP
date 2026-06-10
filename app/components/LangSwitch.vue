<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-lg font-semibold text-gray-900 hover:bg-gray-50">
        {{ currentLocale.flag }}
      </MenuButton>
    </div>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems
        class="absolute right-0 z-10 mt-2 text-center origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        :class="[online ? 'w-16' : 'w-40']">
        <div class="py-1">
          <MenuItem v-for="{ code, flag } in locales" :key="code" v-slot="{ active }"
            :disabled="!online && code !== locale">
            <NuxtLink v-if="online || code === locale" :to="switchLocalePath(code)" external
              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-2xl']">{{ flag }}
            </NuxtLink>
            <!-- Other languages are not cached offline, so switching is blocked -->
            <span v-else class="block px-4 py-2 text-2xl opacity-30 grayscale cursor-not-allowed">{{ flag }}</span>
          </MenuItem>
          <p v-if="!online" class="px-3 py-2 text-xs font-medium text-gray-500">{{ $t('offline.lang') }}</p>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const online = useOnline()

const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value)
})
</script>
