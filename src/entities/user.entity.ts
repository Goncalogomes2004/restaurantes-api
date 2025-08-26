import { Entity, PrimaryGeneratedColumn, Column, Unique, BeforeInsert } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity("user")
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 100 })
    email: string;

    @Column({ length: 100 })
    password: string;


    @BeforeInsert()
    private async onBeforeInsert() {
        this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(10));
    }



    hasPassword(plain: string): Promise<boolean> {
        return bcrypt.compare(plain, this.password);
    }
}
