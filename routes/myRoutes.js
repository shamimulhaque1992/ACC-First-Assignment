const router = require("express").Router();
const { randomUser, allUsers, saveAUser, updateUser, bulkUpdate, deleteUser, } = require("../controllers/controllers.js");
const { ValidSaveUser, validateUser, userIdValid, validManyId, } = require("../middleware/valid.js");

router.get("/random", randomUser);
router.get("/all", allUsers);
router.post("/save", ValidSaveUser, validateUser, saveAUser);
router.patch("/update", userIdValid, updateUser);
router.patch("/bulk-update", validManyId, bulkUpdate);
router.delete("/delete", userIdValid, deleteUser);

module.exports = router;
