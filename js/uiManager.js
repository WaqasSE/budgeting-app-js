
// const uiManager = (function () {

//   let DOMControllers = {
//     expenses: document.getElementById('expenses'),
//     incomes: document.getElementById('income'),
//     totalIncome: document.getElementById('total-income'),
//     totalExpense: document.getElementById('total-expenses'),
//     total: document.getElementById('total'),
//     inputBtn: document.getElementById("submit"),
//     textInp: document.getElementById('inpItem'),
//     amountInp: document.getElementById('inpAmount'),
//     inpType: document.querySelector('select')
//   }


//   //creates and returns the gui component based upon description and amount(number)

//   function listItem(description, number) {
//     let item = document.createElement('tr');
//     let desc = document.createElement('td');//description of item
//     desc.setAttribute('class', 'item');
//     desc.textContent = description;
//     item.appendChild(desc);

//     let amount = document.createElement('td');
//     let number = document.createElement('span');
//     let delIco = document.createElement('i');
//     delIco.classList.add('far');
//     delIco.classList.add('fa-trash-alt')
//     delIco.classList.add('trash');

//     amount.append(number);
//     amount.appendChild(delIco);
//     item.appendChild(amount);

//     return item;
//   }
//   function newIncome(description, amount) {
//     DOMControllers.incomes.appendChild(listItem(description, `+${amount} `));
//     updateTotalExpense(amount);
//   }

//   function takeInput() {

//   }


//   function newExpense(description, amount) {
//     DOMControllers.expenses.appendChild(listItem(description, `-${amount} `));
//     updateTotalIncome(amount);
//   }

//   function updateTotal(totalAmount) {
//     DOMControllers.total.textContent = totalAmount;
//   }

//   function updateTotalExpense(exp) {
//     DOMControllers.totalExpense.textContent = exp;
//   }

//   function updateTotalIncome(inc) {
//     DOMControllers.totalIncome.textContent = inc;
//   }

//   return {
//     newIncome,
//     newExpense,
//     updateTotal,
//     DOMControllers
//   }

// })();