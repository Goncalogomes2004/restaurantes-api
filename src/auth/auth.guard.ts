import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express"
import { IS_PUBLIC_KEY } from "src/decorators/public.decorator";
import { jwtConstants } from "src/utils/constants";


@Injectable()
export class AuthGuard implements CanActivate {

    //Estas classes implementam a interface CanActivate, e servem para garantir a segurança dos endpoints, pois determinam se uma requesição tem as permissões
    //necessárias para avançar para a route desejada 

    constructor(
        private reflector: Reflector,
        private jwtService: JwtService
    ) { }

    private blackList: String[] = [];

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token || this.blackList.includes(token)) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });

            request['user'] = payload;
        } catch (error) {
            console.log('Token verification failed: ', error.message);
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: any): string | null {
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            return null;
        }
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : null;
    }

}
