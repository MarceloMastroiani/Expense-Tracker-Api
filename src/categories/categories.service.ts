import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  // ======== CREATE ======== //
  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    return await this.categoriesRepository.createCategory(
      userId,
      createCategoryDto,
    );
  }

  // ======== READ ======== //
  async findAll() {
    return await this.categoriesRepository.findAllCategories();
  }

  // ======== READ ONE ======== //
  async findOne(id: number) {
    return await this.categoriesRepository.findOneCategory(id);
  }

  // ======== READ BY USER ID ======== //
  async findAllByUserId(userId: string) {
    return await this.categoriesRepository.findAllCategoriesByUserId(userId);
  }

  // ======== READ SOFT DELETED ======== //
  async findAllSoftDeleted() {
    return await this.categoriesRepository.findAllSoftDeletedCategories();
  }

  // ======== UPDATE ======== //
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  // ======== SOFT DELETE ======== //
  async softDelete(id: number) {
    return await this.categoriesRepository.softDelete(id);
  }
}
