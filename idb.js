// Function to open the IndexedDB and setup object stores
function openCaloriesDB(dbName, version) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);

        // Handle database setup
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

// Function to retrieve all calorie items
function getAllCalories(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['calories'], 'readonly');
        const store = transaction.objectStore('calories');
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject('Failed to retrieve calorie data');
        };
    });
}

// Function to retrieve calorie data by category
function getCaloriesByCategory(db, category) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['calories'], 'readonly');
        const store = transaction.objectStore('calories');
        const index = store.index('by_category');
        const request = index.getAll(category);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject('Failed to retrieve calorie data by category');
        };
    });
}

// Function to update a calorie item by ID
function updateCalories(db, id, updatedData) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['calories'], 'readwrite');
        const store = transaction.objectStore('calories');
        const getRequest = store.get(id);

        getRequest.onsuccess = () => {
            const data = getRequest.result;
            if (data) {
                Object.assign(data, updatedData);
                const updateRequest = store.put(data);
                updateRequest.onsuccess = () => {
                    resolve(true);
                };
                updateRequest.onerror = () => {
                    reject('Failed to update calorie data');
                };
            } else {
                reject('No record found');
            }
        };

        getRequest.onerror = () => {
            reject('Failed to retrieve calorie data for update');
        };
    });
}

// Function to delete a calorie item by ID
function deleteCalories(db, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['calories'], 'readwrite');
        const store = transaction.objectStore('calories');
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve(true);
        };

        request.onerror = () => {
            reject('Failed to delete calorie data');
        };
    });
}
