document.addEventListener('DOMContentLoaded', () => {
    const budgetInput = document.getElementById('budget');
    const addEntryButtons = document.querySelectorAll('.add-entry');
    const clearButton = document.getElementById('clear');
    const budgetDisplay = document.getElementById('budget-display');
    const consumedDisplay = document.getElementById('consumed-display');
    const burnedDisplay = document.getElementById('burned-display');
    const remainingDisplay = document.getElementById('remaining-display');
  
    // Initialize totals
    let budget = 0;
    let consumed = 0;
    let burned = 0;
  
    // Function to clean input strings
    function cleanInputString(str) {
      const regex = /[+-\s]/g;
      return str.replace(regex, '');
    }
  
    // Function to validate input
    function isInvalidInput(str) {
      const regex = /\d+e\d+/i;
      return str.match(regex);
    }
  
    // Function to create a new entry element
    function createEntryElement(category, name, calories) {
      const li = document.createElement('li');
      li.classList.add('entry-item');
  
      const nameSpan = document.createElement('span');
      nameSpan.textContent = name;
  
      const caloriesSpan = document.createElement('span');
      caloriesSpan.textContent = `${calories} Cal`;
      caloriesSpan.classList.add('calories');
  
      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = '&times;';
      removeBtn.classList.add('remove-btn');
      removeBtn.addEventListener('click', () => {
        if (category === 'exercise') {
          burned -= calories;
        } else {
          consumed -= calories;
        }
        updateDisplays();
        li.remove();
      });
  
      li.appendChild(nameSpan);
      li.appendChild(caloriesSpan);
      li.appendChild(removeBtn);
  
      // Update totals when an entry is added
      if (category === 'exercise') {
        burned += calories;
      } else {
        consumed += calories;
      }
      updateDisplays();
  
      return li;
    }
  
    // Function to add a new entry using prompt dialogs
    function addEntry(event) {
      const category = event.target.getAttribute('data-category');
      const categoryList = document.getElementById(`${category}-list`);
  
      // Prompt for entry name
      const entryName = prompt(`Enter ${capitalizeFirstLetter(category)} Name:`);
      if (!entryName) return;
  
      // Prompt for entry calories
      const entryCalories = prompt(`Enter ${capitalizeFirstLetter(category)} Calories:`);
      if (!entryCalories) return;
  
      const cleanedCalories = cleanInputString(entryCalories);
      if (isInvalidInput(cleanedCalories)) {
        alert(`Invalid Input: ${isInvalidInput(cleanedCalories)[0]}`);
        return;
      }
  
      const caloriesNumber = Number(cleanedCalories);
      if (isNaN(caloriesNumber) || caloriesNumber < 0) {
        alert('Please enter a valid number of calories.');
        return;
      }
  
      const entryElement = createEntryElement(category, entryName, caloriesNumber);
      categoryList.appendChild(entryElement);
    }
  
    // Function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  
    // Function to update the calorie displays
    function updateDisplays() {
      budgetDisplay.textContent = `${budget}`;
      consumedDisplay.textContent = `${consumed}`;
      burnedDisplay.textContent = `${burned}`;
  
      const remaining = budget - consumed + burned;
      remainingDisplay.textContent = `${remaining}`;
  
      // Update Remaining display color
      if (remaining < 0) {
        remainingDisplay.classList.remove('deficit');
        remainingDisplay.classList.add('surplus');
      } else {
        remainingDisplay.classList.remove('surplus');
        remainingDisplay.classList.add('deficit');
      }
    }
  
    // Function to handle budget input
    function handleBudgetInput(e) {
      const inputVal = cleanInputString(e.target.value);
      if (isInvalidInput(inputVal)) {
        alert(`Invalid Input: ${isInvalidInput(inputVal)[0]}`);
        e.target.value = '';
        return;
      }
  
      const budgetNumber = Number(inputVal);
      if (isNaN(budgetNumber) || budgetNumber < 0) {
        alert('Please enter a valid number for the budget.');
        e.target.value = '';
        return;
      }
  
      budget = budgetNumber;
      updateDisplays();
    }
  
    // Function to clear all entries and reset totals
    function clearForm() {
      const lists = document.querySelectorAll('.entry-list');
      lists.forEach(list => {
        list.innerHTML = '';
      });
  
      // Reset totals
      budget = 0;
      consumed = 0;
      burned = 0;
      updateDisplays();
  
      // Reset budget input
      budgetInput.value = '';
    }
  
    // Event listeners for add entry buttons
    addEntryButtons.forEach(button => {
      button.addEventListener('click', addEntry);
    });
  
    // Event listener for budget input
    budgetInput.addEventListener('input', handleBudgetInput);
  
    // Event listener for clear button
    clearButton.addEventListener('click', clearForm);
  });
  