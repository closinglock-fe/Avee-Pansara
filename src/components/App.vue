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
                {{ isDark ? '☀️' : '🌙' }}
            </button>
        </div>
    </div>
    <div class="table-wrapper">
        <div class="table-header">
            <div class="table-cell sortable" @click="handleSort('username')">
                Username 
                <span v-if="sortBy === 'username'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </div>
            <div class="table-cell sortable" @click="handleSort('firstName')">
                Name
                <span v-if="sortBy === 'firstName'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </div>
            <div class="table-cell sortable" @click="handleSort('email')">
                Email
                <span v-if="sortBy === 'email'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </div>
            <div class="table-cell sortable" @click="handleSort('address.city')">
                Address
                <span v-if="sortBy === 'address.city'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </div>
        </div>
        <div class="table-body">
            <div v-if="isLoading" class="custom-spinner-container">
                <div class="custom-spinner"></div>
            </div>
            <template v-else>
                <div v-for="user in users" :key="user.id" class="table-row">
                    <div class="table-cell">{{ user.username }}</div>
                    <div class="table-cell">{{ user.firstName }} {{ user.lastName }}</div>
                    <div class="table-cell">
                        <input class="email-input" type="text" v-model="user.email" readonly>
                    </div>
                    <div class="table-cell">
                        <div class="address-container">
                            <div>{{ user.address.address }}</div>
                            <div>{{ user.address.city }}, {{ user.address.state }} {{ user.address.postalCode }}</div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <Pagination :pageSize="pageSize" :currentPage="currentPage" :totalPages="totalPages" @prevPage="prevPage" @nextPage="nextPage" @changePageSize="changePageSize" />
    </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Pagination from './Pagination.vue';
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

function handleSort(column: string) {
    if (sortBy.value === column) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortBy.value = column;
        sortOrder.value = 'asc';
    }
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

.table-wrapper {
    background: var(--bg-primary);
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.table-body {
    flex: 1;
    overflow-y: auto;
}

.table-header {
    display: grid;
    grid-template-columns: 1fr 1.5fr 2fr 2fr;
    background-color: var(--bg-header);
    border-bottom: 1px solid var(--border-color);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    color: var(--text-secondary);
    flex-shrink: 0;
}

.table-row {
    display: grid;
    grid-template-columns: 1fr 1.5fr 2fr 2fr;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--bg-primary);
    transition: background-color 0.2s;
}

.table-row:nth-child(even) {
    background-color: var(--bg-secondary);
}

.table-row:hover {
    background-color: var(--bg-hover);
}

.table-row:last-child {
    border-bottom: none;
}

.table-cell {
    display: flex;
    align-items: center;
    padding: 16px 24px;
    word-break: break-word;
    font-size: 0.875rem;
}

.table-cell input {
    width: 100%;
    border-radius: 4px;
    font-size: 0.875rem;
    border: 1px solid var(--border-color); 
    background: var(--bg-secondary);
    height: 40px;
    padding-left: 16px;
    color: var(--text-primary);
}

.table-cell input:focus {
    outline: none;
    border: 1px solid var(--accent-color);
}

.table-cell > div {
    margin-bottom: 2px;
}

.email-input {
    box-sizing: border-box;
    margin: 0;
    height: auto;
    width: 100%;
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

.sortable {
    cursor: pointer;
    user-select: none;
    display: flex; 
    gap: 6px;
}

.sortable:hover {
    background-color: var(--bg-hover);
}

.address-container {
    display: flex;
    flex-direction: column;
}

/* Spinner Styles */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.custom-spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%; /* Fill body */
    min-height: 200px;
}

.custom-spinner {
    animation: spin 1s linear infinite;
    border-radius: 50%;
    border: 3px solid var(--border-color);
    border-top-color: var(--accent-color);
    height: 32px;
    width: 32px;
}
.controls-right {
    display: flex;
    gap: 12px;
    align-items: center;
}

.theme-toggle {
    background: none;
    border: 1px solid var(--border-color);
    border-radius: 50%;
    height: 36px;
    width: 36px;
    cursor: pointer;
    font-size: 1.2rem;
    background-color: var(--input-bg);
}

.theme-toggle:hover {
    background-color: var(--bg-hover);
}
</style>