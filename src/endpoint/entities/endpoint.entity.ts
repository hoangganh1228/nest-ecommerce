import { Permission } from 'src/permissions/entities/permission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export type HttpEndpoint = 'GET' | 'POST' | 'PATCH' | 'DELETE';

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  method: HttpEndpoint;

  @OneToMany(() => Permission, (perm) => perm.endpoint)
  permission: Permission[];
}
