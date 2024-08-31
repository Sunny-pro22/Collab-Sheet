const mongoose = require('mongoose');

const SpreadsheetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  data: {
    type: [[String]], // Array of arrays, each containing strings (can be modified to hold different types if necessary)
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  uid:{
    type: String,
    required: true,
  },
  accessOption:{
    type: String,
    required: true,
  }
});

const SpreadsheetModel = mongoose.model('Spreadsheet', SpreadsheetSchema);

module.exports = SpreadsheetModel;
