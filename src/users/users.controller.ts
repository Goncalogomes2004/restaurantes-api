import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UsersService } from './user.service';
import { Public } from 'src/decorators/public.decorator';
import { enableCompileCache } from 'module';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(+id);
    }

    @Post()
    @Public()
    create(@Body() user: Partial<User>): Promise<User> {
        return this.usersService.create(user);
    }
    @Post('change-password')
    @Public()
    async changePassword(
        @Body('email') email: string,
        @Body('newPassword') newPassword: string,
    ) {
        return this.usersService.changePassword(email, newPassword);
    }


    @Public()
    @Post('recover')
    async recover(@Body('email') email: string) {
        return this.usersService.sendRecoveryEmail(email);
    }

    @Public()
    @Post("/login")
    login(@Body() body: { email: string; password: string }) {

        return this.usersService.login(body.email, body.password);
    }
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.usersService.remove(+id);
    }
}
