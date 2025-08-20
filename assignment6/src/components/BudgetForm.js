import React from 'react';

const BudgetForm = ({ title, amount, setTitle, setAmount, handleSubmit, editMode }) => {
    return (
        <form onSubmit={handleSubmit} className="budget-form">
            <div className="form-group">
                <label htmlFor="title">지출 항목</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예) 식비"
                />
            </div>
            <div className="form-group">
                <label htmlFor="amount">비용</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="예) 5000"
                />
            </div>
            <button type="submit" className="submit-btn">
                {editMode ? '수정' : '제출'}
            </button>
        </form>
    );
};

export default BudgetForm;