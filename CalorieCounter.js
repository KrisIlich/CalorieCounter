import React from "react";
import "./CalorieCounter.css";

export default class CalorieCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      budget: 0,
      consumed: 0,
      burned: 0,
      // Categories
      categories: {
        breakfast: [],
        lunch: [],
        dinner: [],
        exercise: [],
      },
      // Modal
      showModal: false,
      modalCategory: "",
      modalName: "",
      // We'll store hours and calories in separate states
      modalHours: "",
      modalCalories: "",
    };

    // Bind methods
    this.handleBudgetChange = this.handleBudgetChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCaloriesChange = this.handleCaloriesChange.bind(this);
    this.handleHoursChange = this.handleHoursChange.bind(this);
    this.saveModalEntry = this.saveModalEntry.bind(this);
    this.clearAll = this.clearAll.bind(this);
  }

  // Helper: Clean input string of + - and whitespace
  cleanInputString(str) {
    const regex = /[+\-\s]/g;
    return str.replace(regex, "");
  }

  // Helper: Check if input might be an exponential entry
  isInvalidInput(str) {
    const regex = /\d+e\d+/i;
    return str.match(regex);
  }

  // Capitalize first letter
  capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Compute values for rendering
  updateDisplays() {
    const { budget, consumed, burned } = this.state;
    const remaining = budget - consumed + burned;
    return { budget, consumed, burned, remaining };
  }

  // Handle changes to budget input
  handleBudgetChange(e) {
    const inputVal = this.cleanInputString(e.target.value);
    if (this.isInvalidInput(inputVal)) {
      alert(`Invalid Input: ${this.isInvalidInput(inputVal)[0]}`);
      e.target.value = "";
      return;
    }

    const budgetNumber = Number(inputVal);
    if (isNaN(budgetNumber) || budgetNumber < 0) {
      alert("Please enter a valid number for the budget.");
      e.target.value = "";
      return;
    }

    this.setState({ budget: budgetNumber });
  }

  // ---------- MODAL HANDLERS ------------
  // Open the modal for a specific category
  openModal(category) {
    this.setState({
      showModal: true,
      modalCategory: category,
      modalName: "",
      // If category is exercise, we'll use hours, else we use calories
      modalHours: "",
      modalCalories: "",
    });
  }

  // Close the modal without adding
  closeModal() {
    this.setState({
      showModal: false,
    });
  }

  // Controlled inputs for the modal
  handleNameChange(e) {
    this.setState({ modalName: e.target.value });
  }

  handleCaloriesChange(e) {
    this.setState({ modalCalories: e.target.value });
  }

  handleHoursChange(e) {
    this.setState({ modalHours: e.target.value });
  }

  // Validate and save the modal data
  saveModalEntry() {
    const {
      modalCategory,
      modalName,
      modalCalories,
      modalHours,
    } = this.state;

    // Name required
    if (!modalName) {
      alert("Please enter a name.");
      return;
    }

    let finalCalories = 0;

    if (modalCategory === "exercise") {
      // Must have hours
      if (!modalHours) {
        alert("Please enter how many hours of exercise.");
        return;
      }

      const cleanedHours = this.cleanInputString(modalHours);
      if (this.isInvalidInput(cleanedHours)) {
        alert(`Invalid Input: ${this.isInvalidInput(cleanedHours)[0]}`);
        return;
      }

      const hoursNumber = Number(cleanedHours);
      if (isNaN(hoursNumber) || hoursNumber < 0) {
        alert("Please enter a valid number of hours.");
        return;
      }

      // Simple guess formula: 300 cals/hour
      finalCalories = hoursNumber * 300;
    } else {
      // Non-exercise categories: must have calories
      if (!modalCalories) {
        alert("Please enter calories.");
        return;
      }

      const cleanedCalories = this.cleanInputString(modalCalories);
      if (this.isInvalidInput(cleanedCalories)) {
        alert(`Invalid Input: ${this.isInvalidInput(cleanedCalories)[0]}`);
        return;
      }

      const caloriesNumber = Number(cleanedCalories);
      if (isNaN(caloriesNumber) || caloriesNumber < 0) {
        alert("Please enter a valid number of calories.");
        return;
      }

      finalCalories = caloriesNumber;
    }

    // Depending on category, update consumed or burned
    this.setState((prevState) => {
      const newCategories = { ...prevState.categories };
      newCategories[modalCategory] = [
        ...newCategories[modalCategory],
        { name: modalName, calories: finalCalories },
      ];

      let newConsumed = prevState.consumed;
      let newBurned = prevState.burned;

      if (modalCategory === "exercise") {
        newBurned += finalCalories;
      } else {
        newConsumed += finalCalories;
      }

      return {
        categories: newCategories,
        consumed: newConsumed,
        burned: newBurned,
        showModal: false, // close the modal on success
      };
    });
  }
  // -------- END MODAL HANDLERS ----------

  // Remove entry
  handleRemoveEntry(category, index) {
    this.setState((prevState) => {
      const newCategories = { ...prevState.categories };
      const removedItem = newCategories[category][index];
      newCategories[category] = newCategories[category].filter(
        (_, i) => i !== index
      );

      let newConsumed = prevState.consumed;
      let newBurned = prevState.burned;

      if (category === "exercise") {
        newBurned -= removedItem.calories;
      } else {
        newConsumed -= removedItem.calories;
      }

      return {
        categories: newCategories,
        consumed: newConsumed,
        burned: newBurned,
      };
    });
  }

  // Clear all
  clearAll() {
    this.setState({
      budget: 0,
      consumed: 0,
      burned: 0,
      categories: {
        breakfast: [],
        lunch: [],
        dinner: [],
        exercise: [],
      },
      showModal: false,
      modalCategory: "",
      modalName: "",
      modalHours: "",
      modalCalories: "",
    });
  }

  render() {
    const {
      categories,
      showModal,
      modalCategory,
      modalName,
      modalCalories,
      modalHours,
    } = this.state;
    const { budget, consumed, burned, remaining } = this.updateDisplays();

    // Surplus or deficit color
    const remainingClass = remaining < 0 ? "my-surplus" : "my-deficit";

    return (
      <div className="my-calorie-counter-container">
        {/* Header */}
        <div className="my-calorie-counter-header">
          <h1>My Nutrition Pal</h1>
        </div>

        {/* Summary Bar */}
        <div className="my-calories-remaining">
          <div className="my-calorie-summary">
            <div className="my-calorie-item">
              <span className="my-calorie-value">{budget}</span>
              <span className="my-calorie-label">Goal</span>
            </div>
            <span className="my-display-math">-</span>
            <div className="my-calorie-item">
              <span className="my-calorie-value">{consumed}</span>
              <span className="my-calorie-label">Food</span>
            </div>
            <span className="my-display-math">+</span>
            <div className="my-calorie-item">
              <span className="my-calorie-value">{burned}</span>
              <span className="my-calorie-label">Exercise</span>
            </div>
            <span className="my-display-math">=</span>
            <div className="my-calorie-item">
              <span className={`my-calorie-value ${remainingClass}`}>
                {remaining}
              </span>
              <span className="my-calorie-label">Remaining</span>
            </div>
          </div>
        </div>

        <div className="my-calorie-main">
          <div className="my-calorie-form-container">
            {/* Budget + Clear in a row */}
            <div className="my-budget-row">
              <div className="my-budget-section">
                <label htmlFor="my-budget">Daily Cal</label>
                <input
                  type="number"
                  min="0"
                  id="my-budget"
                  placeholder="e.g. 2000"
                  onChange={this.handleBudgetChange}
                />
              </div>
              <button
                type="button"
                className="my-clear-btn"
                onClick={this.clearAll}
              >
                Clear
              </button>
            </div>

            {/* Categories in a 2x2 grid */}
            <div className="my-categories">
              {/* Breakfast */}
              <div className="my-category">
                <div className="my-category-header">
                  <h3>Breakfast</h3>
                  <button
                    type="button"
                    className="my-add-entry"
                    onClick={() => this.openModal("breakfast")}
                  >
                    +
                  </button>
                </div>
                <ul className="my-entry-list">
                  {categories.breakfast.map((item, index) => (
                    <li className="my-entry-item" key={index}>
                      <span>{item.name}</span>
                      <span className="my-calories">{item.calories} Cal</span>
                      <button
                        className="my-remove-btn"
                        onClick={() =>
                          this.handleRemoveEntry("breakfast", index)
                        }
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lunch */}
              <div className="my-category">
                <div className="my-category-header">
                  <h3>Lunch</h3>
                  <button
                    type="button"
                    className="my-add-entry"
                    onClick={() => this.openModal("lunch")}
                  >
                    +
                  </button>
                </div>
                <ul className="my-entry-list">
                  {categories.lunch.map((item, index) => (
                    <li className="my-entry-item" key={index}>
                      <span>{item.name}</span>
                      <span className="my-calories">{item.calories} Cal</span>
                      <button
                        className="my-remove-btn"
                        onClick={() => this.handleRemoveEntry("lunch", index)}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dinner */}
              <div className="my-category">
                <div className="my-category-header">
                  <h3>Dinner</h3>
                  <button
                    type="button"
                    className="my-add-entry"
                    onClick={() => this.openModal("dinner")}
                  >
                    +
                  </button>
                </div>
                <ul className="my-entry-list">
                  {categories.dinner.map((item, index) => (
                    <li className="my-entry-item" key={index}>
                      <span>{item.name}</span>
                      <span className="my-calories">{item.calories} Cal</span>
                      <button
                        className="my-remove-btn"
                        onClick={() => this.handleRemoveEntry("dinner", index)}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exercise */}
              <div className="my-category">
                <div className="my-category-header">
                  <h3>Exercise</h3>
                  <button
                    type="button"
                    className="my-add-entry"
                    onClick={() => this.openModal("exercise")}
                  >
                    +
                  </button>
                </div>
                <ul className="my-entry-list">
                  {categories.exercise.map((item, index) => (
                    <li className="my-entry-item" key={index}>
                      <span>{item.name}</span>
                      <span className="my-calories">{item.calories} Cal</span>
                      <button
                        className="my-remove-btn"
                        onClick={() =>
                          this.handleRemoveEntry("exercise", index)
                        }
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- MODAL DIALOG ---------- */}
        {showModal && (
          <div className="my-modal-overlay">
            <div className="my-modal-content">
              <h2>Add {this.capitalizeFirstLetter(modalCategory)}</h2>

              <div className="my-modal-form-row">
                <label>Item Name</label>
                <input
                  type="text"
                  value={modalName}
                  onChange={this.handleNameChange}
                  placeholder={
                    modalCategory === "exercise" ? "e.g. Running" : "e.g. Banana"
                  }
                />
              </div>

              {modalCategory === "exercise" ? (
                // EXERCISE => hours input
                <div className="my-modal-form-row">
                  <label>Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={modalHours}
                    onChange={this.handleHoursChange}
                    placeholder="e.g. 1.5"
                  />
                </div>
              ) : (
                // FOOD => calories input
                <div className="my-modal-form-row">
                  <label>Calories</label>
                  <input
                    type="number"
                    min="0"
                    value={modalCalories}
                    onChange={this.handleCaloriesChange}
                    placeholder="e.g. 105"
                  />
                </div>
              )}

              <div className="my-modal-btn-row">
                <button
                  className="my-modal-cancel-btn"
                  onClick={this.closeModal}
                >
                  Cancel
                </button>
                <button className="my-modal-save-btn" onClick={this.saveModalEntry}>
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
