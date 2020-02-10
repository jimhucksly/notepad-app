<template>
  <div>
    <div class="projects_item"
      v-for="item in json"
      :key="item.key"
      :data-stamp="item.key"
      ref="projects_item"
      :class="{ lock: item.lock, active: filter[item.key] }"
      @click="triggerFilter($event, item.key)">
      <span class="projects_item_icon item_icon_lock"
        @click="triggerLock($event, item.key)">
        <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" width="50" height="70" viewBox="0 0 13.229166 18.520834" version="1.1" id="svg8">
          <g transform="translate(0,-278.47915)">
            <path
              style="fill:#FB404F;fill-opacity:1;stroke:none;stroke-width:2.78949332;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke markers fill"
              d="m 2.9493143,285.14038 c -1.0342167,0 -1.830276,0.3799 -1.8342214,1.41411 l -0.032373,8.48524 c -0.00394,1.03421 0.8323759,1.28392 1.8665924,1.28392 h 7.4160942 c 1.034216,0 1.867301,-0.34682 1.867301,-1.38103 v -8.45288 c 0,-1.03422 -0.833085,-1.34936 -1.867301,-1.34936 z m 3.6545843,2.51877 c 0.8940584,-1.1e-4 1.6188639,0.72469 1.6187522,1.61874 -6.888e-4,0.642 -0.380725,1.22292 -0.9687021,1.48068 l 0.5834873,2.98116 H 5.4574595 l 0.5225892,-2.96913 c -0.6019781,-0.25169 -0.9939635,-0.84023 -0.9941939,-1.49271 -1.117e-4,-0.89378 0.7242619,-1.61847 1.6180438,-1.61874 z" />
            <path
              style="fill:#FB004D;fill-opacity:1;stroke:none;stroke-width:2.38138294;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke markers fill"
              d="m 6.6072684,279.01518 c -2.2776928,0 -4.1111481,2.02112 -4.1111481,4.53194 v 2.86787 c 0.088466,-0.01 0.1777317,-0.0149 0.2685091,-0.0149 h 1.1851669 v -2.42601 c 0,-1.67388 1.124762,-3.3769 2.6432252,-3.3769 1.5184605,0 2.8380937,1.70302 2.8380937,3.3769 v 2.42601 h 1.2879468 v -2.85301 c 0,-2.51082 -1.8341008,-4.53194 -4.1117936,-4.53194 z" />
          </g>
        </svg>
        <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" width="65" height="75" viewBox="0 0 17.197916 18.520834" version="1.1">
          <g transform="translate(0,-277.15623)">
            <path
              style="fill:#ffe680;fill-opacity:1;stroke:none;stroke-width:2.78949332;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke markers fill"
              d="m 2.2501061,285.18763 c -1.0342167,0 -1.83027603,0.3799 -1.83422143,1.41411 l -0.032373,8.48524 c -0.00394,1.03421 0.83237593,1.28392 1.86659243,1.28392 h 7.4160936 c 1.0342163,0 1.8673013,-0.34682 1.8673013,-1.38103 v -8.45288 c 0,-1.03422 -0.833085,-1.34936 -1.8673013,-1.34936 z m 3.6545843,2.51877 c 0.8940584,-1.1e-4 1.6188639,0.72469 1.6187522,1.61874 -6.888e-4,0.642 -0.380725,1.22292 -0.9687021,1.48068 l 0.5834873,2.98116 H 4.7582513 l 0.5225892,-2.96913 c -0.6019781,-0.25169 -0.9939635,-0.84023 -0.9941939,-1.49271 -1.117e-4,-0.89378 0.7242619,-1.61847 1.6180438,-1.61874 z" />
            <path
              style="fill:#ffe680;fill-opacity:1;stroke:none;stroke-width:150.38801384;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke markers fill"
              d="m 12.694304,277.94832 c -2.290395,0.63706 -4.1340757,3.17099 -4.1340757,5.68181 v 2.86787 c 0.088964,-0.0347 0.1787231,-0.0646 0.2700064,-0.09 l 1.1917753,-0.33149 v -2.42601 c 0,-1.67388 1.131036,-3.69149 2.657968,-4.1162 1.526929,-0.4247 2.85392,0.90922 2.85392,2.5831 v 2.42601 l 1.29513,-0.36023 v -2.85301 c 0,-2.51082 -1.844331,-4.01895 -4.134724,-3.38189 z" />
          </g>
        </svg>
      </span>
      <label>{{ item.name || item.key }}</label>
      <input type="text" v-model="names[item.key]" @keydown.enter="triggerEdit($event, item.key)">
      <span class="projects_item_icon item_icon_edit" @click="triggerEdit($event, item.key)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" version="1.1">
          <g class="g1" style="fill: #FFE66A">
            <path style=" " d="M 20.09375 0.25 C 19.5 0.246094 18.917969 0.457031 18.46875 0.90625 L 17.46875 1.9375 L 24.0625 8.5625 L 25.0625 7.53125 C 25.964844 6.628906 25.972656 5.164063 25.0625 4.25 L 21.75 0.9375 C 21.292969 0.480469 20.6875 0.253906 20.09375 0.25 Z M 16.34375 2.84375 L 14.78125 4.34375 L 21.65625 11.21875 L 23.25 9.75 Z M 13.78125 5.4375 L 2.96875 16.15625 C 2.71875 16.285156 2.539063 16.511719 2.46875 16.78125 L 0.15625 24.625 C 0.0507813 24.96875 0.144531 25.347656 0.398438 25.601563 C 0.652344 25.855469 1.03125 25.949219 1.375 25.84375 L 9.21875 23.53125 C 9.582031 23.476563 9.882813 23.222656 10 22.875 L 20.65625 12.3125 L 19.1875 10.84375 L 8.25 21.8125 L 3.84375 23.09375 L 2.90625 22.15625 L 4.25 17.5625 L 15.09375 6.75 Z M 16.15625 7.84375 L 5.1875 18.84375 L 6.78125 19.1875 L 7 20.65625 L 18 9.6875 Z "/>
          </g>
        </svg>
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
          <g style="fill: #FFE66A">
            <path d="M26,0h-2v13H8V0H0v32h32V6L26,0z M28,30H4V16h24V30z"/>
            <rect x="6" y="18" width="20" height="2"/>
            <rect x="6" y="22" width="20" height="2"/>
            <rect x="6" y="26" width="20" height="2"/>
            <rect x="18" y="2" width="4" height="9"/>
          </g>
        </svg>
      </span>
    </div>
  </div>
</template>
<script src="./projects.ts" lang="ts"></script>
