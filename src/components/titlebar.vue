<template>
  <div class="title-bar">
    <div class="menu-button-container">
      <button id="menu-button" class="menu-button">
        <i></i>
        <i></i>
        <i></i>
        </button>
    </div>
    <div class="reload-button-container" v-if="isAuth && !preferencesShow">
      <button id="reload-button" class="reload-button" @click.prevent="reload">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" viewBox="0 0 20 20" xml:space="preserve" width="20" height="20">
            <g transform="matrix(0.48123344,0,0,0.48123344,34.034306,202.59676)">
              <path d="m -50.1,-380.1 c -10.9,0 -19.9,-8.9 -19.9,-19.9 0,-11 8.9,-19.9 19.9,-19.9 8.3,0 15.4,5.2 18.3,13.3 l -2.7,1 c -2.5,-7 -8.5,-11.4 -15.6,-11.4 -9.4,0 -17,7.6 -17,17 0,9.4 7.6,17 17,17 6.6,0 12.7,-3.9 15.5,-9.9 l 2.6,1.2 c -3.2,7.1 -10.3,11.6 -18.1,11.6"/>
              <polyline points="-42.4,-404.6 -42.4,-407.7 -33.1,-407.7 -33.1,-416.9 -30,-416.9 -30,-404.6 -42.4,-404.6"/>
            </g>
          </svg>
        </span>
      </button>
    </div>
    <div class="app-name-container">
      <span class="titlebar-logo">
        <img src="../../static/icon.svg" alt="">
      </span>
      <p>{{ title }}</p>
    </div>
    <div class="window-controls-container">
      <button id="minimize-button" class="minimize-button"></button>
      <button id="min-max-button" class="min-max-button"></button>
      <button id="close-button" class="close-button"></button>
    </div>
  </div>
</template>
<script src="./titlebar.ts" lang="ts"></script>
