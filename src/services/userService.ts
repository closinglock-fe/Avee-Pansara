


export async function getUsers(limit: number, skip: number) {
    const response = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data;
}