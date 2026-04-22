export const downloadInvoice = (order) => {
  const { orderId, date, formData, items, shippingMethod, finalTotal } = order;

  const invoiceContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${orderId}</title>
      <style>
        body { font-family: 'Arial', sans-serif; color: #1a1a1a; padding: 40px; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #c9a84c; padding-bottom: 20px; margin-bottom: 40px; }
        .logo-container { display: flex; align-items: center; gap: 15px; }
        .logo-icon { width: 50px; height: 50px; color: #c9a84c; }
        .logo-text { font-size: 24px; font-weight: bold; color: #c9a84c; text-transform: uppercase; letter-spacing: 2px; }
        .invoice-details { text-align: right; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 14px; color: #888; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #eee; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { text-align: left; background: #f9f9f9; padding: 12px; font-size: 12px; text-transform: uppercase; }
        td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
        .total-section { margin-top: 30px; text-align: right; }
        .total-row { display: flex; justify-content: flex-end; gap: 40px; margin-bottom: 8px; }
        .grand-total { font-size: 20px; font-weight: bold; color: #c9a84c; margin-top: 15px; border-top: 2px solid #c9a84c; pt: 10px; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-container">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"></path>
            <path d="M12 12l3 2 3-5-6-3-6 3 3 5 3-2z"></path>
            <path d="M7 12l5 2 5-2"></path>
          </svg>
          <div>
            <div class="logo-text">You Be The Champ</div>
            <p style="margin:0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Premium Championship Replicas</p>
          </div>
        </div>
        <div class="invoice-details">
          <h2 style="margin:0; color: #c9a84c;">INVOICE</h2>
          <p style="margin:5px 0 0 0;">Order ID: ${orderId}</p>
          <p style="margin:2px 0 0 0;">Date: ${date}</p>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Billing & Shipping Details</div>
        <p><strong>${formData.firstName} ${formData.lastName}</strong></p>
        <p>${formData.address}</p>
        <p>${formData.city}, ${formData.state} ${formData.zip}</p>
        <p>Email: ${formData.email}</p>
        <p>Phone: ${formData.phone}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${item.price.toFixed(2)} AUD</td>
              <td>$${(item.price * item.quantity).toFixed(2)} AUD</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${(finalTotal - (shippingMethod === 'express' ? 25 : 0)).toFixed(2)} AUD</span>
        </div>
        <div class="total-row">
          <span>Shipping (${shippingMethod === 'express' ? 'Express' : 'Standard'}):</span>
          <span>${shippingMethod === 'express' ? '$25.00 AUD' : 'FREE'}</span>
        </div>
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>$${finalTotal.toFixed(2)} AUD</span>
        </div>
      </div>

      <div class="no-print" style="margin-top: 50px; text-align: center;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #c9a84c; color: white; border: none; cursor: pointer; font-weight: bold;">Print Invoice</button>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([invoiceContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${orderId}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
