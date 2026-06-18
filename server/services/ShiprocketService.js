const axios = require('axios');

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

class ShiprocketService {
  constructor() {
    this.email = process.env.SHIPROCKET_EMAIL;
    this.password = process.env.SHIPROCKET_PASSWORD;
    this.token = null;
    this.tokenExpiry = null;
  }

  // Authenticate and get token
  async authenticate() {
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await axios.post(`${SHIPROCKET_BASE_URL}/auth/login`, {
        email: this.email,
        password: this.password,
      });

      this.token = response.data.token;
      this.tokenExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      return this.token;
    } catch (error) {
      console.error('Shiprocket authentication failed:', error.response?.data || error.message);
      throw new Error('Shiprocket authentication failed');
    }
  }

  // Get authenticated headers
  async getHeaders() {
    const token = await this.authenticate();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Create shipment order
  async createShipment(orderData) {
    try {
      const headers = await this.getHeaders();
      
      const payload = {
        order_id: orderData.orderId,
        order_date: new Date().toISOString().split('T')[0],
        pickup_location: orderData.pickupLocation || 'Primary',
        comment: orderData.comment || '',
        billing_customer_name: orderData.customerName,
        billing_last_name: '',
        billing_address: orderData.address,
        billing_address_2: '',
        billing_city: orderData.city,
        billing_pincode: orderData.pincode,
        billing_state: orderData.state,
        billing_country: 'India',
        billing_email: orderData.email || '',
        billing_phone: orderData.phone,
        shipping_is_billing: true,
        order_items: orderData.items.map(item => ({
          name: item.name,
          sku: item.sku || item.id,
          units: item.quantity,
          selling_price: item.price,
        })),
        payment_method: orderData.paymentMode === 'cod' ? 'COD' : 'Prepaid',
        shipping_charges: 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: 0,
        sub_total: orderData.amount,
        length: 10,
        breadth: 10,
        height: 5,
        weight: 0.5,
      };

      const response = await axios.post(
        `${SHIPROCKET_BASE_URL}/orders/create/adhoc`,
        payload,
        { headers }
      );

      return {
        success: true,
        shipment_id: response.data.shipment_id,
        awb_code: response.data.awb_code,
        courier_company_id: response.data.courier_company_id,
        ...response.data,
      };
    } catch (error) {
      console.error('Shiprocket create shipment failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Track shipment
  async trackShipment(awbCode) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(
        `${SHIPROCKET_BASE_URL}/courier/track/awbs?awbs=${awbCode}`,
        { headers }
      );

      return {
        success: true,
        tracking: response.data.tracking_data?.[awbCode] || null,
      };
    } catch (error) {
      console.error('Shiprocket track failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Cancel shipment
  async cancelShipment(shipmentId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(
        `${SHIPROCKET_BASE_URL}/orders/cancel`,
        { ids: [shipmentId] },
        { headers }
      );

      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      console.error('Shiprocket cancel failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Get available couriers
  async getAvailableCouriers(pincode, weight = 0.5) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(
        `${SHIPROCKET_BASE_URL}/courier/serviceability/?pickup_postcode=400001&delivery_postcode=${pincode}&weight=${weight}`,
        { headers }
      );

      return {
        success: true,
        couriers: response.data.available_courier_companies || [],
      };
    } catch (error) {
      console.error('Shiprocket couriers failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }
}

module.exports = new ShiprocketService();
