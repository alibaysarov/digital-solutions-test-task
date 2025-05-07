export interface UsersFilter{
    query:string,
    page:number,
    sort: Record<string, string>,
}

export interface UserDto{
    id:number,
    email:string,
    fullName:string,
}
export interface UserResource {
    results: UserDto[];
    total: number
}
export interface SortAndMarked{
    sort:Record<string, string>,
    marked:number[],
    users:UserDto[],
}