const express = require('express');
const router = express.Router({mergeParams: true});
const asyncHandler = require('../helpers/asyncHandler');
const { models } = require('../database');
const User = models.User;
const Task = models.Task;

// get all tasks for a user
const getTasks = asyncHandler(async (req, res) => {
    const user = await User.findOne({where: { uuid: req.params.userUuid }});
    if (!user) {
        res.json({success: false, error: { status: 404, message: 'user not found' }});
        return;
    }

    const tasks = await Task.findAll({where: { userId: user.id }});
    res.json({ success: true, data: { tasks }});

});

// update task for a user
const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findOne({where: { uuid: req.params.taskUuid }});
    if (!task) {
        res.json({success: false, error: { status: 400, message: 'task not found' }});
        return;
    }
    await task.update({
        ...(req.body.content ? {content: req.body.content} : {}),
        ...(req.body.isComplete ? {isComplete: req.body.isComplete} : {})
    });
    res.json({success: true, data: {
        task: {
            uuid: task.uuid,
            content: task.content,
            isComplete: !!(task.isComplete)
        }}
    });
});

// add new task for a user
const addTask = asyncHandler(async (req, res) => {

    const user = await User.findOne({where: { uuid: req.params.userUuid }});
    if (!user) {
        res.status(404).json({success: false, error: { status: 404, message: 'user not found' }});
        return;
    }

    const task = await Task.create({
        uuid: req.body.uuid,
        userId: user.id,
        content: req.body.content,
        isComplete: req.body.isComplete,
    });

    res.json({success: true, data: {
        task: {
            uuid: task.uuid,
            userUuid: user.uuid,
            content: task.content,
            isComplete: task.isComplete
        }}
    });
});

// delete task for a user
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findOne({where: { uuid: req.params.taskUuid }});
    if (!task) {
        res.json({success: false, error: { status: 400, message: 'task not found' }});
        return;
    }

    await Task.destroy({ where: {uuid: req.params.taskUuid}});
    res.json({success: true, data: {
        task: {
            uuid: task.uuid,
            content: task.content,
            isComplete: task.isComplete
        }}
    });
});
router.post('/', asyncHandler(async (req, res, next) => {
    addTask(req, res, next);
}));

router.post('/:taskUuid', asyncHandler(async (req, res, next) => {
    // handle form data submit
    if (req.body.submit === 'post') {
        addTask(req, res, next);
        return;
    }
    if (req.body.submit === 'put') {
        updateTask(req, res, next);
        return;
    }
    if (req.body.submit === 'delete') {
        deleteTask(req, res, next);
        return;
    }
    next();
}));

router.get('/', getTasks);
router.put('/:taskUuid', updateTask);
router.delete('/:taskUuid', deleteTask);

module.exports = router;
