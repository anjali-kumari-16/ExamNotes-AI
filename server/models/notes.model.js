import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    classLevel: {
        type: String,
        required: true
    },
    examType: {
        type: String,
        required: true
    },
    revisionMode: {
        type: Boolean,
        default: false
    },
    includeDiagram: {
        type: Boolean,
        default: false
    },
    includeChart: {
        type: Boolean,
        default: false
    },
    content: {
        type: Object, // Structured content from AI
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notes = mongoose.model("Notes", notesSchema);
export default Notes;
