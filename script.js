'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Woo',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444
};
const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnLogout = document.querySelector('.logout__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// create username and created date
const createUserName = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner.toLowerCase().split(' ')
      .map(n => n[0])
      .join('');
    acc.date = new Date();
  });
};
createUserName(accounts);

const displayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr);
  const dateString = new Date().toString();
  labelDate.textContent = dateString.split(' ').slice(0, 5).join(' ') + ' ' + ` ${acc.username}`;
  labelBalance.textContent = `${acc.balance} €`;
};

const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = ''; // 먼저 초기화하는 과정
  const mvs = sort ? acc.movements.slice().sort((a,b) => a -b) : acc.movements;
  mvs.forEach(function(mov, idx) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const dateBefore = new Date().getMinutes() - acc.date.getMinutes();
    const html = `
     <div class="movements__row">
       <div class="movements__type movements__type--${type}"> ${idx + 1} ${type}</div>
       <div class="movements__date">${dateBefore} days before</div>
       <div class="movements__value">${mov} €</div>
     </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// display summary
const displaySummary = function(acc) { // 마지막
  let deposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr);
  let withdrawal = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  // acc.movements.forEach(mov => mov > 0 ? deposit += mov : withdrawal += mov);
  labelSumIn.textContent = `${deposit} €`;
  labelSumOut.textContent = `${Math.abs(withdrawal)} €`;
  const interestValue = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, mov) => acc + mov, 0).toFixed(2);
  labelSumInterest.textContent = `${interestValue} €`;
};
// update UI
const updateUI = function(acc) {
  // display movements
  displayMovements(acc);
  // display balance
  displayBalance(acc);
  // display summary
  displaySummary(acc);
};

// sort by movements
let sortToggle = false;
/*
btnSort.addEventListener('click', function() {
  let newMov;
  if (sortToggle) {
    newMov = currentAccount.movements.slice().sort(function(a, b) {
      return b - a;
    });
  } else {
    newMov = currentAccount.movements;
  }
  sortToggle = !sortToggle;
  containerMovements.innerHTML = ''; // 먼저 초기화하는 과정
  //
  // document.querySelectorAll('.movements__row')
  //   .forEach(v => v.remove());

  const newAcc = { ...currentAccount, movements: newMov };
  displayMovements(newAcc);
});*/
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount, !sortToggle);
  sortToggle = !sortToggle;
});
// set timer
let currentSecond;
let playTimer;
const timer = function() {
  currentSecond = 300;
  playTimer = setInterval(() => {
    currentSecond = currentSecond - 1;
    const currType = currentSecond % 60 < 10 ? `0${currentSecond % 60}` : currentSecond % 60;

    if (currentSecond < 0) {
      containerApp.style.opacity = 0;
      clearInterval(playTimer);
      // clearMovementsRow();
    } else {
      labelTimer.textContent = `${Math.trunc(currentSecond / 60)}:${currType}`;
    }
  }, 1000);
};

//Event handler
let currentAccount;
btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
  if (currentAccount !== null) {
    // currentAccount = {};
    clearInterval(playTimer);
    currentSecond = 300;
    document.querySelectorAll('.movements__row')
      .forEach(v => v.remove());
  }
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display welcome
    labelWelcome.textContent = `Welcome back, ${currentAccount.username}`;
    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    // inputLoginUsername.focus()

    updateUI(currentAccount);
    timer();
  } else {
    containerApp.style.opacity = 0;
    alert('뭔가 안맞어요!!');
  }

});

// transfer
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const transferTo = accounts.find(acc => acc.username === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);
  if (transferTo?.username &&
    amount <= currentAccount.balance &&
    transferTo.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    transferTo.movements.push(Number(amount));
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function(ev) {
  ev.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(Number(amount));
    updateUI(currentAccount);
    inputLoanAmount.focus();
  }
  inputLoanAmount.value = '';
});

// close
btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username &&
    currentAccount.pin === Number(inputClosePin.value)) {
    const accIndex = accounts.findIndex(acc => acc.username === inputCloseUsername.value);
    const confirm = prompt('This will delete your account !!!!!!!!!(yes, no)');
    if (confirm.toLowerCase() === 'yes') {
      inputCloseUsername.value = inputClosePin.value = '';
      accounts.splice(accIndex, 1);
      containerMovements.innerHTML = '';
      containerApp.style.opacity = '0';
    }
  } else {
    alert('Wrong id, password 💥');
    inputCloseUsername.value = inputClosePin.value = '';
  }
});
// logout
btnLogout.addEventListener('click', (e) => {
  e.preventDefault();
  containerMovements.innerHTML = '';
  currentSecond = 300;
  clearInterval(playTimer);
  containerApp.style.opacity = '0';
});


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const max = movements.reduce((acc, mov) => acc > mov ? acc : mov, movements[0]);
// find는 정확히 일치하는 내역을 찾으면 찾은 값이 속한 첫번째 한개의 객체를 돌려줌.
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);
// console.log(max);
/*const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
*/

// SLICE 는 원본을 복사해줌
/*let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'z'];
console.log(arr.slice(2), arr.slice(1,4), arr.slice(-2))
console.log(arr.slice(1, -2))
console.log(arr.slice())
console.log([...arr]);

/// SPLICE => 원본을 바꿈
// console.log(arr.splice(2)); // delete original arrays
arr.splice(-1); // 마지막 것 제거
console.log(arr);

const months = ['Jan', 'March', 'April', 'June'];
console.log(months)
months.splice(1, 0, 'Feb'); // index 1에 추가
// Inserts at index 1
console.log(months);

months.splice(4, 1, 'May'); // index 4 교체
// Replaces 1 element at index 4

// console.log(months.reverse())
// console.log(months);
const concatArr =arr.concat(months)
console.log(concatArr)
// console.log(arr)
console.log([...arr, ...months])
console.log(concatArr.join(' - '));
console.log(months.at(0));

// getting the last element.
console.log(months[ months.length-1 ])
console.log(months.slice(-1)[0]);
console.log(months.at(-1));
console.log('wookim'.at(-1));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];*/
// movements.forEach(function (value, index, arr) {
//   if(value > 0) console.log(`You deposited ${value} : ${index +1}번째`);
//   else console.log(`You withdrew ${Math.abs(value)} : ${index +1}번째`)
//   // console.log(arr.length)
// })
/*
const mvUsd = [];
for (const mov of movements) {
  mvUsd.push(mov * eurToUsd)
}
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;
const movementsUSD = movements.map(value => value * eurToUsd);
*/
// find index
/*const findedIdx = movements.findIndex(mov => mov === -130);
// console.log(findedIdx);
movements.includes(200);
// 조건 검색
movements.some(mve => mve > 300);
// 모든 요소가 만족하면 true
account4.movements.every(mov => mov > 0);
//flat
const arr = [1, [[2, 3], 4, 5], 6, 7, [8, 9]];
arr.flat(2);
arr.flat();
const accountMvs = accounts.map(ac => ac.movements);
// console.log(accountMvs);
const allMvs = accountMvs.flat();
// console.log(allMvs);
// const overallBalance = allMvs.reduce((a, c) => a + c);
const overallBalance = accounts
  .map(m => m.movements)
  .flat()
  .reduce((a, c) =>  a + c);
// console.log(overallBalance);
// flatMap
const overallBalance2 = accounts
  .flatMap(m => m.movements)
  .reduce((a, c) =>  a + c);
// console.log(overallBalance2);
// sort
console.log(movements.sort()); // 문자로 인식해서 정렬 -111 < -99
console.log(movements.sort((a, b) => a -b));*/
movements.fill(3, 3);
console.log(movements);
const arrayFrom = Array.from({ length: 8 }, () => 2);
console.log(arrayFrom);
// generate array
const increaseNumArr = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(increaseNumArr);
const randomArr = Array.from({ length: 8 }, (_, i) => (Math.random()*10).toFixed(2));
console.log(randomArr);

labelBalance.addEventListener('click', function() {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    element => element.textContent.replace('€', '원'));
  // console.log(movementsUI.map(mov => mov.textContent.replace('€', '원')));
  console.log(movementsUI);
});

const convertTitleCase = function(title) {
  const capitalize = (str) => str[0].toUpperCase() + str.slice(1)
  const expectations = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      expectations.includes(word) ? word : capitalize(word))
  return titleCase.join(' ')
};

console.log(convertTitleCase('this is an nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
