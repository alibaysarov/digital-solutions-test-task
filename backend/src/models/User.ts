export interface User{
    id:number,
    email:string,
    fullName:string,
    password:string,
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}
export interface UserDto{
    id:number,
    email:string,
    fullName:string,
}