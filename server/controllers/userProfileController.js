const UserProfile = require('../models/UserProfile');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ user: req.params.userId });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create or Update profile
exports.upsertUserProfile = async (req, res) => {
    try {
        const profile = await UserProfile.findOneAndUpdate(
            { user: req.params.userId },
            { ...req.body, user: req.params.userId },
            { new: true, upsert: true }
        );
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete profile
exports.deleteUserProfile = async (req, res) => {
    try {
        const profile = await UserProfile.findOneAndDelete({ user: req.params.userId });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.status(200).json({ message: 'Profile deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
