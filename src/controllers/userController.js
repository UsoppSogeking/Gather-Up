const { User } = require('../../models/index');

exports.getUsers = async (req, res) => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] }
    });

    res.status(200).json(users);
}

exports.getUser = async (req, res) => {
    const { userId } = req.params;

    const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        res.status(404).json({ error: 'user not found.' });
    }

    res.status(200).json(user);
}

exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { name, profile_picture } = req.body;

    const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        res.status(404).json({ error: 'user not found.' });
    }

    if (name) {
        user.name = name;
    }

    if (profile_picture) {
        user.profile_picture = profile_picture;
    }

    await user.save();

    res.status(200).json();
}

