import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from 'src/entities/place.entity';
import { User } from 'src/entities/user.entity';
import { Visited } from 'src/entities/visited.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VisitedService {

    constructor(
        @InjectRepository(Visited)
        private readonly visitedRepository: Repository<Visited>,
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(Place) private placesRepo: Repository<Place>
    ) { }

    findAll(): Promise<Visited[]> {
        return this.visitedRepository.find();
    }


    async findOne(id: number): Promise<Visited> {
        const visited = await this.visitedRepository.findOne({ where: { id } });
        if (!visited) {
            throw new NotFoundException(`Visited with id ${id} not found`);
        }
        return visited;
    }

    async getUserVisited(userId: number): Promise<Visited[]> {
        const favoritos = await this.visitedRepository.find({
            where: { user_id: userId },
            relations: ["place"],
        });
        return favoritos
    }


    async create(userId: number, placeData: Place, selectedPlace: string, rating: number): Promise<Visited> {
        console.log("a adicionar o lugar", placeData, "aos visitados do user", userId)
        const user = await this.usersRepo.findOneBy({ id: userId });
        if (!user) throw new Error("Utilizador não encontrado");

        let place = await this.placesRepo.findOneBy({ id: placeData.id });
        if (!place) {
            place = this.placesRepo.create(placeData);

            await this.placesRepo.save(place);
        }

        const visited = this.visitedRepository.create({
            user,
            place,
            opcao_escolhida: selectedPlace,
            avaliacao: rating
        });

        return this.visitedRepository.save(visited);
    }



    async update(id: number, data: Partial<Visited>): Promise<Visited> {
        await this.visitedRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(userId: number, placeId: number): Promise<void> {
        await this.visitedRepository.delete({ user: { id: userId }, place: { id: placeId } });
    }

    async getReviewAverage(placeId: number): Promise<number | null> {
        const result = await this.visitedRepository
            .createQueryBuilder("r")
            .select("AVG(r.avaliacao)", "avg")
            .where("r.place_id = :placeId", { placeId })
            .getRawOne<{ avg: string | null }>();

        return result?.avg ? parseFloat(result.avg) : null;
    }



    async getAllAverages(): Promise<{ place_id: number; average: number }[]> {
        const results = await this.visitedRepository
            .createQueryBuilder("r")
            .select("r.place_id", "place_id")
            .addSelect("AVG(r.avaliacao)", "average")
            .groupBy("r.place_id")
            .getRawMany<{ place_id: number; average: string }>();

        return results.map(r => ({
            place_id: r.place_id,
            average: parseFloat(r.average),
        }));
    }

}
