const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

// Update User Profile (Both User and UserProfile models)
exports.updateUserProfile = async (req, res) => {
    try {
        const { name, email, phone, address, occupation, currency } = req.body;
        const userId = req.user.id;

        // Update User basic info
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        try {
            await user.save();
        } catch (saveError) {
            if (saveError.code === 11000) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            throw saveError;
        }

        // Update or Create UserProfile
        let profile = await UserProfile.findOne({ user: userId });

        if (!profile) {
            profile = new UserProfile({
                user: userId,
                phone,
                address,
                occupation,
                currency
            });
        } else {
            if (phone !== undefined) profile.phone = phone;
            if (address !== undefined) profile.address = address;
            if (occupation !== undefined) profile.occupation = occupation;
            if (currency !== undefined) profile.currency = currency;
        }

        await profile.save();

        // Ensure the User document references this profile
        if (!user.profile || user.profile.toString() !== profile._id.toString()) {
            user.profile = profile._id;
            await user.save();
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            profile
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: error.message || 'Server error during update' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('profile');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('profile').populate('transactions');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create user
exports.createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
