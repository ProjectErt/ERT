const mongoose = require('mongoose');

const emergencyEventsSchema = new mongoose.Schema({
    emergency_event_id: {
      type: String,
      required: true,
      length: 32
    },
    emergency_status: {
        type: String,
        required: true,
        max: 255
    },
    safe_employees:{
        type: Array,
        default: []
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('EmergencyEvent', emergencyEventsSchema, 'emergency_events')