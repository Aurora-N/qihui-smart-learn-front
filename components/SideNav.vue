<template>
    <nav class="side-nav">
        <div v-for="(item, index) in items" :key="index" class="nav-item" :class="{ 'nav-header': item.level === 1 }">
            <div class="nav-item-content" :class="{ 'sub-item': item.level === 2 }">
                {{ item.text }}
            </div>
        </div>
    </nav>
</template>

<script setup>
defineProps({
    items: {
        type: Array,
        required: true
    }
})
</script>

<style scoped>
.side-nav {
    width: 260px;
    flex-shrink: 0;
    padding: 24px 0;
}

.nav-item {
    margin-bottom: 4px;
}

.nav-header {
    background: #f1f1f1;
    color: #0062b9;
    border-radius: 4px;
}

.nav-item-content {
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-item-content:hover:not(.active) {
    background: #f5f5f5;
}

.nav-item-content.active {
    background: #e5e5e5;
}

.sub-item {
    padding-left: 24px;
    font-size: 14px;
}
</style>