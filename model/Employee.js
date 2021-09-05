const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employee_id: {
      type: String,
      required: true,
      length: 32
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email:{
        type: String,
        required: true,
        max: 255,
        min: 6
    },    
    phone_number: {
        type: Number,
        required: true,
        length: 10
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Employee', employeeSchema, 'employees')