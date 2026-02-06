const Profile = require('../models/Profile');

exports.getProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find().sort({ createdAt: -1 });
        res.json(profiles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createProfile = async (req, res) => {
    try {
        const profile = new Profile(req.body);
        await profile.save();

        if (req.io) {
            req.io.emit('profile:created', profile);
        }

        res.status(201).json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
