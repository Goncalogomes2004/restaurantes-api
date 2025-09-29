import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { VisitedService } from './visited.service';
import { Visited } from 'src/entities/visited.entity';
import { Public } from 'src/decorators/public.decorator';
import { Place } from 'src/entities/place.entity';
@Public()
@Controller('visited')
export class VisitedController {
    constructor(private readonly visitedService: VisitedService) { }
    @Get("/allAverages")
    async getAllAverages() {
        return this.visitedService.getAllAverages();
    }

    @Get("/revew/:placeId")
    @Public()
    async getReviewAverage(@Param("placeId") placeId: number) {
        return this.visitedService.getReviewAverage(placeId);
    }

    @Get(":userId")
    async getFavorites(@Param("userId") userId: number) {
        return this.visitedService.getUserVisited(userId);
    }




    @Post(":userId/:selectedPlace/:rating")
    @Public()
    async create(
        @Param("userId", ParseIntPipe) userId: number,
        @Param("selectedPlace") selectedPlace: string,
        @Param("rating") rating: number,
        @Body() place: Place
    ) {
        return this.visitedService.create(userId, place, selectedPlace, rating);
    }


    @Put(':id')
    update(@Param('id') id: number, @Body() data: Partial<Visited>): Promise<Visited> {
        return this.visitedService.update(id, data);
    }



    @Delete(":userId/:placeId")
    @Public()
    async remove(@Param("userId") userId: number, @Param("placeId") placeId: number) {
        return this.visitedService.remove(userId, placeId);
    }
}
