const db = require('../models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


const createProject = catchAsync(async (req, res, next) => {
    try {
        const { projectName, agency } = req.body;

        // Check if the agency exists
        const user = await db.User.findByPk(agency);

        if (!user || user.role !== 'agency') {
            throw new AppError(400, 'Invalid or non-existent agency');
        }

        const project = await db.Project.create({
            projectName,
            agency,
        });

        res.status(201).json({
            status: 'success',
            message: 'Project created successfully',
            data: { project },
        });
    } catch (error) {
        next(error);
    }
});

const updateProjectStatus = catchAsync(async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const { completed } = req.body;

        const project = await db.Project.findByPk(projectId);

        if (!project) {
            throw new AppError(404, 'Project not found');
        }

        project.completed = completed;

        await project.save();

        res.status(200).json({
            status: 'success',
            message: 'Project status updated successfully',
            data: { project },
        });
    } catch (error) {
        next(error);
    }
});

const getAllProjects = catchAsync(async (req, res, next) => {
    try {
        const projects = await db.Project.findAll({
            include: [
                {
                    model: db.User,
                    as: 'user',  // Association alias
                    attributes: ['fullName', 'type'],
                },
            ],
        });

        res.status(200).json({
            status: 'success',
            data: { projects },
        });
    } catch (error) {
        next(error);
    }
});

const deleteProject = catchAsync(async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const project = await db.Project.findByPk(projectId);

        if (!project) {
            throw new AppError(404, 'Project not found');
        }

        await project.destroy();

        res.status(204).json({
            status: 'success',
            message: 'Project deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});


module.exports = {
    createProject,
    getAllProjects,
    deleteProject,
    updateProjectStatus
}