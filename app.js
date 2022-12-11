// Building the budgetController Function
let budgetController = (function() {

    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value; 
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value; 
    };

    
    
    let calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum = sum + cur.value; 
        });
        data.totals[type] = sum; 
    };

    let data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0 
        },
        budget: 0, 
        
    };

    return {
        addItem: function(type, des, val) {
            var newItem;
            
            
            if (data.allItems[type].length > 0) 
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1; 
            else ID = 0;
    
            
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val); 
            }

            // Adding into our data structure
            data.allItems[type].push(newItem); 

            return newItem; 
        },

        deleteItem: function(type, id) {
            let ids, index; 

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id); 

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // Calculate total income and expenses 
            calculateTotal('exp');
            calculateTotal('inc'); 

            // Calculate budget (inc - exp)
            data.budget = data.totals.inc - data.totals.exp; 

                                  
        },

      
        getBudget: function() {
            return {
                budget: data.budget, 
                totalInc: data.totals.inc,
                totalExp: data.totals.exp, 
            }
        },
    };
})();


// Buildinig the UserInterface function
let UIController = (function() {

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        container: '.container',
        dateLabel: '.budget__title--month'
    };

    
    let formatNumber = function (num, type) {
        let numSplit, int, dec; 

        num = Math.abs(num); 
        num = num.toFixed(2); 

        numSplit = num.split('.');

        int = numSplit[0];
        dec = numSplit[1];
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); 
        }
        
        return (type === 'exp' ? sign = '-' : '+') + ' ' + int + '.' + dec; 
    };

    let nodeListForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            let html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer; 
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer; 
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            let el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            let fields, fieldsArr; 

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue); 
            
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus(); 
        },

        displayBudget: function(obj) {
            let type; 
            obj.budget > 0 ? type = 'inc' : type = 'exp'; 

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
          
        },

        
        displayMonth: function() {
            let now, month, months, year;

            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth(); 
            year = now.getFullYear(); 
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year; 
        },

        changedType: function() {
            let fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ', ' +
                DOMstrings.inputValue
                );
            
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus'); 
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red'); 
        },

        getDOMstrings: function() {
            return DOMstrings; 
        }
    };

})();


// building the general app controller
let controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        let DOM = UICtrl.getDOMstrings(); 

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
    
            if (event.keycode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem); 

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    let updateBudget = function() {
        //1.Calculate  
        budgetCtrl.calculateBudget(); 

        //2. Return
        let budget = budgetCtrl.getBudget(); 

        //3. Display 
        UICtrl.displayBudget(budget); 
    }

   
    let ctrlAddItem = function() {
        let input, newItem; 

        //1. Get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget controller
                    newItem = budgetCtrl.addItem(input.type, input.description, input.value); 

                    //3. Add the item to the UI
                    UIController.addListItem(newItem, input.type); 

                    //4. Clear the fields
                    UIController.clearFields(); 
                    
                    //5. Calculate and update budget 
                    updateBudget(); 

        }
    };

    let ctrlDeleteItem = function(event) {
        let itemID, splitID, type, id;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; 

        if (itemID) {

            //inc-1
            splitID = itemID.split('-');
            type = splitID[0]; 
            id = parseInt(splitID[1]);

            //1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, id);

            //2. Delete the item from the UI
            UICtrl.deleteListItem(itemID); 

            //3. Update and show the new budget
            updateBudget();

        }
    };

    return {
        init: function() {
            setupEventListeners(); 
            UICtrl.displayMonth(); 
            UICtrl.displayBudget({
                budget: 0, 
                totalInc: 0,
                totalExp: 0,
            });
        }
    };

})(budgetController, UIController);

controller.init(); 
