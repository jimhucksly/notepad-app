<template>
  <div class="events">
    <div class="events__top">
      <div class="events__btns">
        <button class="btn btn-primary events__btn-left" @click="prev">
          <span></span>
        </button>
        <div class="events__header">{{ header }}</div>
        <button class="btn btn-primary events__btn-right" @click="next">
          <span></span>
        </button>
        <button class="btn btn-primary m-l-15" @click="today">Today</button>
      </div>
      <div class="events__search">
        <form>
          <input
            type="text"
            v-model="search"
            :readonly="bCalendarFormShow"
            >
          <div class="events__search-dropdown" v-if="itemsFiltered.length">
            <ul>
              <li
                v-for="item in itemsFiltered"
                :data-current="item.key"
                :class="{ 'not-clickable': item.key === 0 }"
                @click="itemSelected(item)"
              >
                {{ item.title }}
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
    <div class="events__calendar">
      <b-calendar
        ref="calendar"
        :options="bCalendarOptions"
        @setHeader="(v) => { header = v }"
        @save="save"
        @remove="remove"
        @formToggle="(v) => { bCalendarFormShow = v }"
      />
    </div>
  </div>
</template>
<script src="./events.ts" lang="ts"></script>
