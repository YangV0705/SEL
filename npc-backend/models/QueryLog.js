import mongoose from 'mongoose';

const QueryLogSchema = new mongoose.Schema({
    userName: String,
    userSQL: String,
    correctSQL: String,
    npcFeedback: {
        Cipher: String,
        Zen: String,
        Phoebe: String
    },
    timestamp: {
        type: Date,
        default: Date.now
  }
});

export default mongoose.model('QueryLog', QueryLogSchema);
