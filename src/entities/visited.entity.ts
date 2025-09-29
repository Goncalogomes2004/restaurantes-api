import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Place } from './place.entity';

@Entity({ name: 'visited', schema: 'restaurantes' })
export class Visited {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    user_id: number;

    @Column({ type: 'bigint' })
    place_id: number;

    @Column({ type: 'varchar', length: 100, collation: 'utf8mb4_unicode_ci' })
    opcao_escolhida: string;

    @Column({ type: 'float', nullable: true })
    avaliacao: number | null;


    @ManyToOne(() => User, (user) => user.visited, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Place, (place) => place.visited, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'place_id' })
    place: Place;
}
