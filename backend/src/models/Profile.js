const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    service: { type: String, required: true },
    duration: { type: Number, required: true },
    profileData: {
        functions: [{
            name: { type: String },
            file: { type: String },
            selfTime: { type: Number },
            totalTime: { type: Number },
            calls: { type: Number }
        }],
        flamegraph: { type: mongoose.Schema.Types.Mixed }
    },
    summary: {
        totalFunctions: { type: Number },
        hottestFunction: { type: String },
        totalSamples: { type: Number }
    },
    tags: [{ type: String }]
});

module.exports = mongoose.model('Profile', ProfileSchema);
