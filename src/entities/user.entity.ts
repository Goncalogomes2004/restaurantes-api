import { Entity, PrimaryGeneratedColumn, Column, Unique, BeforeInsert, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Favorite } from "./favourite.entity";
import { Visited } from "./visited.entity";

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

    @OneToMany(() => Favorite, (favorite) => favorite.user)
    favorites: Favorite[];
    @OneToMany(() => Visited, (visited) => visited.user)
    visited: Visited[];
    @BeforeInsert()
    private async onBeforeInsert() {
        this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(10));
    }



    hasPassword(plain: string): Promise<boolean> {
        return bcrypt.compare(plain, this.password);
    }
}
