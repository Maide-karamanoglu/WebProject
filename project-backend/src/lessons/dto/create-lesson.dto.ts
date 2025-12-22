import { IsString, IsNotEmpty, IsOptional, IsInt, IsUrl, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
    @ApiProperty({ example: 'Getting Started with NestJS' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({ example: 'In this lesson, we will learn...' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=...' })
    @IsOptional()
    @IsUrl()
    videoUrl?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    order?: number;

    @ApiProperty({ example: 'course-uuid' })
    @IsUUID()
    courseId: string;
}
