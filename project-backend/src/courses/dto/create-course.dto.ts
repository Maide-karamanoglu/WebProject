import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
    @ApiProperty({ example: 'Introduction to NestJS' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({ example: 'Learn NestJS from scratch' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 49.99 })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiPropertyOptional({ type: [String], example: ['category-uuid-1', 'category-uuid-2'] })
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    categoryIds?: string[];
}
