const { User } = require('../../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.Register = async (req, res) => {
    const { name, email, password, profile_picture } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        profile_picture
    });

    res.status(201).json();
}

exports.Login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        res.status(400).json({ error: 'invalid credentials.' });
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(400).json({ error: 'invalid password.' });
        return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.status(200).json({ token });
}

exports.Delete = async (req, res) => {
    const { userId } = req.params;

    const user = await User.findOne({
        where: { id: userId }
    });

    if (!user) {
        res.status(404).json({ error: 'user not found.' });
        return;
    }

    await user.destroy();

    res.status(200).json();
}