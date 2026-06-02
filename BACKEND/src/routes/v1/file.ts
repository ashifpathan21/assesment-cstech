import { Router } from "express";
import { upload } from "../../config/cloudinary.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { deleteFile, uploadFile } from "../../controllers/file.js";

const router = Router()

router.post('/', authMiddleware, upload.single('file'), uploadFile);

router.delete('/:fileId', authMiddleware, deleteFile)

export default router;