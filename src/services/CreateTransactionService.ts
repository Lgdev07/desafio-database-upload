// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);

    const categoryService = new CreateCategoryService();

    const category_id = await categoryService.execute(category);

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: category_id.id,
    });

    return transaction;
  }
}

export default CreateTransactionService;
