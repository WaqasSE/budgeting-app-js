
let totalExp = 0;
let totalInc = 0;
let totalBud = 0;
let inputBtn = document.getElementById("submit");
let textInp = document.getElementById('inpItem');
let amountInp = document.getElementById('inpAmount');
let inpType = document.querySelector('select');
let expenses = document.getElementById('expenses');
let incomes = document.getElementById('income');
let totalIncome = document.getElementById('total-income');
let totalExpense = document.getElementById('total-expenses');
let total = document.getElementById('total');

init();
//adding incomes or expenses
inputBtn.addEventListener('click', () => {
  if (!textInp.value || !amountInp.value)
    alert("Incomplete Details of task( Description or Amount missing)");
  else {

    let item = document.createElement('tr');
    let desc = document.createElement('td');//description of item
    desc.setAttribute('class', 'item');
    desc.textContent = textInp.value;
    item.appendChild(desc);

    let amount = document.createElement('td');
    let number = document.createElement('span');
    let delIco = document.createElement('i');
    delIco.classList.add('far');
    delIco.classList.add('fa-trash-alt')
    delIco.classList.add('trash');


    amount.append(number);
    amount.appendChild(delIco);
    item.appendChild(amount);

    if (inpType.value === '+') {
      number.textContent = '+' + amountInp.value + ' ';
      incomes.appendChild(item);
      updateIncome(parseFloat(amountInp.value));
    }
    else {
      number.textContent = '-' + amountInp.value + ' ';
      expenses.appendChild(item);
      updateExpense(parseFloat(amountInp.value));
    }

    textInp.value=amountInp.value="";

  }
})

function init() {
  let totalExp = getTotalExpenses();
  let totalInc = getTotalIncome();

  updateIncome(totalInc);
  updateExpense(totalExp);

}

function getTotalExpenses() {
  let totalExp = 0;

  //expeses is a table..has multiple children like body,head
  // in  body we have multiple rows which are items
  if (expenses.children[0]) {
    let items = expenses.children[0].children;

    for (let item of items)
      totalExp += parseInt(item.children[1].children[0].textContent.slice(1));//slicing because of sign at start
  }

  return totalExp;
}


function getTotalIncome() {

  let totalInc = 0;

  //income is a table..has multiple children like body,head
  // in body we have multiple rows which are items
  if (incomes.children[0]) {
    let items = incomes.children[0].children;

    for (let item of items)
      totalInc += parseInt(item.children[1].children[0].textContent.slice(1));//slicing because of sign at start
  }

  return totalInc;
}

function updateTotal(income, expenses) {
  totalBud += income - expenses;
  total.textContent = totalBud;
}

function updateIncome(income) {
  totalInc += income;
  totalIncome.textContent = totalInc;
  updateTotal(totalInc, 0);
}

function updateExpense(expense) {
  totalExp += expense;
  totalExpense.textContent = totalExp;
  updateTotal(0, expense);
}