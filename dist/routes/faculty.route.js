"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faculty_controller_1 = require("../controllers/faculty.controller");
const router = (0, express_1.Router)();
router.get('/', faculty_controller_1.getAllFaculties);
router.post('/', faculty_controller_1.createFaculty);
router.delete('/:id', faculty_controller_1.deleteFaculty);
exports.default = router;
