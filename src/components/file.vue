<template>
  <div class="notepad_item_file" ref="item_file_cont">
    <div class="file_icon">
      <i class="icon">
        <img :src="`../../static/file_types_icons/${type}.svg`">
      </i>
    </div>
    <div class="file_link">
      <div>{{ fileName }}</div>
      <div>
        <a :href="href" target="_blank">Открыть</a>
        <a :href="href" :data-filename="fileName" :data-stamp="stamp" download="download">Скачать</a>
      </div>
    </div>
    <div>
      <div class="file_loader" ref="loader"><span></span></div>
    </div>
  </div>
</template>
<script src="./file.ts" lang="ts"></script>
