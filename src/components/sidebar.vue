<template>
  <aside>
    <sidebar-switcher
      :legend="isPreferences ? 'Preferences' : ''"
      @onExpand="isSwitcherMenuExpanded = true"
      @onHide="isSwitcherMenuExpanded = false"
    />
    <projects
      ref="projects"
      class="projects"
      v-show="!isPreferences && isProjects"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
      @onEdit="(stamp) => {
        isProjectsArchivesInit = false
        projectEditedItemKey = stamp
      }"
      @onArchives="(v) => {
        projectEditedItemKey = ''
        isProjectsArchivesInit = v
      }"
    />
    <projectsEditor
      v-if="isProjectEditorVisibility"
      :item-stamp.sync="projectEditedItemKey"
    />
    <projectsArchives
      v-if="isProjectArchivesVisibility"
      :init="isProjectsArchivesInit"
    />
    <div
      class="markdown"
      v-show="!isPreferences && isMarkdown"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
      >
      <sidebar-tree :tree="mdTree" />
    </div>
    <json-viewer-btns
      class="json_viewer"
      v-show="!isPreferences && isJsonViewer"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <links-btns
      class="links"
      v-show="!isPreferences && isLinks"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
    <todo-btns
      class="todo"
      v-show="!isPreferences && isTodo"
      :style="{opacity: isSwitcherMenuExpanded ? 0.4 : 1}"
    />
  </aside>
</template>
<script src="./sidebar.ts" lang="ts"></script>
