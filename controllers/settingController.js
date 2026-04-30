const prisma = require('../utils/prisma');

const getSettings = async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    // Transform to key-value object
    const config = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSetting = async (req, res) => {
  const { key, value } = req.body;

  try {
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPaymentSettings = async (req, res) => {
  try {
    const settings = await prisma.setting.findUnique({ where: { key: 'payment_methods' } });
    res.json({ success: true, data: settings ? settings.value : {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const bulkUpdateSettings = async (req, res) => {
  const { settings } = req.body;
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ success: false, message: 'Settings object required' });
  }
  try {
    const updates = Object.entries(settings).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    );
    await Promise.all(updates);
    res.json({ success: true, message: 'Settings saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSettings, updateSetting, bulkUpdateSettings, getPaymentSettings };
