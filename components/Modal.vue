<template>
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <slot name="header">
            Default header
          </slot>
          <button @click="$emit('close')" class="modal-close">&times;</button>
        </header>
        <section class="modal-body">
          <slot name="body">
            Default body
          </slot>
        </section>
      </div>
    </div>
  </template>
  
  <script setup>
  defineEmits(['close']);
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    max-width: 90%;
    max-height: 90%;
  }
  
  .modal-header,
  .modal-body {
    padding: 15px;
    display: flex;
  }
  
  .modal-header {
    border-bottom: 1px solid #eeeeee;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-close {
    border: none;
    font-size: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }
  
  .modal-body {
    flex-direction: column;
  }
  </style>