

const budgCalc = (function () {

  function Transaction(id, description, amount) {
    this.id = id;
    this.description = description;
    this.amount = amount;
  }

  function Income(id, description, amount) {
    Transaction.call(this, id, description, amount);
  }
  Income.prototype = Object.create(Transaction.prototype);
  Income.prototype.constructor = Income;

  function Expense(id, description, amount, percentage) {
    Transaction.call(this, id, description, amount);
    this.percentage = percentage;
  }
  Expense.prototype = Object.create(Transaction.prototype);
  Expense.prototype.constructor = Income;

  let id = 0;
  let transactions = new Array();
  let totalExpense = 0;
  let totalIncome = 0;
  let expPercentage = -1;

  function updateExpPercentage() {
    if (totalIncome > 0)
      expPercentage = Math.round((totalExpense / totalIncome) * 100);
    else
      expPercentage = -1;
  }

  //list of percentages of all expenses
  function getExpensesPercentage() {
    let expenses = new Array();
    transactions.forEach(transaction => {
      if (transaction instanceof Expense)
        expenses.push(transaction.percentage);
    });

    return expenses;
  }

  function addIncome(des, amount) {
    let transaction;
    transaction = new Income(id++, des, amount);
    transactions.push(transaction);
    totalIncome += amount;
    updateExpPercentage();//for total expense
    updateExpPercentages();//for each and every expense
    return {
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount
    }

  }

  function addExpense(des, amount) {
    let transaction;

    transaction = new Expense(id++, des, amount, getExpPercentage(amount));
    transactions.push(transaction);
    totalExpense += amount;

    updateExpPercentage();//updating percentage of total expenses
    return {
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      percentage: transaction.percentage
    }
  }

  function getExpPercentage(expenseAmount) {
    return (totalIncome > 0) ? Math.round((expenseAmount / totalIncome) * 100) : -1;

  }

  //percentage of each and every expense will be updated
  function updateExpPercentages() {
    for (let i = 0; i < transactions.length; i++)
      if (transactions[i] instanceof Expense)
        transactions[i].percentage = getExpPercentage(transactions[i].amount);
  }

  const removeItem = function (id) {
    let transaction;

    for (let i = 0; i < transactions.length; i++)
      if (transactions[i].id === id) {
        transaction = transactions[i];
        break;
      }

    //updating income and expense  
    if (transaction instanceof Income) {
      totalIncome -= transaction.amount;
      updateExpPercentages();
    }
    else //obviously expense
      totalExpense -= transaction.amount;

    //removing it out
    transactions.filter(transaction => transaction.id !== id);
    updateExpPercentage();

  }

  const getTotalBudget = function () {
    return totalIncome - totalExpense;
  }

  const getTotalExpense = function () {

    return {
      expense: totalExpense,
      percentage: expPercentage
    };
  }

  const getTotalIncome = function () {
    return {
      income: totalIncome,
      percentage: expPercentage
    };
  }


  return {
    addIncome,
    addExpense,
    removeItem,
    getTotalBudget,
    getTotalExpense,
    getTotalIncome,
    getExpensesPercentage
  }
})();


const uiController = (function () {

  let DOMControllers = {
    submit: "#submit",
    expenses: '#expenses',
    incomes: '#income',
    totalIncome: '#total-income',
    totalExpense: '#total-expenses',
    total: '#total',
    inputBtn: '#submit',
    textInp: '#inpItem',
    amountInp: '#inpAmount',
    percentage: '.percentage',
    incExpenses: '#inc-expenses',
    itemPercentage: '.item-percentage',
    monthYear: '.month-year'
  }


  function takeInput() {
    return {
      description: document.querySelector(DOMControllers.textInp).value,
      amount: parseFloat(document.querySelector(DOMControllers.amountInp).value),
      type: document.querySelector('select').value
    }
  }

  function clearFields() {
    let fields = document.querySelectorAll('#inpItem,#inpAmount');
    fields.forEach(elem => elem.value = "");
    fields[0].focus();
  }


  function newIncome(transaction) {
    let html, newHtml;

    html = ' <tr><td class="item">%description%</td><td><span>+%number%</span><i class="far fa-trash-alt trash" id="%id%"></i></td></tr>'
    newHtml = html.replace("%description%", transaction.description);
    newHtml = newHtml.replace("%number%", transaction.amount);
    newHtml = newHtml.replace("%id%", `inc-${transaction.id}`);
    document.querySelector(DOMControllers.incomes).insertAdjacentHTML('beforeend', newHtml);
  }

  function newExpense(transaction) {
    let html, newHtml;
    let percent = '--';
    if (transaction.percentage !== -1)
      percent = `${transaction.percentage}%`;

    html = ' <tr><td class="item">%description%</td><td><span>-%number%</span><span class="item-percentage">%percentage%</span><i class="far fa-trash-alt trash" id="%id%"></i></td></tr>'
    newHtml = html.replace("%description%", transaction.description);
    newHtml = newHtml.replace("%number%", transaction.amount);
    newHtml = newHtml.replace("%percentage%", percent);
    newHtml = newHtml.replace("%id%", `exp-${transaction.id}`);
    document.querySelector(DOMControllers.expenses).insertAdjacentHTML('beforeend', newHtml);
  }

  function updateExpensePercentages(expPercentages) {//array of expPercentages

    if (expPercentages.length > 0) {
      let expensePercentages = document.querySelectorAll(DOMControllers.itemPercentage);
      Array.prototype.forEach.call(expensePercentages, (expPercentage, index) => {
        expPercentage.textContent = (expPercentages[index] !== -1) ? `${expPercentages[index]}%` : '--';
      })

    }
  }


  function removeItem(item) {
    item.remove();
  }
  function updateTotal(totalAmount) {
    document.querySelector(DOMControllers.total).textContent = totalAmount;
  }

  function updateTotalExpense(expData) {
    document.querySelector(DOMControllers.totalExpense).textContent = expData.expense;
    document.querySelector(DOMControllers.percentage).textContent = (expData.percentage > 0) ? expData.percentage + '%' : '---';
  }

  function updateTotalIncome(incData) {
    document.querySelector(DOMControllers.totalIncome).textContent = incData.income;
    document.querySelector(DOMControllers.percentage).textContent = incData.percentage > 0 ? incData.percentage + '%' : '---';
  }

  return {
    takeInput,
    clearFields,
    removeItem,
    newIncome,
    newExpense,
    updateTotal,
    updateTotalExpense,
    updateTotalIncome,
    updateExpensePercentages,
    DOMControllers
  }

})();

const controller = (function (uiCtrl, budgetCtrl) {

  let DOMControllers = uiCtrl.DOMControllers;


  const setEventListeners = function () {

    let inputBtn = document.querySelector(DOMControllers.submit);
    let incExpenses = document.querySelector(DOMControllers.incExpenses);//container containing all incomes and expenses

    inputBtn.addEventListener('click', () => {
      //1-taking the input
      let input = uiCtrl.takeInput();
      let transaction;

      if (!input.description || !input.amount)
        alert("Incomplete Details of task( Description or Amount missing)");
      else {
        uiController.clearFields();
        /*
          2-passing it to budget controller for managing budget
          3-making it a part of list in ui
          4-updating all totals(expenses,income and overall total) in ui
          as they are already updated in budget controller at the time of input
          we just have to retrive these fields
        */


        if (input.type === '+') {
          transaction = budgetCtrl.addIncome(input.description, input.amount);
          uiCtrl.newIncome(transaction);
          uiCtrl.updateTotalIncome(budgetCtrl.getTotalIncome());
          uiCtrl.updateExpensePercentages(budgetCtrl.getExpensesPercentage());
        }
        else {
          transaction = budgetCtrl.addExpense(input.description, input.amount);
          uiCtrl.newExpense(transaction);
          uiCtrl.updateTotalExpense(budgetCtrl.getTotalExpense());
        }

        uiCtrl.updateTotal(budgetCtrl.getTotalBudget());

      }
    });

    incExpenses.addEventListener('click', function (event) {
      if (event.target.id) {

        let eId = event.target.id.split('-');/*eId will be like 
                                                for income ['inc',1] 
                                                for expense ['exp',2]*/
        //1-delete from data structure
        budgetCtrl.removeItem(parseInt(eId[1]));
        //2-delete from ui
        uiCtrl.removeItem(event.target.parentNode.parentNode);
        //3-updating numbers
        if (eId[0] === 'inc') {
          uiCtrl.updateTotalIncome(budgetCtrl.getTotalIncome());
          uiCtrl.updateExpensePercentages(budgetCtrl.getExpensesPercentage());
        }
        else//obviously it will be exp
          uiCtrl.updateTotalExpense(budgetCtrl.getTotalExpense());
        uiCtrl.updateTotal(budgetCtrl.getTotalBudget());
      }
    })

  }

  return {
    init: function () {
      console.log("Application Started");

      let now = new Date();
      let year = now.getFullYear();
      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      document.querySelector(DOMControllers.monthYear).textContent = `${months[now.getMonth()]} ${year}`;

      setEventListeners();
    }
  }
})(uiController, budgCalc);


controller.init();