import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }



    async login(email: string, password: string): Promise<{ token: string, name: string, id: number } | null> {
        const user = await this.usersRepository.findOne({
            where: { email: email },
            select: ['id', 'email', 'password', 'name']
        });

        if (!user) {
 throw new Error('Utilizador não existe');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Credenciais Inválidas');
        }

        const users = await this.usersRepository.find({
            select: ['id', 'email', 'password', 'name']
        });

        const index = users.findIndex(u => u.email === email);


        const payload = { name: user.name, id: user.id };
        const token = await this.jwtService.signAsync(payload);

        return { token, name: user.name, id: user.id };
    }

    async validateUser(loginDto: User) {
        const user = await this.usersRepository.findOne({
            where: { email: loginDto.email },
            select: ["id", "name", "password"],
        });

        if (!user) {
            throw new Error('User not found');
        }


        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const payload = { name: user.name, id: user.id };
        const token = await this.jwtService.signAsync(payload);

        return { token };
    }





    async create(user: Partial<User>): Promise<User> {
        const newUser = this.usersRepository.create({
            name: user.name,
            email: user.email,
            password: user.password,
        });

        return await this.usersRepository.save(newUser);
    }




    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
