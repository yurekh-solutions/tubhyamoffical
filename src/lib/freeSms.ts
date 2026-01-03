// SMS Service using Fast2SMS via backend proxy
// Solves CORS issues by routing through local server

interface SendSmsResponse {
  success: boolean;
  message: string;
  otp?: string;
}

export const sendOtpViaSms = async (phoneNumber: string): Promise<SendSmsResponse> => {
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const customerMessage = `Your Tubhyam verification code is ${otp}. Valid for 10 minutes. Do not share this OTP.`;
    const businessMessage = `New video call request from +91${phoneNumber}. OTP: ${otp}`;

    try {
      // Send OTP to customer via backend proxy
      const customerResponse = await fetch('http://localhost:3001/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          message: customerMessage,
        }),
      });

      const customerData = await customerResponse.json();

      if (!customerData.success) {
        console.warn('Failed to send SMS to customer, using demo mode');
        console.log(`📱 Demo OTP for +91${phoneNumber}: ${otp}`);
        return {
          success: true,
          message: 'Demo mode: SMS would be sent in production',
          otp,
        };
      }

      console.log('SMS sent to customer:', customerData);

      // Send notification to business number (7039382706)
      const businessResponse = await fetch('http://localhost:3001/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: '7039382706',
          message: businessMessage,
        }),
      });

      const businessData = await businessResponse.json();
      if (businessData.success) {
        console.log('SMS sent to business:', businessData);
      }

      return {
        success: true,
        message: 'OTP sent via SMS',
        otp,
      };
    } catch (fetchError) {
      console.error('Error with SMS API:', fetchError);
      console.log(`📱 Demo OTP for +91${phoneNumber}: ${otp}`);
      console.log(`📞 Business: New request from +91${phoneNumber}, OTP: ${otp}`);
      return {
        success: true,
        message: 'Demo mode: SMS would be sent in production',
        otp,
      };
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`📱 Demo OTP for +91${phoneNumber}: ${otp}`);
    
    return {
      success: true,
      message: 'Demo mode: OTP generated',
      otp,
    };
  }
};
