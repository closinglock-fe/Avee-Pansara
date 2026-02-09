<template>
    <nav class="pagination-container" aria-label="Pagination Navigation">
        <div class="record-container">
            <label>Total Records:</label>
            <span class="record-value">{{ props.totalRecords }}</span>
        </div>
    <div class="pagesize-container">
        <label for="pagesize">Page Size:</label>
        <select id="pagesize" :value="pageSize" @change="emit('changePageSize', Number(($event.target as HTMLSelectElement).value))" class="pagesize-select" aria-label="Select page size">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
        </select>
    </div>
    <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1" aria-label="Go to previous page">Previous</button>
        <span aria-atomic="true" aria-live="polite">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages" aria-label="Go to next page">Next</button>
    </div>
    </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
}>();

const emit = defineEmits<{
    (e: 'prevPage'): void;
    (e: 'nextPage'): void;
    (e: 'changePageSize', size: number): void;
}>();



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
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.pagesize-container, .pagination {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.pagesize-select {
    padding: 6px 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 0.875rem;
    color: var(--text-primary);
    outline: none;
    cursor: pointer;
    transition: all 0.2s;
}

.pagesize-select:focus {
    border-color: var(--accent-color);
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

.record-container {
    display: flex;
    align-items: center;
    gap: 8px;
}

.record-value {
    font-weight: 500;
    color: var(--text-primary);
}
</style>
