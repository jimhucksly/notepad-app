<template>
  <div
    class="switcher"
    :class="{
      'switcher--expanded': isExpand,
      'switcher--not-clickable': !!legend
    }"
  >
    <span class="switcher__legend" @click="toggle">
      {{ legendInternal }}
      <i class="switcher__legend_caret"></i>
    </span>
    <div class="switcher__menu">
      <ul>
        <li v-for="item in menu" :class="{ active: item.id === current }" @click="select(item.id)">{{ item.nameAlt }}</li>
      </ul>
    </div>
  </div>
</template>
<script src="./sidebarSwitcher.ts" lang="ts"></script>
