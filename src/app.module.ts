import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PlacesModule } from './places/places.module';
import { FavoritesModule } from './favourite/favourite.module';
import { Place } from './entities/place.entity';
import { Favorite } from './entities/favourite.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfigModule } from './users/mailer.module';
import { Visited } from './entities/visited.entity';
import { VisitedModule } from './visited/visited.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'root',
      password: 'Lavragem-titubeou-bebia0',
      database: 'restaurantes',
      entities: [User, Place, Favorite, Visited],
    }),
    UsersModule,
    AuthModule,
    PlacesModule,
    FavoritesModule,
    MailerModule,
    MailConfigModule,
    VisitedModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AppModule { }
