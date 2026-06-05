"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Trong src/routes/banner.route.ts
const express_1 = require("express");
const banner_controller_1 = require("../controllers/banner.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
router.get('/', banner_controller_1.getActiveBanners);
router.post('/', upload_middleware_1.upload.single('image'), banner_controller_1.createBanner);
router.delete('/:id', banner_controller_1.deleteBanner);
exports.default = router;
