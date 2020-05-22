const { Schema, model } = require('mongoose');

const users = new Schema({
    fio: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatarURL: String,
    resetTolen: String,
    resetTolenExp: Date,
    password: {
        type: String,
        required: true
    },
    confirm: {
        type: String,
        required: true
    },
});

export default model('Users', users);