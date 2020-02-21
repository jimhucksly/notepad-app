<template>
  <div class="notepad_item_btns">
    <button
      v-if="collection.includes('save')"
      v-show="editableItems.includes(itemKey)"
      @click.prevent="save($event, itemKey)"
      >
      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
        <g style="fill: #2766BA">
          <path d="M26,0h-2v13H8V0H0v32h32V6L26,0z M28,30H4V16h24V30z"/>
          <rect x="6" y="18" width="20" height="2"/>
          <rect x="6" y="22" width="20" height="2"/>
          <rect x="6" y="26" width="20" height="2"/>
          <rect x="18" y="2" width="4" height="9"/>
        </g>
      </svg>
    </button>
    <button
      v-if="collection.includes('edit')"
      v-show="!editableItems.includes(itemKey)"
      @click.prevent="edit($event, itemKey)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" version="1.1">
        <g class="g1" style="fill: #2766BA">
          <path style=" " d="M 20.09375 0.25 C 19.5 0.246094 18.917969 0.457031 18.46875 0.90625 L 17.46875 1.9375 L 24.0625 8.5625 L 25.0625 7.53125 C 25.964844 6.628906 25.972656 5.164063 25.0625 4.25 L 21.75 0.9375 C 21.292969 0.480469 20.6875 0.253906 20.09375 0.25 Z M 16.34375 2.84375 L 14.78125 4.34375 L 21.65625 11.21875 L 23.25 9.75 Z M 13.78125 5.4375 L 2.96875 16.15625 C 2.71875 16.285156 2.539063 16.511719 2.46875 16.78125 L 0.15625 24.625 C 0.0507813 24.96875 0.144531 25.347656 0.398438 25.601563 C 0.652344 25.855469 1.03125 25.949219 1.375 25.84375 L 9.21875 23.53125 C 9.582031 23.476563 9.882813 23.222656 10 22.875 L 20.65625 12.3125 L 19.1875 10.84375 L 8.25 21.8125 L 3.84375 23.09375 L 2.90625 22.15625 L 4.25 17.5625 L 15.09375 6.75 Z M 16.15625 7.84375 L 5.1875 18.84375 L 6.78125 19.1875 L 7 20.65625 L 18 9.6875 Z "/>
        </g>
      </svg>
    </button>
    <button
      v-if="collection.includes('remove')"
      @click.prevent="remove($event, itemKey)">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 109 90">
        <g style="fill: #FB004D">
          <path class="g1" d="m 28.751953,28 c -2.77,0 -4.759393,2.681488 -4.458984,6.011719 l 4.417969,48.976562 C 29.011347,86.318512 31.483906,89 34.253906,89 h 8.994141 25.253906 8.996094 c 2.77,0 5.240606,-2.681488 5.541015,-6.011719 L 87.457031,34.011719 C 87.75744,30.681488 85.77,28 83,28 H 63 48.751953 Z"></path>
          <path class="g1" d="M 32.28125 12 C 27.139437 12 23 15.122 23 19 L 23 23 L 89 23 L 89 19 C 89 15.122 84.860563 12 79.71875 12 L 32.28125 12 z "></path>
          <path class="g1" d="m 43.673828,1.1777344 c -1.583028,0 -2.994336,1.1351774 -3.166016,2.5449218 L 39.5,12 H 72.5625 L 71.554688,3.7226562 C 71.383006,2.3129119 69.9717,1.1777344 68.388672,1.1777344 H 63.248047 48.814453 Z"></path>
        </g>
        <g style="fill: #fff">
          <g style="display:inline">
          <rect class="g2" width="11.203125" height="38.671875" x="50.552425" y="39.535961"></rect>
          <path class="g2" d="m 33.125,39.523438 3.38212,38.671874 H 45 V 39.523438 Z"></path>
          <path class="g2" d="m 78.553282,39.535961 -3.38212,38.671874 h -8.49288 V 39.535961 Z"></path>
          </g>
          <path class="g2" d="M 45.939453,6.4921875 45,12 H 53.792969 59 67.792969 L 66.853516,6.4921875 h -6.914063 -7.085937 z"></path>
        </g>
      </svg>
    </button>
  </div>
</template>
<script src="./controls.ts" lang="ts"></script>
