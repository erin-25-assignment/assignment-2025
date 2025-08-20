import React from 'react';

const BudgetTotal = ({ totalAmount }) => {
    return (
        <div className="budget-total">
            <h3>총 지출: {totalAmount.toLocaleString()}원</h3>
        </div>
    );
};

export default BudgetTotal;