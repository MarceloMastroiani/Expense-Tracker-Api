import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository extends PrismaService {
  // ======== CREATE AND RESTORE ========
  async createCategory(userId: string, createCategoryDto: CreateCategoryDto) {
    try {
      //check if the category exists in soft-deleted
      const categoryExistsInDeleted = await this.restoreDeleteCategory(
        createCategoryDto.name,
        userId,
      );
      if (categoryExistsInDeleted) {
        return categoryExistsInDeleted;
      }

      //check if the category exists
      const categoryExist = await this.category.findFirst({
        where: {
          name: createCategoryDto.name,
          userId: userId,
        },
      });

      if (categoryExist) {
        throw new HttpException(
          'Category already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      //create the category
      if (categoryExistsInDeleted === false) {
        return this.category.create({
          data: {
            name: createCategoryDto.name,
            color: createCategoryDto.color,
            userId: userId,
          },
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // ======== READ ========
  async findAllCategories() {
    return this.category.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  // ======== READ ONE ========
  async findOneCategory(id: number) {
    return this.category.findUnique({
      where: {
        id: id,
      },
    });
  }

  // ======== READ BY USER ID ========
  async findAllCategoriesByUserId(userId: string) {
    return this.category.findMany({
      where: {
        userId: userId,
      },
    });
  }

  // ======== READ SOFT DELETED ========
  async findAllSoftDeletedCategories() {
    return this.category.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
    });
  }

  // ======== READ BY USER ID AND NOT DELETED ========
  async findAllCategoriesByUserIdAndNotDeleted(userId: string) {
    return this.category.findMany({
      where: {
        userId: userId,
        deletedAt: null,
      },
    });
  }

  // ======== UPDATE ========
  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.category.update({
      where: {
        id: id,
      },
      data: updateCategoryDto,
    });
  }

  // ======== SOFT DELETE ========
  async softDelete(id: number) {
    const category = await this.findOneCategory(id);
    const deletedAt = category.deletedAt;

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    if (deletedAt !== null) {
      throw new HttpException(
        'Category already deleted',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.category.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // ======== RESTORE SOFT DELETE ========
  private async restoreDeleteCategory(name: string, userId: string) {
    const category = await this.category.findFirst({
      where: {
        name: name,
        userId: userId,
        deletedAt: {
          not: null,
        },
      },
    });

    if (!category) {
      return false;
    }
    console.log('se restauro la categoria eliminada');
    return await this.category.update({
      where: {
        id: category.id,
        userId: userId,
      },
      data: {
        deletedAt: null,
      },
    });
  }
}
