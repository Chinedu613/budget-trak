let db;
let dbReq = indexedDB.open('budget', 1);

dbReq.onupgradeneeded = function(event) {
    db = event.target.result;
    // Create an object store named budgeting
    let budgeting = db.createObjectStore('budgeting', {
        autoIncrement: true
    });
};

dbReq.onsuccess = function(event) {
    db = event.target.result;
}

dbReq.onerror = function(event) {
    alert('error opening database' + event.target.errorCode);
}
