"use strict";

const addItemBtn = document.querySelector(".btn-add-item");
const calorieReportBtn = document.querySelector(".btn-show-report");

const addItemWindow = document.getElementById("add-item-window");
const calorieReportWindow = document.getElementById("calorie-report-window");

const createItemBtn = document.querySelector(".add-item-submit-btn");
const userFeedback = document.querySelector(".user-feedback");

const descriptionInput = document.getElementById("description");
const caloriesInput = document.getElementById("calories");

addItemBtn.addEventListener("click", () => {
  addItemBtn.classList.add("active");
  calorieReportBtn.classList.remove("active");

  addItemWindow.style.display = "block";
  calorieReportWindow.style.display = "none";
});

calorieReportBtn.addEventListener("click", () => {
  addItemBtn.classList.remove("active");
  calorieReportBtn.classList.add("active");

  addItemWindow.style.display = "none";
  calorieReportWindow.style.display = "block";
});

createItemBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Check if description AND calories aren't empty:
  if (descriptionInput.value && caloriesInput.value) {
    // Show to the user successful feedback AND clear the fields:
    userFeedback.classList.add("show");
    createItemBtn.disabled = true;
    setTimeout(() => {
      userFeedback.classList.remove("show");
      descriptionInput.value = ``;
      caloriesInput.value = ``;
      createItemBtn.disabled = false;
    }, 2000);
  } else {
    alert(`Description and calories are required.`);
  }
});

// ******************* Try and Catch - gpt *************
//
//
//
// createItemBtn.addEventListener("click", (e) => {
//   e.preventDefault();

//   try {
//     // Check if description AND calories aren't empty:
//     if (descriptionInput.value && caloriesInput.value) {
//       // Show to the user successful feedback
//       userFeedback.classList.add("show");
//       createItemBtn.disabled = true;

//       // Clear the fields and remove feedback after 2 seconds
//       setTimeout(() => {
//         userFeedback.classList.remove("show");
//         descriptionInput.value = ``;
//         caloriesInput.value = ``;
//         createItemBtn.disabled = false;
//       }, 2000);
//     } else {
//       // Provide an alert if description or calories are missing
//       alert(`Description and calories are required.`);
//     }
//   } catch (error) {
//     console.error("An error occurred:", error);
//     // Ensure the button is re-enabled if an error occurs
//     createItemBtn.disabled = false;
//   }
// });
