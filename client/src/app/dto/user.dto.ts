export interface User {
    id?: string;
    email: string;
    avatar: string;
    name: string;
    age: number;
    isWoman: boolean | null;
    country: string;
    languages: string;
    password: string;
    description?: string;
}
