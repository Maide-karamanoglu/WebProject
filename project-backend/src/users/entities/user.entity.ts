import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    ManyToMany,
    ManyToOne,
    JoinTable,
    JoinColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    fullName: string;

    // Many-to-One: Many users can have the same role
    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @Column({ nullable: true })
    roleId: number;

    @CreateDateColumn()
    createdAt: Date;

    // One-to-Many: A user (instructor) can create many courses
    @OneToMany(() => Course, (course) => course.instructor)
    createdCourses: Course[];

    // Many-to-Many: A user (student) can be enrolled in many courses
    @ManyToMany(() => Course, (course) => course.enrolledStudents)
    @JoinTable({
        name: 'user_enrolled_courses',
        joinColumn: { name: 'userId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'courseId', referencedColumnName: 'id' },
    })
    enrolledCourses: Course[];
}
