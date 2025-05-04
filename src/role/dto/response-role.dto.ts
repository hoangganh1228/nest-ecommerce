import { Expose } from "class-transformer";

export class ResponseRoleDTO {
  @Expose()
  name: string;

  @Expose()
  description: string;
}
