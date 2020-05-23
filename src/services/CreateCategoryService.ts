import { getRepository } from 'typeorm';
import Category from '../models/Category';

class CreateCategoryService {
  public async execute(category: string): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const category_id = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!category_id) {
      const newCategory_id = categoryRepository.create({ title: category });

      await categoryRepository.save(newCategory_id);

      return newCategory_id;
    }

    return category_id;
  }
}

export default CreateCategoryService;
