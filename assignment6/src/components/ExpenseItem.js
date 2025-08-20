import React from 'react';

const ExpenseItem = ({ expense, handleDelete, handleEdit }) => {
    return (
        <li className="expense-item">
            <div className="expense-details">
                <span className="expense-title">{expense.title}</span>
                <span className="expense-amount">{expense.amount.toLocaleString()}원</span>
            </div>
            <div className="expense-actions">
                <button onClick={() => handleEdit(expense.id)} className="edit-btn">
                    <span role="img" aria-label="edit">📝</span>
                </button>
                <button onClick={() => handleDelete(expense.id)} className="delete-btn">
                    <span role="img" aria-label="delete">❌</span>
                </button>
            </div>
        </li>
    );
};

export default ExpenseItem;