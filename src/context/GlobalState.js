import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

//Inital State
const initialState = {
  transactions: [],
  error: null,
  loading: true,
};

// Create content
export const GlobalContext = createContext(initialState);

// Provider Component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const apiBaseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://expensetracker-api-ohma.onrender.com'
      : 'http://localhost:5000';

  const axiosConfig = {
    headers: {
      Accept: 'application/json',
      'Access-Control-Allow-Credentials': process.env.NODE_ENV === 'production',
      'Access-Control-Allow-Headers': process.env.NODE_ENV === 'production',
    },
    baseURL: apiBaseUrl,
  };

  // Actions
  async function getTransactions() {
    try {
      const res = await axios.get('/api/v1/transactions', axiosConfig);
      console.log(res);
      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error,
      });
    }
  }

  async function deleteTransaction(id) {
    try {
      await axios.delete(`/api/v1/transactions/${id}`, axiosConfig);

      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error,
      });
    }
  }

  async function addTransaction(transaction) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    axiosConfig.headers = { ...axiosConfig.headers, ...config.headers };
    console.log(axiosConfig);

    try {
      const res = await axios.post(
        '/api/v1/transactions',
        transaction,
        axiosConfig
      );

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.error,
      });
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        error: state.error,
        loading: state.loading,
        getTransactions,
        deleteTransaction,
        addTransaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
