
document.addEventListener("DOMContentLoaded", async () => {
  const addItemWindow = document.getElementById("add-item-window");
  const reportWindow = document.getElementById("calorie-report-window");

  const btnAddItem = document.getElementById("btn-add-item");
  const btnShowReport = document.getElementById("btn-show-report");

  let isReportVisible = false;

  // Open the database
  try {
    db = await openCaloriesDB("caloriesdb", 1);
  } catch (err) {
    console.error(err);
  }

  // Switch to "Add Item" view
  btnAddItem.addEventListener("click", () => {
    addItemWindow.style.display = "block";
    reportWindow.style.display = "none";
    btnAddItem.classList.add("active");
    btnShowReport.classList.remove("active");
    isReportVisible = false;
  });

  // Switch to "Calorie Report" view
  btnShowReport.addEventListener("click", async () => {
    addItemWindow.style.display = "none";
    reportWindow.style.display = "block";
    btnShowReport.classList.add("active");
    btnAddItem.classList.remove("active");
    isReportVisible = true;
    await displayCalorieReport();
  });

  // Handle form submission to add calorie data
  const calorieForm = document.getElementById("calorieForm");
  calorieForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const calories = parseInt(document.getElementById("calories").value);

    const calorieData = {
      calorie: calories,
      category: category,
      description: description,
      date: new Date(),
    };

    // Add data to IndexedDB
    try {
      await addCalories(db, calorieData);
      document.getElementById("user-feedback").textContent = "Calorie item added successfully!";
      document.getElementById("user-feedback").classList.add("show");
      calorieForm.reset();
      if (isReportVisible) {
        await displayCalorieReport();
      }
      setTimeout(() => {
        document.getElementById("user-feedback").classList.remove("show");
      }, 3000);
    } catch (error) {
      document.getElementById("user-feedback").textContent = "Failed to add calorie item.";
      document.getElementById("user-feedback").classList.add("show");
    }
  });

  // Add event listeners for year and month selectors
  document.getElementById("year").addEventListener("change", displayCalorieReport);
  document.getElementById("month").addEventListener("change", displayCalorieReport);

  // Function to display calorie report
  async function displayCalorieReport() {
    const year = parseInt(document.getElementById("year").value);
    const month = parseInt(document.getElementById("month").value);
    
    try {
      const calorieEntries = await getCaloriesByMonthAndYear(db, month, year);
      const reportBody = document.getElementById("calorie-report-body");
      reportBody.innerHTML = ""; // Clear previous entries

      if (calorieEntries.length === 0) {
        reportBody.innerHTML = "<tr><td colspan='4'>No data found.</td></tr>";
      } else {
        calorieEntries.forEach((entry) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${entry.category}</td>
            <td>${entry.calorie}</td>
            <td>${entry.description}</td>
            <td>${new Date(entry.date).toLocaleDateString()}</td>
          `;
          reportBody.appendChild(row);
        });
      }
    } catch (error) {
      console.error("Error fetching calorie entries:", error);
    }
  }
});