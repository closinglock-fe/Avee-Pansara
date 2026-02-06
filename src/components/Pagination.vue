<template>
    <div class="pagination-container">
    <div class="pagesize-container">
        <label for="pagesize">Page Size:</label>
        <select id="pagesize" :value="pageSize" @change="emit('changePageSize', $event.target.value)">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
        </select>
    </div>
    <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    pageSize: {
        type: Number,
        required: true
    },  
    totalPages: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['prevPage', 'nextPage', 'changePageSize'])

const prevPage = () => {
    emit('prevPage')
}

const nextPage = () => {
    emit('nextPage')    
}

</script>

<style scoped>
.pagination-container {
    background-color: var(--bg-primary);
    border-top: 1px solid var(--border-color);
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    margin-top: auto;
}

.pagesize-container, .pagination {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.pagination button {
    padding: 6px 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--text-primary);
    transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
    background-color: var(--bg-hover);
    border-color: var(--accent-color);
}

.pagination button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: var(--bg-hover);
}

.pagination span {
    margin: 0 8px;
    font-weight: 500;
}
</style>
