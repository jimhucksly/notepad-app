<template>
  <div>
    <div class="projects_inner">
      <div class="projects_item"
        v-for="item in json"
        :key="item.key"
        :data-stamp="item.key"
        ref="projects_item"
        :class="{
          lock: item.lock,
          active: filter[item.key],
          checked: item.key === checked
        }"
        @click="toggleFilter($event, item.key)"
        >
        <div>
          <span class="projects_item_check">
            <label>
              <input type="checkbox" @change="toggleCheck" :data-stamp="item.key">
            </label>
          </span>
          <label>{{ item.name || item.key }}</label>
          <span class="projects_item_icon item_icon_lock">
            <svg
              xmlns:svg="http://www.w3.org/2000/svg"
              xmlns="http://www.w3.org/2000/svg"
              width="50" height="70"
              viewBox="0 0 13.229166 18.520834"
              version="1.1">
              <g transform="translate(0,-278.47915)">
                <path
                  style="fill:#FB404F;fill-opacity:1;stroke:none;stroke-width:2.78949332;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke markers fill"
                  d="m 2.9493143,285.14038 c -1.0342167,0 -1.830276,0.3799 -1.8342214,1.41411 l -0.032373,8.48524 c -0.00394,1.03421 0.8323759,1.28392 1.8665924,1.28392 h 7.4160942 c 1.034216,0 1.867301,-0.34682 1.867301,-1.38103 v -8.45288 c 0,-1.03422 -0.833085,-1.34936 -1.867301,-1.34936 z m 3.6545843,2.51877 c 0.8940584,-1.1e-4 1.6188639,0.72469 1.6187522,1.61874 -6.888e-4,0.642 -0.380725,1.22292 -0.9687021,1.48068 l 0.5834873,2.98116 H 5.4574595 l 0.5225892,-2.96913 c -0.6019781,-0.25169 -0.9939635,-0.84023 -0.9941939,-1.49271 -1.117e-4,-0.89378 0.7242619,-1.61847 1.6180438,-1.61874 z" />
                <path
                  style="fill:#FB004D;fill-opacity:1;stroke:none;stroke-width:2.38138294;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke markers fill"
                  d="m 6.6072684,279.01518 c -2.2776928,0 -4.1111481,2.02112 -4.1111481,4.53194 v 2.86787 c 0.088466,-0.01 0.1777317,-0.0149 0.2685091,-0.0149 h 1.1851669 v -2.42601 c 0,-1.67388 1.124762,-3.3769 2.6432252,-3.3769 1.5184605,0 2.8380937,1.70302 2.8380937,3.3769 v 2.42601 h 1.2879468 v -2.85301 c 0,-2.51082 -1.8341008,-4.53194 -4.1117936,-4.53194 z" />
              </g>
            </svg>
          </span>
        </div>
      </div>
    </div>
    <div
      class="projects_archive"
      :class="{
        active: isArchivesInit
      }"
      @click="toggleArchives"
      >
      Archives
    </div>
  </div>
</template>
<script src="./projects.ts" lang="ts"></script>
