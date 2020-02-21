<template>
  <div>
    <titlebar />
    <main>
      <sidebar v-if="isAuth && !loading" />
      <section>
        <loading v-if="loading" />
        <template v-else>
          <auth v-if="!isAuth" />
          <preferences v-else-if="isPreferences" />
          <notepad v-else-if="isProjects" />
          <markdown v-else-if="isMarkdown" />
          <events v-else-if="isEvents" />
          <json-viewer v-else-if="isJsonViewer" />
          <div v-else></div>
        </template>
        <error v-if="isError" />
      </section>
    </main>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
