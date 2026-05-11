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

const updateSettings = async (req, res) => {
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
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resetSettings = async (req, res) => {
  try {
    // Define default settings
    const defaultSettings = {
      'store_name': 'You Be The Champ',
      'store_email': 'info@youbethechamp.com.au',
      'store_phone': '+1-555-0123',
      'store_address': '123 Championship Lane, Victory City, VC 12345',
      'currency': 'USD',
      'tax_rate': '0.10',
      'shipping_cost': '9.99',
      'free_shipping_threshold': '100',
      'social_facebook': 'https://facebook.com/youbethechamp',
      'social_twitter': 'https://twitter.com/youbethechamp',
      'social_instagram': 'https://instagram.com/youbethechamp',
      'maintenance_mode': 'false'
    };
    
    // Clear existing settings and set defaults
    await prisma.setting.deleteMany({});
    
    const defaultEntries = Object.entries(defaultSettings).map(([key, value]) =>
      prisma.setting.create({ data: { key, value } })
    );
    
    await Promise.all(defaultEntries);
    
    res.json({ success: true, message: 'Settings reset to defaults' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getSettings, 
  updateSetting, 
  updateSettings, 
  bulkUpdateSettings, 
  resetSettings, 
  getPaymentSettings 
};
