import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;

    @Column({ nullable: true })
    imageUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    // Many-to-One: Many courses can be created by one instructor
    @ManyToOne(() => User, (user) => user.createdCourses, { eager: true })
    instructor: User;

    // One-to-Many: A course can have many lessons
    @OneToMany(() => Lesson, (lesson) => lesson.course, { cascade: true })
    lessons: Lesson[];

    // Many-to-Many: A course can have many enrolled students
    @ManyToMany(() => User, (user) => user.enrolledCourses)
    enrolledStudents: User[];

    // Many-to-Many: A course can belong to many categories
    @ManyToMany(() => Category, (category) => category.courses)
    @JoinTable({
        name: 'course_categories',
        joinColumn: { name: 'courseId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
    })
    categories: Category[];
}
