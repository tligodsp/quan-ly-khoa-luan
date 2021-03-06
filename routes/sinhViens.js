import express from 'express';

import { getSinhViens, createSinhVien, createManySinhViens, updateSinhVienById,
  deleteSinhVienById, upsertManySinhViens, getSinhVienById, getSinhViensWithQuery
  } from '../controllers/sinhVienCtrl.js';

const router = express.Router();

router.get('/', getSinhViens);
router.post('/q', getSinhViensWithQuery);
router.get('/:id', getSinhVienById);
router.post('/', createSinhVien);
router.post('/create-many/', createManySinhViens);
router.post('/upsert-many/', upsertManySinhViens);
router.post('/:id', updateSinhVienById);
router.delete('/:id', deleteSinhVienById);

export default router;