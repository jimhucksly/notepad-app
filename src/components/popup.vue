<template>
  <div class="popup" v-show="showPopup">
    <div class="popup-about" v-if="aboutPopupShow">
      <popup-title>
        <close-btn @click="$popup.close('about')"></close-btn>
      </popup-title>
      <div class="m-b-20">
        <img src="../../static/icon.svg" alt="">
      </div>
      <div class="m-b-5">
        <p>{{ appName }}</p>
      </div>
      <div class="m-b-5">
        <p><small>v1.0.0</small></p>
      </div>
      <div>
        <p><small>&copy; Jimhucksly-Studio, {{ new Date().getFullYear() }}</small></p>
      </div>
    </div>
    <div class="popup-uploading" v-if="uploadingPopupShow">
      <popup-title>
        <close-btn @click="$popup.close('uploading')"></close-btn>
      </popup-title>
      <div class="uploading-label">
        Uploading file...
      </div>
      <div class="uploading-progress">
        <span></span>
      </div>
    </div>
  </div>
</template>
<script src="./popup.ts" lang="ts"></script>
