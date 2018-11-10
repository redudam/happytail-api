/**
 * @module task.route
 * @author Pavel Fediukovich
 */

'use strict';

const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/task');
const { authorize, ADMIN, ORGANIZATION, LOGGED_USER } = require('../../middlewares/auth');
const {
    listTasks,
    createTask,
    replaceTask,
    updateTask,
} = require('../../validations/task.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('taskId', controller.load);

router
    .route('/')
    /**
     * @api {get} v1/tasks List tasks
     * @apiDescription Get a list of tasks
     * @apiVersion 1.0.0
     * @apiName ListTasks
     * @apiGroup Task
     * @apiPermission all
     *
     * @apiParam  {Number{1-}}         [page=1]     List page
     * @apiParam  {Number{1-100}}      [perPage=1]  Tasks per page
     * @apiParam  {String}             [title]       Task title
     *
     * @apiSuccess {Object[]} tasks List of tasks.
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     */
    .get(validate(listTasks), controller.list)
    /**
     * @api {post} v1/tasks Create Task
     * @apiDescription Create a new task
     * @apiVersion 1.0.0
     * @apiName CreateTask
     * @apiGroup Task
     * @apiPermission organization, admin
     *
     * @apiHeader {String} Authorization  User's access token
     *
     * @apiParam  {String}             title        Task's title
     * @apiParam  {String{6..128}}     description  Task's description
     * @apiParam  {String{..128}}      [name]       User's name
     * @apiParam  {String=user,admin}  [role]       User's role
     *
     * @apiSuccess (Created 201) {String}  id         User's id
     * @apiSuccess (Created 201) {String}  name       User's name
     * @apiSuccess (Created 201) {String}  email      User's email
     * @apiSuccess (Created 201) {String}  role       User's role
     * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
     * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
     */
    .post(authorize([ORGANIZATION, ADMIN]), validate(createTask), controller.create);


router
    .route('/:taskId')
    /**
     * @api {get} v1/tasks/:id Get Task
     * @apiDescription Get task information
     * @apiVersion 1.0.0
     * @apiName GetTask
     * @apiGroup Task
     * @apiPermission all
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .get(controller.get)
    /**
     * @api {put} v1/users/:id Replace User
     * @apiDescription Replace the whole user document with a new one
     * @apiVersion 1.0.0
     * @apiName ReplaceUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Athorization  User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin}  [role]    User's role
     * (You must be an admin to change the user's role)
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .put(authorize([ORGANIZATION, ADMIN]), validate(replaceTask), controller.replace)
    /**
     * @api {patch} v1/users/:id Update User
     * @apiDescription Update some fields of a user document
     * @apiVersion 1.0.0
     * @apiName UpdateUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Athorization  User's access token
     *
     * @apiParam  {String}             email     User's email
     * @apiParam  {String{6..128}}     password  User's password
     * @apiParam  {String{..128}}      [name]    User's name
     * @apiParam  {String=user,admin}  [role]    User's role
     * (You must be an admin to change the user's role)
     *
     * @apiSuccess {String}  id         User's id
     * @apiSuccess {String}  name       User's name
     * @apiSuccess {String}  email      User's email
     * @apiSuccess {String}  role       User's role
     * @apiSuccess {Date}    createdAt  Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
     * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     User does not exist
     */
    .patch(authorize(LOGGED_USER), validate(updateTask), controller.update)
    /**
     * @api {patch} v1/users/:id Delete User
     * @apiDescription Delete a user
     * @apiVersion 1.0.0
     * @apiName DeleteUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Athorization  User's access token
     *
     * @apiSuccess (No Content 204)  Successfully deleted
     *
     * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
     * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
     * @apiError (Not Found 404)    NotFound      User does not exist
     */
    .delete(authorize(ORGANIZATION), controller.remove);



module.exports = router;
