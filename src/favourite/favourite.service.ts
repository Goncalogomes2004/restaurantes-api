// src/favorites/favorites.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Favorite } from "src/entities/favourite.entity";
import { Place } from "src/entities/place.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorite) private favoritesRepo: Repository<Favorite>,
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(Place) private placesRepo: Repository<Place>
    ) { }

    async addFavorite(userId: number, placeData: Place, selectedPlace: string): Promise<Favorite> {
        console.log("a adicionar o lugar", placeData, "aos favoritos do user", userId)
        const user = await this.usersRepo.findOneBy({ id: userId });
        if (!user) throw new Error("Utilizador não encontrado");

        // Verifica se o lugar já existe
        let place = await this.placesRepo.findOneBy({ id: placeData.id });
        if (!place) {
            place = this.placesRepo.create(placeData);

            await this.placesRepo.save(place);
        }

        const favorite = this.favoritesRepo.create({
            user,
            place,
            opcao_escolhida: selectedPlace
        });

        return this.favoritesRepo.save(favorite);
    }


    async getUserFavorites(userId: number): Promise<Favorite[]> {
        const favoritos = await this.favoritesRepo.find({
            where: { user: { id: userId } },
            relations: ["place"],
        });
        return favoritos
    }

    async removeFavorite(userId: number, placeId: number): Promise<void> {
        await this.favoritesRepo.delete({ user: { id: userId }, place: { id: placeId } });
    }
}
