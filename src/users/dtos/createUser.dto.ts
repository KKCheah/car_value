import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class createUserDto {

  @IsEmail()
  email: string;
  
  @IsString()
  password: string;
}