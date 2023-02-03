import { OrderBy } from 'src/types';

export const orderQuery = <T>(order: OrderBy, position: T) => {
  if (order === 'asc') {
    return { $gt: new Date(Number(position)) };
  }
  if (order === 'desc') {
    return { $lt: new Date(Number(position)) };
  }
};
