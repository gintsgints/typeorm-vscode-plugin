import { Entity, Column, PrimaryGeneratedColumn, BeforeUpdate, BaseEntity } from 'typeorm'
import bcrypt from 'bcryptjs'

@Entity('users')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column('text', {nullable: true})
    firstName: string

    @Column('text', {nullable: true})
    lastName: string

    @Column('text')
    username: string

    @Column('text', {select: false})
    password: string

    @Column('text', {default: 'user'})
    role: string

    @BeforeUpdate()
    async preSave () {
        const saltRounds = 10
        const hash = await bcrypt.hash(this.password, saltRounds)
        this.password = hash
    }

}
