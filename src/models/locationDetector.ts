const {Schema, model} = require('mongoose');

const locationDetector = new Schema ({
    latitude: {
        type: String,
        require,
    },
    longitude: {
        type: String,
        require,
    },
    start: {
        type: Date,
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

export default model('LocationDetector', locationDetector);