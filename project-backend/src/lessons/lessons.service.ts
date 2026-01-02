import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class LessonsService {
    constructor(
        @InjectRepository(Lesson)
        private lessonsRepository: Repository<Lesson>,
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
    ) { }

    async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
        const { courseId, ...lessonData } = createLessonDto;

        const course = await this.coursesRepository.findOne({ where: { id: courseId } });
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }

        const lesson = this.lessonsRepository.create({
            ...lessonData,
            course,
        });

        return this.lessonsRepository.save(lesson);
    }

    async findAll(): Promise<Lesson[]> {
        return this.lessonsRepository.find({ relations: ['course'] });
    }

    async findByCourse(courseId: string): Promise<Lesson[]> {
        return this.lessonsRepository.find({
            where: { course: { id: courseId } },
            order: { order: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Lesson> {
        const lesson = await this.lessonsRepository.findOne({
            where: { id },
            relations: ['course'],
        });

        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }

        return lesson;
    }

    async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
        const lesson = await this.findOne(id);

        const { courseId, ...lessonData } = updateLessonDto;

        // Update basic fields
        Object.assign(lesson, lessonData);

        // Update course if provided
        if (courseId) {
            const course = await this.coursesRepository.findOne({ where: { id: courseId } });
            if (!course) {
                throw new NotFoundException(`Course with ID ${courseId} not found`);
            }
            lesson.course = course;
        }

        return this.lessonsRepository.save(lesson);
    }

    async remove(id: string): Promise<void> {
        const result = await this.lessonsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
    }
}
