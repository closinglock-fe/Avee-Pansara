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
.pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 16px;
    gap: 16px;
}

.pagination button {
    padding: 8px 16px;
    border: 1px solid black;
    border-radius: 4px;
    cursor: pointer;
}

.pagination button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.pagination span {
    margin: 0 8px;
}
</style>
