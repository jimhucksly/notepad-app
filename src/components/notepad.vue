<template>
  <div id="notepad_cont" :class="{ 'is-error' : isError }">
    <div class="notepad_cont" ref="notepad_cont">
      <div class="notepad_item"
        v-if="!hasFilter || `${item.key}` in filter"
        v-for="(item, index) in json"
        :data-stamp="item.key"
        :key="item.key"
        ref="notepad_item"
        :class="{ unread: item.unread }">
        <div>
          <div class="notepad_item_date">{{ item.date }}</div>
        </div>
        <div class="notepad_item_content">
          <file
            v-if="item.file !== undefined"
            :item-key="item.key"
            :item-file="item.file">
          </file>
          <p v-html="item.message" v-else></p>
        </div>
        <controls
          :item-key="item.key"
          :collection="item.file ? ['remove'] : ['save', 'edit', 'remove']">
        </controls>
      </div>
    </div>
    <div class="notepad_textarea">
      <textarea placeholder="Сообщение" v-model="message" v-on:keydown.enter.ctrl="send"></textarea>
      <div class="notepad_btns">
        <label class="notepad_attachments">
          <input type="file" @change="onFileChange">
        </label>
        <button @click.prevent="send"></button>
      </div>
    </div>
  </div>
</template>
<script src="./notepad.ts" lang="ts"></script>
