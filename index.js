const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '+', '-', '*', '/', '^', '(', ')', '%', '=', 'Backspace', '_', 'Escape', 'Enter'];
const operands = ['-', '+', '*', '/', '^'];
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.button');
let isResult = false;
const weights = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3
}

const handleChange = () => {
    if(display.value === '') display.value = '0';
}

function doOperation(curr, next, op){
    if(!next && !curr) return 0;
    if(!next) return curr;
    if(!curr) return next;
    switch(op){
        case '+':
            return curr + next;
        case '-':
            return curr - next;
        case '/':
            return curr / next;
        case '*':
            return curr * next;
        case '^':
            return Math.pow(curr, next);
    }
}

function solve(nums = [], ops = []){
    if(ops.length === 1){
        return doOperation(nums[0], nums[1], ops[0]);
    }
}

const handleOperation = () => {
    let argStack = display.value.replaceAll(/(?!^-)[-+*/^)(]/g, " $& ").split(' ');
    argStack = argStack.filter(val => val !== '').toReversed();
    let numStack = [];
    let opStack = [];
    let solved = false;
    for(let i=0; i<argStack.length;){
        const value = argStack.pop();
        if(operands.includes(value) || value === ')'){
            opStack.push(value);
        }else if(value === '('){
            opStack.push(value);
            numStack.push(0);
        }else{
            numStack.push(Number.parseFloat(value));
        }
    }
    let i = 0;
    while(!solved){
        if(numStack.length === 1) return numStack[0];
        if(opStack[i] !== '(' && opStack[i] !== ')'){
            if((!opStack[i+1] || opStack[i+1] === ')') || (weights[opStack[i]] >= weights[opStack[i+1]])){
                let res = doOperation(numStack[i], numStack[i+1], opStack[i])
                numStack.splice(i, 2, res);
                opStack.splice(i, 1);
                i = i === 0 ? 0 : i - 1;
            }else{
                i++;
            }
        }else{
            if(opStack[i] === '(' && weights[opStack[i+1]]){
                i++;
            }else if(opStack[i] === '(' && opStack[i+1] === ')'){
                numStack.splice(i, 1);
                opStack.splice(i, 2);
                i--;
            }
        }
    }
}

buttons.forEach(button => {
    button.addEventListener('click', e => {
        const {value} = e.target.dataset;
        displayValue(value);
        e.target.blur(); // quit focus so do not click when enter is pressed
        handleChange();
    });
});

document.addEventListener('keydown', (e) => {
    if(keys.includes(e.key)){
        displayValue(e.key);
    }
    handleChange();
});

const displayValue = (value) => {
    const numbersArray = display.value.split(/(?!^)([\+\-\*\/\(\)])/);
    const lastNumber = numbersArray[numbersArray.length - 1];
    if(value === '%'){
        display.value = `${numbersArray.slice(0, -1).join('')}${lastNumber/100}`;
        return;
    }
    if(value === 'Escape'){
        display.value = '0';
        return;
    }
    if(value === 'Backspace'){
        display.value = display.value.slice(0, -1);
        return;
    }
    if(value === '_'){
        if(display.value.search(/[\+\-\*\/\^\(\)]/g) === -1 && display.value !== '0'){
            display.value = `-${display.value}`;
        }else if(display.value.startsWith('-')){
            display.value = display.value.slice(1);
        }
        return;
    }
    if(operands.includes(value)) {
        if(isResult) isResult = false;
        if(display.value.slice(-1) === '.') return;
        if(operands.includes(display.value.slice(-1))){
            display.value = display.value.slice(0, -1) + value;
            return;
        }
    }else if(isResult && !isNaN(Number.parseFloat(value))){
        isResult = false;
        display.value = value;
        return;
    }
    if(display.value.startsWith('0') && !display.value.includes('.') && value === '0') {
        return;
    }
    if(operands.slice(1).includes(value) && display.value === '0') return;
    if(display.value === '0' && value === '.'){
        display.value += value;
        return
    }
    if(value === '.'){
        isResult = false;
        if(lastNumber.includes('.')) return;
        if(operands.includes(display.value.slice(-1))){
            display.value += `0${value}`;
            return;
        }
        if(display.value.slice(-1) === '.') return;
    }
    if(value === '('){
        isResult = false;
        if(!operands.includes(display.value.slice(-1)) && display.value !== '0'){
            value = `*(`;
        }
    } 
    if(value === 'Enter') {
        isResult = true;
        display.value = handleOperation();
        return;
    } 
    display.value = 
        display.value.split('').every(value => value === '0') ?
        value : display.value + value;
}