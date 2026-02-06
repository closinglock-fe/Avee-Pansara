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
    <UserTable 
        :users="users"
        :is-loading="isLoading"
        :sort-by="sortBy"
        :sort-order="sortOrder"
        :page-size="pageSize"
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:sort-by="(val) => sortBy = val"
        @update:sort-order="(val) => sortOrder = val"
        @prev-page="prevPage"
        @next-page="nextPage"
        @change-page-size="changePageSize"
    />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import UserTable from './UserTable.vue';
import type { User } from '../types/DummyUserApi';
import { getUsers } from '../services/userService';
const users = ref<User[]>([]);
const pageSize =ref(30);
const totalPages =  ref(0);
const currentPage = ref(1);
const searchQuery = ref('');
const sortBy = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');
const isLoading = ref(false);
const isDark = ref(false);
let searchTimeout: ReturnType<typeof setTimeout>;

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
    console.log(newSize);
    pageSize.value = newSize;
    currentPage.value = 1;
}

async function fetchUsers() {
    isLoading.value = true;
    try {
        const response = await getUsers(pageSize.value, (currentPage.value - 1) * pageSize.value, searchQuery.value, sortBy.value, sortOrder.value);
        users.value = response.users.map((user: User) => {
            return {
                ...user,
                address : user.address,
            }
        });

        totalPages.value = Math.ceil(response.total / response.limit);
    } finally {
        isLoading.value = false;
    }
}

watch([currentPage, pageSize], () => {
    fetchUsers();
});

watch([sortBy, sortOrder], () => {
    currentPage.value = 1; 
    fetchUsers(); 
});

watch(searchQuery, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        fetchUsers();
    }, 300);
});  

onMounted(async () => {
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
    --bg-primary: #1e293b;
    --bg-secondary: #0f172a;
    --bg-header: #1e293b; 
    --bg-hover: #334155;
    --bg-body: #0f172a;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --border-color: #334155;
    --accent-color: #60a5fa;
    --input-bg: #1e293b;
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
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: var(--text-primary);
    height: 90vh;
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
</style>