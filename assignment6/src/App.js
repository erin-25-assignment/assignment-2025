import React, { useState } from 'react';
import BudgetForm from './components/BudgetForm';
import BudgetList from './components/BudgetList';
import BudgetTotal from './components/BudgetTotal';
import './App.css';

const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');

    // 추가
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !amount) {
            alert('제목과 금액을 입력해주세요.');
            return;
        }

        if (editMode) {
            setExpenses(expenses.map(expense => 
                expense.id === editId ? { ...expense, title, amount: parseInt(amount) } : expense
            ));
            setEditMode(false);
            setEditId(null);
        } else {
            const newExpense = {
                id: Date.now(),
                title,
                amount: parseInt(amount)
            };
            setExpenses([...expenses, newExpense]);
        }
        setTitle('');
        setAmount('');
    };

    // 삭제
    const handleDelete = (id) => {
        setExpenses(expenses.filter(expense => expense.id !== id));
    };

    // 수정
    const handleEdit = (id) => {
        const expenseToEdit = expenses.find(expense => expense.id === id);
        setTitle(expenseToEdit.title);
        setAmount(expenseToEdit.amount);
        setEditMode(true);
        setEditId(id);
    };

    // 목록 지우기
    const handleClear = () => {
        setExpenses([]);
    };

    const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="container">
            <h1 className="title">예산 계산기</h1>
            <BudgetForm
                title={title}
                amount={amount}
                setTitle={setTitle}
                setAmount={setAmount}
                handleSubmit={handleSubmit}
                editMode={editMode}
            />
            <BudgetList
                expenses={expenses}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                handleClear={handleClear}
            />
            <BudgetTotal totalAmount={totalAmount} />
        </div>
    );
};

export default App;