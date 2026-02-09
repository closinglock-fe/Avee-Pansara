import { ref, watch, type Ref } from 'vue';
import { getUsers } from '../services/userService';
import type { User } from '../types/DummyUserApi';

interface UseUsersOptions {
    pageSize: Ref<number>;
    currentPage: Ref<number>;
    searchQuery: Ref<string>;
    sortBy: Ref<string>;
    sortOrder: Ref<'asc' | 'desc'>;
}

export function useUsers({ pageSize, currentPage, searchQuery, sortBy, sortOrder }: UseUsersOptions) {
    const users = ref<User[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const totalRecords = ref(0);
    const totalPages = ref(0);

    const fetchUsers = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await getUsers(
                pageSize.value,
                (currentPage.value - 1) * pageSize.value,
                searchQuery.value,
                sortBy.value,
                sortOrder.value
            );

            users.value = response.users;
            totalRecords.value = response.total;
            totalPages.value = Math.ceil(response.total / pageSize.value);
        } catch (e) {
            error.value = 'Failed to load users. Please try again.';
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    };

    watch([currentPage, pageSize], () => {
        fetchUsers();
    });

    watch([sortBy, sortOrder], () => {
        currentPage.value = 1;
        fetchUsers();
    });

    let searchTimeout: ReturnType<typeof setTimeout>;
    watch(searchQuery, () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentPage.value = 1;
            fetchUsers();
        }, 300);
    });

    return {
        users,
        isLoading,
        error,
        totalRecords,
        totalPages,
        fetchUsers
    };
}
