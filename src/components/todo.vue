<template>
  <div class="todo_cont">
    <div
      v-for="item in items"
      :key="item.id"
      class="todo_item"
      :data-id="item.id"
      @mousedown="move($event, item.id)"
      >
      <div class="todo_item-header">
        {{ item.date }}
      </div>
      <div class="todo_item-content">
        <p>
          {{ item.text }}
        </p>
      </div>
    </div>
    <template v-if="isPopupShow">
      <div class="todo_popup_overlay"></div>
      <div class="todo_popup">
        <div class="todo_popup-header">{{ itemSelected.date }}</div>
        <div class="todo_popup-content">
          <textarea v-model="itemSelected.text" placeholder="New record" ref="textarea"></textarea>
        </div>
        <div class="todo_popup-footer">
          <button class="btn btn-danger" @click="remove">Remove</button>
          <div>
            <button class="btn btn-primary" @click="save">Save</button>
            <button class="btn btn-default m-l-15" @click="cancel">Cancel</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script src="./todo.ts" lang="ts"></script>
