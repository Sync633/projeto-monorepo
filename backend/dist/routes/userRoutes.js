"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
exports.userRoutes = router;
// Mapeamento dos verbos HTTP
router.get('/', UserController_1.UserController.index);
router.get('/:id', UserController_1.UserController.show);
router.post('/', UserController_1.UserController.create);
router.put('/:id', UserController_1.UserController.update);
router.delete('/:id', UserController_1.UserController.delete);
