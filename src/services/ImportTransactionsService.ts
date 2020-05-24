import fs from 'fs';
import csv from 'csvtojson';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute(filepath: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();

    const csvJson = await csv().fromFile(filepath);

    await fs.promises.unlink(filepath);

    const transactions: Transaction[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const item of csvJson) {
      const { title, type, value, category } = item;

      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransactionService.execute({
        title,
        type,
        value: Number.parseFloat(value),
        category,
      });

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
