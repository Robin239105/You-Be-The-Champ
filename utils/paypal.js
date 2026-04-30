const axios = require('axios');

const generatePayPalAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await axios({
    url: `${process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com'}/v1/oauth2/token`,
    method: 'post',
    data: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  return response.data.access_token;
};

const capturePayPalOrder = async (orderID) => {
  const accessToken = await generatePayPalAccessToken();
  const url = `${process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com'}/v2/checkout/orders/${orderID}/capture`;

  const response = await axios({
    url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

module.exports = { capturePayPalOrder };
