import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const existingCategory = await this.categoriesRepository.findOne({
            where: { name: createCategoryDto.name },
        });

        if (existingCategory) {
            throw new ConflictException('Category with this name already exists');
        }

        const category = this.categoriesRepository.create(createCategoryDto);
        return this.categoriesRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        return this.categoriesRepository.find({ relations: ['courses'] });
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['courses'],
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);

        // Check if new name already exists (excluding current category)
        if (updateCategoryDto.name) {
            const existingCategory = await this.categoriesRepository.findOne({
                where: { name: updateCategoryDto.name, id: Not(id) },
            });

            if (existingCategory) {
                throw new ConflictException('Category with this name already exists');
            }
        }

        Object.assign(category, updateCategoryDto);
        return this.categoriesRepository.save(category);
    }

    async remove(id: string): Promise<void> {
        const result = await this.categoriesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
    }
}
