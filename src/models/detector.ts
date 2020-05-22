const { Schema, model } = require('mongoose');

const detectors = new Schema({
    model_detector: {
        type: String,
        required: true
    },
    name_detector: {
        type: String,
        required: true
    },
    producing_country: {
        type: String,
        required: true
    },
    locationDetectorId: {
        type: Schema.Types.ObjectId,
        require,
        ref: "LocationDetector"
    }
});

export default model('Detectors', detectors);