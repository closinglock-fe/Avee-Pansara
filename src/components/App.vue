<template>
    <div class="container">
    <div class="header-controls">
        <h2 class="table-title">Users Table</h2>
        <div class="controls-right">
            <input 
                type="text" 
                placeholder="Search users..." 
                v-model="searchQuery" 
                class="search-input"
            />
            <button @click="toggleTheme" class="theme-toggle">
                {{ isDark ? '&#9788;' : '&#9789;' }}
            </button>
        </div>
    </div>
    <div v-if="error" class="error-message">
        {{ error }}
        <button @click="fetchUsers">Retry</button>
    </div>
    <UserTable 
        :users="users"
        :is-loading="isLoading"
        :sort-by="sortBy"
        :sort-order="sortOrder"
        :page-size="pageSize"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-records="totalRecords"
        @update:sort-by="(val) => sortBy = val"
        @update:sort-order="(val) => sortOrder = val"
        @prev-page="prevPage"
        @next-page="nextPage"
        @change-page-size="changePageSize"
    />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import UserTable from './UserTable.vue';
import { useUsers } from '../composables/useUsers';

const pageSize = ref(30);
const currentPage = ref(1);
const searchQuery = ref('');
const sortBy = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');
const isDark = ref(false);

const { 
    users, 
    isLoading, 
    error, 
    totalRecords, 
    totalPages, 
    fetchUsers 
} = useUsers({
    pageSize,
    currentPage,
    searchQuery,
    sortBy,
    sortOrder
});

function toggleTheme() {
    isDark.value = !isDark.value;
    if (isDark.value) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
}

function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
}

function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
}

function changePageSize(newSize: number) {
    pageSize.value = Number(newSize);
    currentPage.value = 1;
}

onMounted(() => {
   const savedTheme = localStorage.getItem('theme');
   if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
       isDark.value = true;
       document.body.classList.add('dark');
   }
   fetchUsers();
})
</script>

<style>
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-header: #f1f5f9; 
    --bg-hover: #f1f5f9;
    --bg-body: #f8fafc; 
    --text-primary: #334155;
    --text-secondary: #64748b;
    --border-color: #e2e8f0;
    --accent-color: #3b82f6;
    --input-bg: #ffffff;
}

body.dark {
    --bg-primary: #000000;
    --bg-secondary: #1e19199a;
    --bg-header: #1a1a1a; 
    --bg-hover: #1f1f1f;
    --bg-body: #000000;
    --text-primary: #e0e0e0;
    --text-secondary: #9ca3af;
    --border-color: #333333;
    --accent-color: #60a5fa;
    --input-bg: #1a1a1a;
}

body {
    margin: 0;
    overflow: hidden;
    background-color: var(--bg-body);
    color: var(--text-primary);
}

* {
    box-sizing: border-box;
}
</style>

<style scoped>
.container {
    padding: 40px 100px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: var(--text-primary);
    height: 95vh;
    display: flex;
    gap: 16px;
    flex-direction: column;
}

.controls-right {
    display: flex;
    gap: 12px;
    align-items: center;
}

.header-controls {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.table-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
}

.search-input {
    width: 300px; /* Fixed width for search input */
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.2s;
    background-color: var(--input-bg);
    color: var(--text-primary);
}

.search-input:focus {
    border-color: var(--accent-color);
}

.theme-toggle {
    background: none;
    border: 1px solid var(--border-color);
    border-radius: 50%;
    height: 36px;
    width: 36px;
    cursor: pointer;
    font-size: 1.2rem;
    color: var(--text-primary);
    background-color: var(--input-bg);
}

.theme-toggle:hover {
    background-color: var(--bg-hover);
}

.error-message {
    background-color: #fee2e2;
    color: #ef4444;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.error-message button {
    background: transparent;
    border: 1px solid #ef4444;
    color: #ef4444;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
}

.error-message button:hover {
    background: #ef4444;
    color: white;
}
</style>