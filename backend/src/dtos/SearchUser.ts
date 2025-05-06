import {IsString, IsInt} from 'class-validator';

export class SearchUserDto {
    @IsString()
    query = '';

    @IsInt()
    page = 1;
    sort: Record<string, string> = {};
}