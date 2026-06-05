"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitEvaluation = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const submitEvaluation = async (req, res) => {
    try {
        const { semester, academicYear, scoreI, scoreII, scoreIII, scoreIV, scoreBonus, scorePenalty, userId } = req.body;
        if (!userId || !semester || !academicYear) {
            return res.status(400).json({ error: 'Thiếu thông tin học kỳ hoặc tài khoản sinh viên!' });
        }
        // Tính toán tổng điểm theo quy chế: (I + II + III + IV) + Bonus - Penalty, chặn trần tối đa 100
        let calculatedTotal = (parseInt(scoreI) + parseInt(scoreII) + parseInt(scoreIII) + parseInt(scoreIV)) + parseInt(scoreBonus) - parseInt(scorePenalty);
        if (calculatedTotal > 100)
            calculatedTotal = 100;
        if (calculatedTotal < 0)
            calculatedTotal = 0;
        // Phân loại xếp loại theo khung điểm quy định
        let classification = 'Chưa đạt';
        if (calculatedTotal >= 90)
            classification = 'Xuất sắc';
        else if (calculatedTotal >= 80)
            classification = 'Tốt';
        else if (calculatedTotal >= 70)
            classification = 'Khá';
        else if (calculatedTotal >= 50)
            classification = 'Trung bình';
        const newEvaluation = await prisma_1.default.pointEvaluation.create({
            data: {
                semester,
                academicYear,
                scoreI: parseInt(scoreI),
                scoreII: parseInt(scoreII),
                scoreIII: parseInt(scoreIII),
                scoreIV: parseInt(scoreIV),
                scoreBonus: parseInt(scoreBonus),
                scorePenalty: parseInt(scorePenalty),
                totalScore: calculatedTotal,
                classification,
                userId: parseInt(userId)
            }
        });
        res.status(201).json({ success: true, data: newEvaluation });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi hệ thống khi lưu phiếu điểm rèn luyện' });
    }
};
exports.submitEvaluation = submitEvaluation;
