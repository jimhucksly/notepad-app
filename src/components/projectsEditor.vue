<template>
  <div
    class="projects_editor"
    :class="{
      expanded: !!itemStamp
    }"
    >
    <div class="projects_editor_title">Projects: Item properties</div>
    <div class="projects_editor_inner">
      <div class="form-group">
        <div class="form-group-inner">
          <label>Name</label>
          <div>
            <form>
              <input type="text" v-model="name">
            </form>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="form-group-inner flex-between items-center">
          <label class="m-b-5">Protected</label>
          <b-checkbox v-model="isLock"
          />
        </div>
      </div>
      <div class="form-group" v-if="!isFile">
        <a href="" @click.prevent="archive">
          <i class="icon">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px" y="0px" viewBox="0 0 16 16"
              style="enable-background:new 0 0 16 16;"
              xml:space="preserve">
              <g style="fill: #FFE66A">
                <polygon points="12,12.5 2,12.5 2,5.5 4.25,5.5 6.75,3.5 0,3.5 0,14.5 14,14.5 14,8.9 12,10.5 	"/>
                <path d="M3.967,10.523c1.694-1.65,3.7-3.135,7.033-3.016V9.5l5-4l-5-4v1.977 C7.46,3.512,3.967,6.601,3.967,10.523z"/>
              </g>
            </svg>
          </i>
          <span>Archive</span>
        </a>
      </div>
      <div class="form-group">
        <a href="" class="--remove" @click.prevent="remove">
          <i class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 109 90">
              <g style="fill: #CF6A4C">
                <path class="g1" d="m 28.751953,28 c -2.77,0 -4.759393,2.681488 -4.458984,6.011719 l 4.417969,48.976562 C 29.011347,86.318512 31.483906,89 34.253906,89 h 8.994141 25.253906 8.996094 c 2.77,0 5.240606,-2.681488 5.541015,-6.011719 L 87.457031,34.011719 C 87.75744,30.681488 85.77,28 83,28 H 63 48.751953 Z"></path>
                <path class="g1" d="M 32.28125 12 C 27.139437 12 23 15.122 23 19 L 23 23 L 89 23 L 89 19 C 89 15.122 84.860563 12 79.71875 12 L 32.28125 12 z "></path>
                <path class="g1" d="m 43.673828,1.1777344 c -1.583028,0 -2.994336,1.1351774 -3.166016,2.5449218 L 39.5,12 H 72.5625 L 71.554688,3.7226562 C 71.383006,2.3129119 69.9717,1.1777344 68.388672,1.1777344 H 63.248047 48.814453 Z"></path>
              </g>
              <g style="fill: #252f2e">
                <g style="display:inline">
                <rect class="g2" width="11.203125" height="38.671875" x="50.552425" y="39.535961"></rect>
                <path class="g2" d="m 33.125,39.523438 3.38212,38.671874 H 45 V 39.523438 Z"></path>
                <path class="g2" d="m 78.553282,39.535961 -3.38212,38.671874 h -8.49288 V 39.535961 Z"></path>
                </g>
                <path class="g2" d="M 45.939453,6.4921875 45,12 H 53.792969 59 67.792969 L 66.853516,6.4921875 h -6.914063 -7.085937 z"></path>
              </g>
            </svg>
          </i>
          <span>Remove</span>
        </a>
      </div>
    </div>
    <div class="projects_editor_footer">
      <a href="" @click.prevent="hide">Cancel</a>
      <button
        class="btn btn-primary"
        @click="save"
        >
        Save
      </button>
    </div>
  </div>
</template>
<script src="./projectsEditor.ts" lang="ts"></script>