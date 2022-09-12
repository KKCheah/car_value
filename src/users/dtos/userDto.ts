import { Expose } from "class-transformer";

export class userDto {
  @Expose()
  id: number;

  @Expose()
  email: string;   
}