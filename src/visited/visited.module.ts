import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitedService } from './visited.service';
import { VisitedController } from './visited.controller';
import { Visited } from 'src/entities/visited.entity';
import { Place } from 'src/entities/place.entity';
import { User } from 'src/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Visited, Place, User])],
    controllers: [VisitedController],
    providers: [VisitedService],
})
export class VisitedModule { }
