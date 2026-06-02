import mongoose from "mongoose";


const agentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    assignedTask: [
        {
            firstName: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            notes: {
                type: String,
                required: true
            }
        }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
},
    {
        timestamps: true
    }
)

export default mongoose.model('agent', agentSchema);