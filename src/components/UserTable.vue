<template>
    <div class="table-wrapper">
        <div class="table-header">
            <div class="table-cell sortable" 
                 @click="handleSort('username')">
                Username 
                <span v-if="sortBy === 'username'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </div>
            <div class="table-cell sortable"
                 @click="handleSort('firstName')">
                Name
                <span v-if="sortBy === 'firstName'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </div>
            <div class="table-cell sortable"
                 @click="handleSort('email')">
                Email
                <span v-if="sortBy === 'email'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </div>
            <div class="table-cell sortable"
                 @click="handleSort('address.city')">
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
        <Pagination 
            :pageSize="pageSize" 
            :currentPage="currentPage" 
            :totalPages="totalPages"
            :totalRecords="totalRecords" 
            @prevPage="$emit('prevPage')" 
            @nextPage="$emit('nextPage')" 
            @changePageSize="(size) => $emit('changePageSize', size)" 
        />
    </div>
</template>

<script setup lang="ts">
import Pagination from './Pagination.vue';
import type { User } from '../types/DummyUserApi';

const props = defineProps<{
    users: User[];
    isLoading: boolean;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    pageSize: number;
    currentPage: number;
    totalPages: number;
    totalRecords: number;
}>();

const emit = defineEmits<{
    (e: 'update:sortBy', value: string): void;
    (e: 'update:sortOrder', value: 'asc' | 'desc'): void;
    (e: 'prevPage'): void;
    (e: 'nextPage'): void;
    (e: 'changePageSize', size: number): void;
}>();

function handleSort(column: string) {
    if (props.sortBy === column) {
        emit('update:sortOrder', props.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
        emit('update:sortBy', column);
        emit('update:sortOrder', 'asc');
    }
}
</script>

<style scoped>
.table-wrapper {
    background: var(--bg-primary);
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    border: 1px solid var(--border-color);
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
    color: var(--text-header);
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

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.custom-spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
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
</style>
