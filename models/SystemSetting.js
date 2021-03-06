import mongoose from 'mongoose';

const systemSettingSchema = mongoose.Schema({
  deXuatToiDa: {
    type: Number,
    default: 5
  },
  instance: {
    type: String,
    default: 'DEFAULT'
  }
}, { timestamps: true });

const SystemSetting = mongoose.model('SystemSetting', systemSettingSchema, 'SystemSetting');

export default SystemSetting;