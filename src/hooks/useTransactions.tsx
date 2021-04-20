import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { api } from '../services/app';

interface ITransaction {
  id: string;
  title: string;
  type: string;
  category: string;
  amount: number;
  createdAt: string;
}

interface TransactionProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: ITransaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

type TransactionInput = Omit<ITransaction, 'id' | 'createdAt'>;

const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export function TrasactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([])

  useEffect(() => {
    api.get('transactions').then(response => setTransactions(response.data.transactions))
  }, [])

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post('/transactions', transactionInput)
    const { transaction } = response.data

    setTransactions([
      ...transactions,
      { ...transaction, createdAt: new Date() } 
    ])
  }
  
  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}
    >
      { children }
    </ TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext)

  return context
}