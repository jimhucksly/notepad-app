<template>
  <div class="json_viewer">
    <div class="json_viewer_src">
      <editor
        v-model="content"
        @init="editorInit"
        lang="javascript"
        theme="twilight"
        width="100%"
        height="100%"
      />
    </div>
    <div class="json_viewer_res"></div>
    <div class="json_viewer_notice">
      Json parse successed!
    </div>
  </div>
</template>
<script src="./jsonViewer.ts" lang="ts"></script>
