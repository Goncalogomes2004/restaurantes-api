// src/favorites/favorites.controller.ts
import { Controller, Post, Get, Delete, Param, Body, ParseIntPipe } from "@nestjs/common";
import { Place } from "src/entities/place.entity";
import { FavoritesService } from "./favourite.service";
import { Public } from "src/decorators/public.decorator";

@Controller("favorites")
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    @Post(":userId/:selectedPlace")
    @Public()
    async addFavorite(
        @Param("userId", ParseIntPipe) userId: number,
        @Param("selectedPlace") selectedPlace: string,
        @Body() place: Place
    ) {
        return this.favoritesService.addFavorite(userId, place, selectedPlace);
    }


    @Get(":userId")
    @Public()
    async getFavorites(@Param("userId") userId: number) {
        return this.favoritesService.getUserFavorites(userId);
    }

    @Delete(":userId/:placeId")
    @Public()
    async removeFavorite(@Param("userId") userId: number, @Param("placeId") placeId: number) {
        return this.favoritesService.removeFavorite(userId, placeId);
    }
}
