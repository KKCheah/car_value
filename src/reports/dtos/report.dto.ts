import { Expose, Transform } from "class-transformer";

export class reportDto {
  
  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  mileage: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  price: number;

  @Transform(({obj})=> obj.user.id)
  @Expose()
  userId: number;

  @Expose()
  approved: boolean;
}