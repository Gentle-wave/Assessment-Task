module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        userId: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        fullName: {
            type: DataTypes.TEXT,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Invalid email format',
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
        },
        phoneNumber: {
            type: DataTypes.STRING,
        },
        website: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.ENUM(["agency", "admin"]),
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    });


    return User
}