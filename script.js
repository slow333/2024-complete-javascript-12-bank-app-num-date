'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Aonas achmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-02-05T16:33:06.386Z',
    '2020-05-27T17:01:17.194Z',
    '2024-02-09T23:36:17.929Z',
    '2024-02-10T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE',
};

const account2 = {
  owner: 'bessica bavis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-04-05T16:33:26.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'cent cc',
  movements: [200, -200, 11340, -300, -20],
  interestRate: 0.7,
  pin: 3,
  currency: 'KRW',
  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2024-02-09T14:18:46.235Z',
    '2024-02-10T16:33:06.386Z',
  ],
  locale: 'ko-KR',
};

const accounts = [account1, account2, account3];

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
  });
};
createUserName(accounts);

const formattedDate = (date, locale) => {
  const option = {
    year: 'numeric',
    weekday: 'short',
    month: '2-digit',
    day: 'numeric',
    hour: 'numeric', minute:'numeric', second: 'numeric'
    // timeZone: 'Australia/Sydney',
  };
  return new Intl.DateTimeFormat(locale, option).format(date);
}
const formattedCur = (locale, currency, money) => {
  const option = {
    style: 'currency',
    currency: currency,
  }
  return new Intl.NumberFormat(locale, option).format(money)
};

const calcDates = function (date) {
  const currDate = new Date().getTime();
  const destDate = new Date(date).getTime();
  const daysPassed = Math.floor((currDate - destDate)/(1000*60*60*24))
  if (daysPassed <= 1 ) return 'today';
  if(daysPassed === 2) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days passed`;
  if(daysPassed > 7) return formattedDate(new Date(date), currentAccount.locale)
};

const displayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr);
  const now = new Date();
  labelDate.textContent = formattedDate(now, acc.locale);
  labelBalance.textContent = formattedCur(acc.locale, acc.currency, acc.balance);
};

// containerApp.style.opacity = 100;

const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = ''; // 먼저 초기화하는 과정
  const movs = sort ? acc.movements.slice()
    .sort((a,b) => a - b) : acc.movements;

  movs.forEach(function(mov, idx) {
    const type = mov > 0 ? 'deposit': 'withdrawal';
    const newDate = new Date(acc.movementsDates[idx]);
    console.log('acc mov dates ; ',newDate);

    const html = `
     <div class="movements__row">
       <div class="movements__type movements__type--${type}"> ${idx + 1} ${type}</div>
       <div class="movements__date">${calcDates(acc.movementsDates[idx])}</div>
       <div class="movements__value">${formattedCur(acc.locale, acc.currency, mov)}</div>
     </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// display summary
const displaySummary = function(acc) {
  let deposit=0; let withdrawal = 0
  acc.movements.forEach(m => m > 0 ? deposit += m : withdrawal += m);
  labelSumIn.textContent = formattedCur(acc.locale, acc.currency, deposit);
  labelSumOut.textContent = formattedCur(acc.locale, acc.currency,Math.abs(withdrawal));
  const interestValue = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formattedCur(acc.locale, acc.currency,interestValue);
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

btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount, !sortToggle);
  sortToggle = !sortToggle;
  rowColor();
});
// set timer
let currentSecond;
let playTimer;
const timer = function() {
  currentSecond = 300;
  playTimer = setInterval(() => {
    currentSecond = currentSecond - 1;
    const secType = (currentSecond % 60).toString().padStart(2,'0');

    if (currentSecond < 0) {
      containerApp.style.opacity = 0;
      clearInterval(playTimer);
      // clearMovementsRow();
    } else {
      labelTimer.textContent = `${Math.floor(currentSecond / 60)}:${secType}`;
    }
  }, 1000);
};

//Event handler
let currentAccount;
btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
  if (currentAccount !== null) {
    clearInterval(playTimer);
    currentSecond = 300;
    document.querySelectorAll('.movements__row')
      .forEach(v => v.remove());
  }
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display welcome
    labelWelcome.textContent = `Welcome back, ${currentAccount.username}`;
    containerApp.style.opacity = '100';
    // Clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    // inputLoginUsername.focus()

    updateUI(currentAccount);
    timer();
    rowColor();
  } else {
    containerApp.style.opacity = '0';
    alert('뭔가 안맞어요!!');
  }
});

// transfer
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const transferTo = accounts.find(acc => acc.username === inputTransferTo.value);
  const amount = +(inputTransferAmount.value);
  if (transferTo?.username &&
    amount <= currentAccount.balance &&
    transferTo.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    transferTo.movements.push(+amount);
    transferTo.movementsDates.push(new Date().toISOString());
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    updateUI(currentAccount);
    console.log(transferTo)
  }
});

btnLoan.addEventListener('click', function(ev) {
  ev.preventDefault();
  const amount = +(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(+amount);
    updateUI(currentAccount);
    inputLoanAmount.focus();
  }
  inputLoanAmount.value = '';
});

// close
btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username &&
    currentAccount.pin === +inputClosePin.value) {
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

function rowColor () {
  [...document.querySelectorAll('.movements__row')]
    .forEach(function (row, i) {
      if (i % 2 === 0) row.style.backgroundColor = '#eee';
    });
}