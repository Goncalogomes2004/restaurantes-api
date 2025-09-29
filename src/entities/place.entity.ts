// src/places/place.entity.ts
import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Favorite } from "./favourite.entity";
import { Visited } from "./visited.entity";

@Entity("places")
export class Place {
    @PrimaryColumn()
    id: number; // vem de fora (ex: OSM ou Google), por isso não é AUTO_INCREMENT

    @Column("decimal", { precision: 10, scale: 7 })
    lat: number;

    @Column("decimal", { precision: 10, scale: 7 })
    lon: number;

    @Column({ length: 150 })
    name: string;

    @Column({ nullable: true, length: 50 })
    amenity: string;

    @Column({ nullable: true, length: 50 })
    cuisine: string;

    @OneToMany(() => Favorite, (favorite) => favorite.place)
    favorites: Favorite[];
    @OneToMany(() => Visited, (visited) => visited.place)
    visited: Visited[];

}
