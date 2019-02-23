import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn
} from 'typeorm'
import { RequestType } from './requesttype.enum'

@Entity('audit')
export class AuditData extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ comment: 'Pieprasījuma veids' })
  type: RequestType

  @Column('text', { comment: 'Izpildītais pieprasījums' })
  route: string

  @Column('text', { nullable: true, comment: 'Pieprasījuma parametri' })
  query: string

  @Column('text', { nullable: true, comment: 'Pieprasījuma dati' })
  body: string

  @Column('text', {
    nullable: true,
    comment: 'Lietotājs kurš veicis pieprasījumu'
  })
  username: string

  @CreateDateColumn({ comment: 'Peprasījuma datums' })
  created: Date
}
