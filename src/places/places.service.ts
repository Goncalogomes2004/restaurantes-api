// AIzaSyBGPorTG31vd2IaAyWgBvcGOh8TG7Eyyac
// src/places/places.service.ts
import { Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class PlacesService {
    private readonly APIKeyPlaces = "AIzaSyBGPorTG31vd2IaAyWgBvcGOh8TG7Eyyac";

    async getNearbyPlaces(lat: string, lon: string) {
        if (!lat || !lon) {
            throw new HttpException('Missing lat/lon', 400);
        }

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=2000&type=restaurant&key=${this.APIKeyPlaces}`
            );

            if (!response.ok) {
                throw new HttpException('Failed to fetch from Google API', 500);
            }

            return await response.json();
        } catch (error) {
            throw new HttpException('Failed to fetch places', 500);
        }
    }
}
