import express from 'express';
import * as ScheduleController from '../controllers/schedule.controller';
const router = express.Router();

router.get('/:user_id', ScheduleController.getSchedules);
router.post('/', ScheduleController.addOrUpdateSchedules);

export default router;
