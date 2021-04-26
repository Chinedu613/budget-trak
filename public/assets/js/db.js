let db;

let dbReq = indexedDB.open('budget', 1);

dbReq.onupgradeneeded = function(event) {
    db = event.target.result;
    // Create an object store named budgeting
    db.createObjectStore('pending', { autoIncrement: true });
};

dbReq.onsuccess = function(event) {
    db = event.target.result;

    // check to see if app is online
    if(navigator.onLine) {
        checkDatabase()
    }
}

dbReq.onerror = function(event) {
    alert('error opening database' + event.target.errorCode);
}

function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(['pending'], 'readwrite');
    // access your pending object store
    const store = transaction.objectStore('pending');
    // add record to your store with add method
    store.add(record);
}

function checkDatabase() {
    // open a transaction on your db
    const transaction = db.transaction(['pending'], 'readwrite');
    // access your pending object store
    const store = transaction.objectStore('pending');
    // get all records from store and set to a variable
    const getAll = store.getAll();
    
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(() => {
                //if successful, open a transaction on your pending db
                const transaction = db.transaction(['pending'], 'readwrite');
                // access your pending object store
                const store = transaction.objectStore('pending');
                // clear all items in store
                store.clear();
            });
        }
    };
}

window.addEventListener('online', checkDatabase);