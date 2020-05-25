const {Schema, model} = require('mongoose');

const statewEather = new Schema ({
    pressure: {
        type: Float32Array,
        require,
    },
    humidity: {
        type: Float32Array,
        require,
    },
    temperature: {
        type: Float32Array,
        require
    },
    end: {
        type: Date
    },
    detectorId: {
        type: Schema.Types.ObjectId,
        ref: 'Detectors',
        require
    }
});

export default model('StatewEather', statewEather);