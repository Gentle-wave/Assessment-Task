module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const { getAllAgencies, toggleUserActiveStatus } = require('../controller/admin.controller');
    const { createProject, getAllProjects,
        deleteProject, updateProjectStatus } = require('../controller/projects.controler');
    const { createUser, loginUser,getUserProfile,
        updateProfileForAgencies, updateProfileForAdmin } = require('../controller/user.controller');

    router.post("/signup", createUser);
    router.post("/login", loginUser);
    router.patch('/updateProfile/:userId', updateProfileForAgencies);
    router.get('/authorization', getUserProfile);


    router.post('/createProject', createProject);
    router.get('/getAllProjects/:userId', getAllProjects);
    router.delete('/deleteProject/:projectId', deleteProject);
    router.put('/toggleProjectSatus/:projectId', updateProjectStatus);


    router.get('/getAllAgencies', getAllAgencies);
    router.patch('/updateProfileByAdmin/:userId', updateProfileForAdmin);
    router.patch('/toggleActive/:userId', toggleUserActiveStatus);

    app.use('/api/v1', router)
}