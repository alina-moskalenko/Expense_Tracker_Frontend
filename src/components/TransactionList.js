import React, { useContext, useEffect } from 'react';
import { Transaction } from './Transaction';

import { GlobalContext } from '../context/GlobalState';

export const TransactionList = () => {
  const { transactions, getTransactions } = useContext(GlobalContext);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(transactions);

  return (
    <>
      <h3>History</h3>
      <ul id='list' className='list'>
        {transactions.map((transaction) => (
          <Transaction key={transaction._id} transaction={transaction} />
        ))}
      </ul>
    </>
  );
};
