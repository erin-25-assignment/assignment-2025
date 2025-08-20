import React from 'react';
import ExpenseItem from './ExpenseItem';

const BudgetList = ({ expenses, handleDelete, handleEdit, handleClear }) => {
    return (
        <div className="budget-list-container">
            <div className="list-header">
                <h3>지출 항목</h3>
                <h3>비용</h3>
            </div>
            <ul className="expense-list">
                {expenses.map(expense => (
                    <ExpenseItem
                        key={expense.id}
                        expense={expense}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                    />
                ))}
            </ul>
            {expenses.length > 0 && (
                <button className="clear-btn" onClick={handleClear}>
                    목록 지우기
                </button>
            )}
        </div>
    );
};

export default BudgetList;