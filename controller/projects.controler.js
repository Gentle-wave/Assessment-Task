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

        // Find the project by its ID
        const project = await db.Project.findByPk(projectId);

        if (!project) {
            throw new AppError(404, 'Project not found');
        }

        // Toggle the 'completed' field (true -> false, false -> true)
        project.completed = !project.completed;

        // Save the updated project
        await project.save();

        // Send response with updated project
        res.status(200).json({
            status: 'success',
            message: 'Project status updated successfully',
            isCompleted: project.completed
        });
    } catch (error) {
        next(error);
    }
});

const getAllProjects = catchAsync(async (req, res, next) => {
    try {
        const { userId } = req.params; // Assuming userId is sent as a URL parameter

        // Fetch projects associated with the specified userId
        const projects = await db.Project.findAll({
            where: { agency: userId }, // Filter by userId
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