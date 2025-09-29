// src/favorites/favorites.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FavoritesController } from "./favourite.controller";
import { FavoritesService } from "./favourite.service";
import { Favorite } from "src/entities/favourite.entity";
import { User } from "src/entities/user.entity";
import { Place } from "src/entities/place.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Favorite, User, Place])],
    providers: [FavoritesService],
    controllers: [FavoritesController],
})
export class FavoritesModule { }
