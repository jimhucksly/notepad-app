<template>
  <div
    class="projects_archives"
    :class="{
      expanded: init
    }">
    <div class="projects_archives_title">Projects: Archives</div>
    <div class="projects_archives_inner">
      <ul>
        <li v-for="o in items">
          {{ o.name }}
          <small>Created at: {{ getDate(o.date) }}</small>
          <i
            class="icon icon-restore"
            @click="restore(o)"
            >
            <svg
              width="21px" height="18px"
              viewBox="0 0 21 18" version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              >
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-339.000000, -421.000000)">
                      <g transform="translate(100.000000, 100.000000)">
                          <g id="-Round-/-Action-/-restore" transform="translate(238.000000, 318.000000)">
                              <g>
                                  <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                                  <path d="M13.25,3 C8.16,2.86 3.99,6.94 3.99,12 L2.2,12 C1.75,12 1.53,12.54 1.85,12.85 L4.64,15.65 C4.84,15.85 5.15,15.85 5.35,15.65 L8.14,12.85 C8.46,12.54 8.23,12 7.79,12 L5.99,12 C5.99,8.1 9.17,4.95 13.09,5 C16.81,5.05 19.94,8.18 19.99,11.9 C20.04,15.81 16.89,19 12.99,19 C11.38,19 9.89,18.45 8.71,17.52 C8.31,17.21 7.75,17.24 7.39,17.6 C6.97,18.03 7,18.73 7.47,19.1 C8.99,20.29 10.91,21 12.99,21 C18.04,21 22.13,16.83 21.99,11.74 C21.86,7.05 17.94,3.13 13.25,3 Z M12.74,8 C12.33,8 11.99,8.34 11.99,8.75 L11.99,12.43 C11.99,12.78 12.18,13.11 12.48,13.29 L15.6,15.14 C15.96,15.35 16.42,15.23 16.63,14.88 C16.84,14.52 16.72,14.06 16.37,13.85 L13.49,12.14 L13.49,8.74 C13.49,8.34 13.16,8 12.74,8 Z" fill="#FFE680"></path>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
            </svg>
          </i>
          <i
            class="icon icon-remove"
            @click="remove(o)"
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1" viewBox="0 0 109 90"
              >
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
        </li>
      </ul>
    </div>
  </div>
</template>
<script src="./projectsArchives.ts" lang="ts"></script>
