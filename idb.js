


  "use strict";

let db;

// Function to open the IndexedDB and set up object stores
function openCaloriesDB(dbName, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('calories')) {
        const store = db.createObjectStore('calories', { keyPath: 'id', autoIncrement: true });
        store.createIndex('by_category', 'category', { unique: false });
        store.createIndex('by_date', 'date', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject('Failed to open database');
    };
  });
}

// Function to add calorie consumption item
function addCalories(db, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['calories'], 'readwrite');
    const store = transaction.objectStore('calories');
    const request = store.add(data);

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = () => {
      reject('Failed to add calorie data');
    };
  });
}

// Function to retrieve calorie data by month and year
function getCaloriesByMonthAndYear(db, month, year) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['calories'], 'readonly');
    const store = transaction.objectStore('calories');
    const index = store.index('by_date');
    const range = IDBKeyRange.bound(
      new Date(year, month - 1, 1),
      new Date(year, month, 0, 23, 59, 59, 999)
    );

    const request = index.getAll(range);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject('Failed to retrieve data by month and year');
    };
  });
}

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