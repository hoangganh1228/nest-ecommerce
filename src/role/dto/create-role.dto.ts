import { IsNotEmpty, Length } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Length(5)
  description: string;
}
