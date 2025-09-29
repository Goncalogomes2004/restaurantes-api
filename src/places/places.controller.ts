// src/places/places.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { Public } from 'src/decorators/public.decorator';
@Public()
@Controller('places')
export class PlacesController {
    constructor(private readonly placesService: PlacesService) { }

    @Get()
    async getPlaces(@Query('lat') lat: string, @Query('lon') lon: string) {
        return this.placesService.getNearbyPlaces(lat, lon);
    }
}
