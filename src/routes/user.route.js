const { Router } = require('express');
const router = Router();
const { changeRole, getUserById, getUsers, updateUser, postUser } = require('../controllers/user.controllers');


router.get('/', getUsers)

router.get('/:id', getUserById)

router.put('/role', changeRole)

router.put('/edit/:id', updateUser)

router.post('/', postUser)

module.exports = router;