import type {SortAndMarked, UserResource, UsersFilter} from "./types";

class Api {
    BASE_URL: string = `${import.meta.env.VITE_API_URL}/api/v1`;
    constructor() {
        if (!import.meta.env.VITE_API_URL) {
            throw new Error("VITE_API_URL is not defined in environment variables");
        }
    }
    async getUsers(filter: UsersFilter) {
        return this.request<UserResource>(`${this.BASE_URL}/users`,{
            method:"POST",
            body:JSON.stringify(filter),
        })
    }

    async getSortsAndMarked() {
        return this.request<SortAndMarked>(`${this.BASE_URL}/users/sorts`);
    }
    async markUsers(users:number[]){
        return this.request<Record<string, string>>(`${this.BASE_URL}/users/mark`,{
            method:"POST",
            body:JSON.stringify({users})
        });
    }

    private async request<T>(url: string, options?: RequestInit): Promise<T> {

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...(options?.headers || {}),
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
            }

            return await response.json();
        } catch (error) {
            console.error("API request failed:", error);
            throw error;
        }
    }
}

export default new Api()