import { IsBoolean, IsNotEmpty } from 'class-validator';

export class MarkAsArrivedDto {
  @IsNotEmpty()
  @IsBoolean()
  hasArrived: boolean;
}
