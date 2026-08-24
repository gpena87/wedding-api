export class CreateUserDto {
  name: string = '';
  lastName: string = '';
  email?: string;
  numberPhone: string = '';
  confirmation: boolean = false;
  restriccion: string = '';
}
