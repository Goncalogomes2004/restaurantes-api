import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,

    ) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }


    async sendRecoveryEmail(email: string) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) throw new BadRequestException('Email não encontrado');

        // Gera o código: 6 dígitos com traço no meio
        const rawCode = Math.floor(100000 + Math.random() * 900000).toString();
        const code = rawCode.slice(0, 3) + rawCode.slice(3);

        // Caminho absoluto da tua imagem no servidor
        const logoPath =
            '/home/goncalo/randomreastaurant/restaurantes-api/public/logoNoBgCircleCutted.png';

        await this.mailerService.sendMail({
            to: email,
            subject: 'Recuperação de Password',
            html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; color: #333;">
        <h2 style="color: #c9485a;">Recuperação de Password</h2>
        <p>Olá <b>${user.name}</b>,</p>
        <p>Recebemos um pedido de recuperação da sua password.</p>
        <p style="font-size: 18px; font-weight: bold; background: #f1f1f1; padding: 10px; border-radius: 8px; text-align: center; letter-spacing: 3px;">
          ${code}
        </p>
        <p>Introduza este código na aplicação para continuar.</p>
        <br/>
        <p style="font-size: 12px; color: #777;">
          Se não fez este pedido, pode ignorar este email em segurança.
        </p>
        <div style="margin-top: 30px; text-align: center;">
          <img src="cid:logo" alt="Logo" style="height: 80px;" />
          <p style="font-size: 12px; color: #aaa; margin-top: 10px;">
            © ${new Date().getFullYear()} Random Restaurant. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `,
            attachments: [
                {
                    filename: 'logo.png',
                    path: logoPath,
                    cid: 'logo', // o cid permite usar no <img src="cid:logo"/>
                },
            ],
        });

        return { message: 'Email enviado', code }; // ⚠️ podes guardar o código na DB em vez de devolver
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


    async changePassword(email: string, newPassword: string) {
        const user = await this.usersRepository.findOne({
            where: {
                email: email
            }
        })


        if (!user) return

        const hashedPassword = await bcrypt.hash(newPassword, 10);  // O "10" é o número de salt rounds, pode ser ajustado

        // Atribui a senha criptografada ao usuário
        user.password = hashedPassword;
        console.log(user)

        // Salva o usuário com a senha criptografada
        return await this.usersRepository.save(user);
    }


    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
