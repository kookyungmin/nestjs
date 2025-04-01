import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from "typeorm";
import * as crypto from 'crypto'

@Entity('nest_users')
export class UserEntity {
    @PrimaryColumn()
    id: string;

    @Column({ length: 30 })
    name: string;

    @Column({ length: 60 })
    email: string;

    @Column({ length: 512 })
    password: string;

    @Column({ length: 60 })
    signupVerifyToken: string;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        if (this.password) {
            this.password = crypto.createHash('sha512')
            .update(this.password)
            .digest('hex');
        }
    }
}