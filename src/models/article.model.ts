import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    publishAt: {
        type: Date,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        required: false,
    },
    maxPoints: {
        type: Number,
        required: false,
    },
    endTime: {
        type: Date,
        required: false,
    }
});

export const Article = mongoose.model("Article", ArticleSchema);
