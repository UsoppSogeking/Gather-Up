const { Op } = require('sequelize');
const { Event, User, EventRole } = require('../../models/index');
const { validate: isUuid } = require('uuid');
const moment = require('moment');

function formatDate(dateStr) {
    if (typeof dateStr === 'string' && dateStr.trim() !== '') {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    }
    return null;
}

exports.createEvent = async (req, res) => {

    const userId = req.user.id;
    const { title, description, date, end_date, location } = req.body;

    const user = await User.findOne({
        where: { id: userId }
    });

    if (!user) {
        res.status(400).json({ error: 'user not found.' });
        return;
    }

    const formattedDate = formatDate(date);
    const formattedEndDate = formatDate(end_date);

    const newEvent = await Event.create({
        title,
        description,
        date: formattedDate,
        end_date: formattedEndDate,
        location,
        adm_id: userId,
    });

    await EventRole.create({
        user_id: userId,
        event_id: newEvent.id,
        role: 'admin'
    });

    res.status(201).json(newEvent);
}

exports.editEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;
    const { title, description, date, end_date, location } = req.body;

    const event = await Event.findByPk(eventId);

    if (!event) {
        return res.status(404).json({ error: 'event not found.' });
    }

    const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        return res.status(404).json({ error: 'user not found' });
    }

    const havePermission = await EventRole.findOne({
        where: {
            user_id: userId,
            event_id: eventId,
            role: {
                [Op.in]: ['admin', 'organizer']
            }
        },
    });

    if (!havePermission) {
        return res.status(401).json({ error: 'Você não tem autorização para editar esse evento.' });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) {
        event.date = moment(date, 'DD/MM/YYYY').startOf('day').toDate();
    }

    if (end_date) {
        event.end_date = moment(end_date, 'DD/MM/YYYY').startOf('day').toDate();
    }
    if (location) event.location = location;

    await event.save();

    res.status(200).json();
}

exports.getAllEvents = async (req, res) => {
    const events = await Event.findAll();

    res.status(200).json(events);
}

exports.getEventById = async (req, res) => {
    const { eventId } = req.params;

    if (!isUuid(eventId)) {
        return res.status(400).json({ error: 'Invalid event ID format.' });
    }

    const event = await Event.findByPk(eventId);

    if (!event) {
        res.status(404).json({ error: 'event not found.' });
        return;
    }

    res.status(200).json(event);
}

exports.deleteEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findByPk(eventId);

    if (!event) {
        return res.status(404).json({ error: 'event not found.' });
    }

    const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        return res.status(404).json({ error: 'user not found.' });
    }

    if (userId !== event.adm_id) {
        return res.status(401).json({ error: 'You are not authorized to delete this event.' });
    }

    await event.destroy();

    res.status(200).json({ message: 'Event deleted successfully.' });
}

exports.registerForEvent = async (req, res) => {
    const userId = req.user.id;
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);

    if (!event) {
        return res.status(404).json({ error: 'event not found.' });
    }

    const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        return res.status(404).json({ error: 'user not found.' });
    }

    const existingRole = await EventRole.findOne({
        where: {
            user_id: userId,
            event_id: eventId
        },
    });

    if (existingRole) {
        return res.status(400).json({ error: 'Usuário já está inscrito neste evento.' });
    }

    if (event.adm_id === userId) {
        return res.status(400).json({ error: 'O usuário é administrador do evento.' });
    }

    await EventRole.create({
        user_id: userId,
        event_id: eventId,
        role: 'participant'
    });

    res.status(201).json({ message: 'inscrição concluida com sucesso.' });
}

exports.cancelEventRegistration = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findByPk(eventId);

    if (!event) {
        return res.status(404).json({ error: 'event not found.' });
    }

    const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        return res.status(404).json({ error: 'user not found' });
    }

    const existingRole = await EventRole.findOne({
        where: {
            user_id: userId,
            event_id: eventId,
            role: {
                [Op.not]: 'admin'
            }
        },
    });

    if (!existingRole) {
        return res.status(400).json({ error: 'User is not registered for the event' });
    }

    await existingRole.destroy();

    res.status(200).json({ message: `Your registration for event '${event.title}' has been successfully canceled` });
}

exports.designateRole = async (req, res) => {
    const { userId, eventId } = req.params;
    const loggedUser = req.user.id;

    const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        return res.status(404).json({ error: 'user not found' });
    }

    const event = await Event.findOne({
        where: { id: eventId }
    });

    if (!event) {
        return res.status(404).json({ error: 'event not found' });
    }

    const existingRole = await EventRole.findOne({
        where: {
            user_id: userId,
            event_id: eventId
        },
    });

    if (!existingRole) {
        return res.status(400).json({ error: 'O usuário não está inscrito no evento.' });
    }

    const isAdmin = loggedUser === event.adm_id;

    if (!isAdmin) {
        return res.status(401).json({ error: 'Você não tem permissão para designar funções nesse evento.' });
    }

    const newRole = req.body.role;

    if (newRole !== 'organizer' && newRole !== 'participant') {
        return res.status(400).json({ error: 'Invalid role' });
    }

    await EventRole.update(
        { role: newRole },
        { where: { user_id: userId, event_id: eventId } }
    );

    res.status(200).json({ message: `Role updated to ${newRole} successfully` });
}

exports.removeUserFromEvent = async (req, res) => {
    const { eventId, userIdToRemove } = req.params;
    const adminId = req.user.id;

    const event = await Event.findByPk(eventId);
    if (!event) {
        return res.status(404).json({ error: 'event not found.' });
    }

    if (adminId !== event.adm_id) {
        return res.status(401).json({ error: 'You are not authorized to remove users from this event.' });
    }

    const userRole = await EventRole.findOne({
        where: {
            user_id: userIdToRemove,
            event_id: eventId
        }
    });

    if (!userRole) {
        return res.status(400).json({ error: 'User is not registered for the event.' });
    }

    await userRole.destroy();

    res.status(200).json({ message: 'User successfully removed from the event.' });
}

