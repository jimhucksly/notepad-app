<template>
  <ul
    v-if="tree && tree.length"
    :style="level > 1 ? 'display: none;' : false"
    >
    <li
      v-for="(item, index) in tree"
      v-if="item.name.trim() && item.slug.trim()"
      :key="item.id"
      :class="`level-${level}`"
      >
      <span
        :title="item.name"
        :ref="item.id"
        :class="{
          'tree_item_plus': item.children && item.children.length,
          'tree_item_minus tree_item_empty' : (!item.children || !item.children.length) && level === 1,
          'tree_item_node': (!item.children || !item.children.length) && level > 1,
          'tree_item_node--last': index === tree.length - 1
        }"
        @click="selectNode(item)"
        >
        {{ item.name }}
      </span>
      <template v-if="item.children && item.children.length">
        <sidebar-tree :tree="item.children" :level="level + 1" />
      </template>
    </li>
  </ul>
  <div v-else></div>
</template>
<script src="./sidebarTree.ts" lang="ts"></script>
