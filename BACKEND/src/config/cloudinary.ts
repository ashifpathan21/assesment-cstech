import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import multer, { type FileFilterCallback } from "multer";
import "dotenv/config";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const multerStorage = multer.diskStorage({
    destination: "./uploads",
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const mime = file.mimetype;

    const isCsv = mime === "text/csv";
    const isExcelXlsx =
        mime ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const isExcelXls =
        mime === "application/vnd.ms-excel";

    if (isCsv || isExcelXlsx || isExcelXls) {
        cb(null, true);
    } else {
        cb(new Error("Only CSV and Excel files are allowed."));
    }
};

export const upload = multer({
    storage: multerStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter,
});

export const uploadToCloudinary = async (
    file: Express.Multer.File
): Promise<UploadApiResponse> => {
    if (!file) {
        throw new Error("No file provided.");
    }

    if (!file.path) {
        throw new Error("File path is missing.");
    }

    return await cloudinary.uploader.upload(file.path, {
        resource_type: "raw", 
        folder: "documents",
        use_filename: true,        
        filename_override: file.originalname ,
        public_id: `doc_${Date.now()}`,
    });
};

export const deleteFromCloudinary = async (publicId: string) => {
    return await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
    });
};