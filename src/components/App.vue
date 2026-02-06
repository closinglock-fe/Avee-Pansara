<template>
    <div class="container">
    <div class="table-wrapper">
        <div class="table-header">
               <div class="table-cell">Username</div>
                <div class="table-cell">Name</div>
                <div class="table-cell">Email</div>
                <div class="table-cell">Address</div>
        </div>
        <div class="table-body">
            <div v-for="user in users" :key="user.id" class="table-row">
                <div class="table-cell">{{ user.username }}</div>
                <div class="table-cell">{{ user.firstName }} {{ user.lastName }}</div>
                <div class="table-cell">
                    <input class="email-input" type="text" v-model="user.email" readonly>
                </div>
                <div class="table-cell">
                    <div>{{ user.address.address }}</div>
                    <div>{{ user.address.city }}, {{ user.address.state }} {{ user.address.postalCode }}</div>
                </div>
            </div>
        </div>
    </div>
        <Pagination :pageSize="pageSize" :currentPage="currentPage" :totalPages="totalPages" @prevPage="prevPage" @nextPage="nextPage" @changePageSize="changePageSize" />
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

watch([currentPage, pageSize], async () => {
    const response = await getUsers(pageSize.value, currentPage.value);
    users.value = response.users.map((user: User) => {
        return {
            ...user,
            address : user.address,
        }
    });
    totalPages.value = Math.ceil(response.total / response.limit);
})  

onMounted(async () => {
    const response = await getUsers(pageSize.value, currentPage.value);
    users.value = response.users.map((user: User) => {
        return {
            ...user,
            address : user.address,
        }
    });
    totalPages.value = Math.ceil(response.total / response.limit);
})

</script>

<style scoped>
.container {
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #334155;
    height: 90vh;
    display: flex;
    flex-direction: column;
}

.table-wrapper {
    background: #ffffff;
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
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    color: #64748b;
    flex-shrink: 0;
}

.table-row {
    display: grid;
    grid-template-columns: 1fr 1.5fr 2fr 2fr;
    border-bottom: 1px solid #e2e8f0;
    background-color: #ffffff;
    transition: background-color 0.2s;
}

.table-row:hover {
    background-color: #f8fafc;
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
    border: 1px solid #e2e8f0; 
    background: #f8fafc;
    height: 40px;
    padding-left: 16px;
}

.table-cell input:focus {
    outline: none;
    border: 1px solid #007bff;
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
</style>