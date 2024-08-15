'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EventRole extends Model {
        static associate(models) {
            this.belongsTo(models.User, { foreignKey: 'user_id' });
            this.belongsTo(models.Event, { foreignKey: 'event_id' });
        }
    };
    EventRole.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        event_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'organizer', 'participant'),
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'EventRole',
    });
    return EventRole;
};
