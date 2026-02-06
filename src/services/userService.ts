


export async function getUsers(limit: number, skip: number, q?: string, sortBy?: string, order?: 'asc' | 'desc') {
    let url = `https://dummyjson.com/users`;
    const params = new URLSearchParams({
        limit: limit.toString(),
        skip: skip.toString()
    });

    if (q) {
        url += `/search`;
        params.append('q', q);
    }

    if (sortBy) {
        params.append('sortBy', sortBy);
        params.append('order', order || 'asc');
    }

    const response = await fetch(`${url}?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data;
}