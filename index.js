const { google } = require("googleapis");

class PantryGoogleSheets {
  constructor(sheetId, auth) {
    this.sheets = google.sheets({ version: "v4", auth });
    this.sheetId = sheetId;
    this.cache = {};

    return new Proxy(this, {
      get: (target, basketName) => {
        if (basketName in target) return target[basketName];
        return target._getBasket(basketName);
      }
    });
  };

  async _getBasket(basketName) {
    if (this.cache[basketName]) return this.cache[basketName];

    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: "Baskets!A:B"
    });

    const rows = res.data.values || [];
    let jsonData = "{}";

    for (const row of rows) {
      if (row[0] === basketName) {
        jsonData = row[1] || "{}";
        break;
      };
    };

    let data = JSON.parse(jsonData);

    const proxy = new Proxy(data, {
      set: async (target, key, value) => {
        target[key] = value;
        await this._updateBasket(basketName, JSON.stringify(target));
        return true;
      }
    });

    this.cache[basketName] = proxy;
    return proxy;
  };

  async _updateBasket(basketName, jsonData) {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: "Baskets!A:A"
    });

    const rows = res.data.values || [];
    let rowIndex = rows.findIndex((row) => row[0] === basketName);

    if (rowIndex === -1) {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: "Baskets!A:B",
        valueInputOption: "USER_ENTERED",
        resource: { values: [[basketName, jsonData]] }
      });
    } else {
      const updateRange = `Baskets!B${rowIndex + 1}`;
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.sheetId,
        range: updateRange,
        valueInputOption: "USER_ENTERED",
        resource: { values: [[jsonData]] }
      });
    };
  };
};

module.exports = PantryGoogleSheets;