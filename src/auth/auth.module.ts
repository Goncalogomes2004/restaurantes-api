import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [
        JwtModule.register({
            secret: 'secretKey',
        }),
    ],
    providers: [AuthService, AuthGuard],
    exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule { }
