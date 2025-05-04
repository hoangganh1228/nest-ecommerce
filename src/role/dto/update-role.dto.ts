import { IsNotEmpty, Length } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @Length(5)
  description: string;
}
