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
}

/* Table Wrapper */
.table-wrapper {
    border: 1px solid black;
    border-radius: 4px;
    overflow: hidden;
}

.table-header {
    padding: 12px;
    display: grid;
    grid-template-columns: 1fr 1.5fr 2fr 2fr;
    background-color: #f4f4f4;
    font-weight: bold;
    border-bottom: 2px solid black;
}

.table-header > div:last-child {
    border-right: none;
}

.table-row {
    display: grid;
    grid-template-columns: 1fr 1.5fr 2fr 2fr;
    border-bottom: 1px solid black;
    align-items: center;
}

.table-row:nth-child(even) {
    background-color: rgb(127, 218, 239);
}

.table-row:hover {
    background-color: #f1f1f1;
}

.table-row:last-child {
    border-bottom: none;
}
.table-cell {
    display: flex;
    align-items: center;
    word-break: break-word;
}

.table-cell input {
    width: 100%;
    border-radius: 4px;
    font-size: 0.9em;
}

.table-cell input:focus {
    outline: none;
    border-color: #007bff;
}

.table-cell > div {
    margin-bottom: 4px;
}

.email-input {
    box-sizing: border-box;
    margin: 6px;
    height: 40px;
    width: 100%;
}
</style>