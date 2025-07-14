# SheetStash 🗂️✨

**SheetStash** is a simple and powerful SDK for managing and syncing baskets of JSON data using Google Sheets as a backend. It provides easy access to baskets, automatic synchronization with your Google Sheet, and allows developers to manage data in a clean and intuitive way - all without any server costs. 🚀

## Installation 📦

To install **SheetStash**, use npm:

```bash
npm install sheetstash
```

## Usage 🛠️

### Initialize SheetStash SDK ⚙️

```javascript
const SheetStash = require("sheetstash");
const auth = require("./auth"); // Your Google API auth setup

const pantry = new SheetStash("your-google-sheet-id", auth); // Initialize with Google Sheet ID
```

### Access and Modify a Basket 🧺

```javascript
// Access a basket (e.g., "store")
async function useBasket() {
  const store = await pantry.store; // Access the basket named "store"

  // Modify the basket (this will automatically trigger an update to Google Sheets)
  store.someKey = "newValue"; // Automatically triggers an update to the Sheet! 🔄

  console.log(store); // Output the store data 📋

  // Access another basket (e.g., "cart")
  const cart = await pantry.cart; // Dynamically fetch the basket named "cart"
  console.log(cart);
};

useBasket().catch(console.error);
```

### Disable Caching 🫸

```js
process.env.SHEETSTASH_CHACHING = "0";
```

Disables in-memory caching so every basket fetch hits the backing Google Sheet. Useful for development or when real-time accuracy is more important than speed.

## Features ✨

* **Auto-sync** 🔄: When you modify basket data, it automatically syncs with your Google Sheet.
* **Lazy Loading** ⏳: Baskets are fetched and initialized only when accessed for the first time.
* **Dynamic Basket Access** 🧺: Access baskets directly using `pantry.store`, `pantry.cart`, etc., without explicit function calls.
* **No server or backend costs** 💸: Uses Google Sheets as a free, cloud-hosted JSON store.

## License 📄

Apache License 2.0. See LICENSE file for details.
