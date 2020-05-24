import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

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
    if (value <= 0) {
      throw new AppError('Value must be grater than 0.');
    }

    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('Not sufficient balance.');
    }

    let category_id = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!category_id) {
      category_id = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(category_id);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
