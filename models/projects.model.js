module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Projects', {
        projectId: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        projectName: {
            type: DataTypes.TEXT,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        agency: {
            type: DataTypes.STRING,
            references: {
                model: 'users',
                key: 'userId',
            },
        }
    });


    return Project
}