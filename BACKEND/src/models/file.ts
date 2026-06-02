import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'DONE', 'FAILED']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
},
    {
        timestamps: true
    })

export default mongoose.model('file', fileSchema)