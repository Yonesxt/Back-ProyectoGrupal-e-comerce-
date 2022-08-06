const { Router } = require("express");
const router = Router();
const {banUser, upgradeToAdmin} = require('../controllers/admin.controllers')

router.put("/ban", banUser);

router.put("/upgrade", upgradeToAdmin);


module.exports = router;