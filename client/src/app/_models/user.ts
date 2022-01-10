// export class User{
//     username: string | undefined ;
//     token: string | undefined;
// }

export interface User {
    username: string;
    token: string;
    photoUrl: string;
    knownAs: string;
    gender: string;
}