import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(createUserDto);
        const savedUser = await this.usersRepository.save(user);
        // Return with role relation loaded
        const result = await this.usersRepository.findOne({
            where: { id: savedUser.id },
            relations: ['role'],
        });
        return result!;
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            relations: ['role'],
        });
    }

    async findOne(id: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['role'],
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
            relations: ['role'],
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['role'],
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Build update object
        const updateData: Partial<User> = {};

        // Hash password if it's being updated
        if (updateUserDto.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateUserDto.password, saltRounds);
        }

        // Add other fields
        if (updateUserDto.fullName) {
            updateData.fullName = updateUserDto.fullName;
        }
        if (updateUserDto.email) {
            updateData.email = updateUserDto.email;
        }

        // Handle roleId - use direct update query to avoid eager relation issues
        if (updateUserDto.roleId !== undefined) {
            updateData.roleId = updateUserDto.roleId;
        }

        // Use direct update query instead of save() to avoid eager relation issues
        await this.usersRepository.update(id, updateData);

        // Return user with updated role relation
        const result = await this.usersRepository.findOne({
            where: { id },
            relations: ['role'],
        });
        return result!;
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException(`User not found`);
        }

        // Hash password if it's being updated
        if (updateProfileDto.password) {
            const saltRounds = 10;
            updateProfileDto.password = await bcrypt.hash(updateProfileDto.password, saltRounds);
        }

        Object.assign(user, updateProfileDto);
        await this.usersRepository.save(user);

        // Return user with role relation
        const result = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['role'],
        });
        return result!;
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
