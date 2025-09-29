// src/favorites/favorite.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique, JoinColumn, Column } from "typeorm";
import { User } from "./user.entity";
import { Place } from "./place.entity";


@Entity("favorites")
@Unique(["user", "place"]) // evita duplicados
export class Favorite {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.favorites, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })  // <-- força nome da coluna
    user: User;

    @ManyToOne(() => Place, (place) => place.favorites, { onDelete: "CASCADE" })
    @JoinColumn({ name: "place_id" }) // <-- força nome da coluna
    place: Place;


    @Column({ length: 150 })
    opcao_escolhida: string

}
