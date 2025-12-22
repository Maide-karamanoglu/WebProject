import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity('lessons')
export class Lesson {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ nullable: true })
    videoUrl: string;

    @Column({ type: 'int', default: 0 })
    order: number;

    // Many-to-One: Many lessons belong to one course
    @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'CASCADE' })
    course: Course;
}
