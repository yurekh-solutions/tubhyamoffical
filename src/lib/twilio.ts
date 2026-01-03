// Twilio SMS Service
// Note: In production, use a backend API to keep credentials secure

interface SendOtpResponse {
  success: boolean;
  message: string;
  otp?: string;
}

export const sendOtpViaSms = async (phoneNumber: string): Promise<SendOtpResponse> => {
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const twilioNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

    // Check if Twilio is configured
    if (!accountSid || !authToken || !twilioNumber) {
      console.warn('Twilio not configured. Returning demo OTP.');
      return {
        success: true,
        message: 'Demo mode: OTP generated locally',
        otp,
      };
    }

    // Prepare SMS messages
    const customerMessage = `Your Tubhyam verification code is: ${otp}. Valid for 10 minutes.`;
    const businessMessage = `New video call appointment request from +91${phoneNumber}. OTP: ${otp}`;
    
    // Twilio API endpoint
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    // Send OTP to customer
    const customerBody = new URLSearchParams({
      To: `+91${phoneNumber}`,
      From: twilioNumber,
      Body: customerMessage,
    });

    const customerResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: customerBody.toString(),
    });

    if (!customerResponse.ok) {
      const error = await customerResponse.json();
      console.error('Twilio error (customer):', error);
      
      // Fallback to demo mode
      return {
        success: true,
        message: 'Fallback to demo mode',
        otp,
      };
    }

    const customerData = await customerResponse.json();
    console.log('SMS sent to customer:', customerData.sid);

    // Send notification to business number (7039382706)
    const businessBody = new URLSearchParams({
      To: '+917039382706',
      From: twilioNumber,
      Body: businessMessage,
    });

    const businessResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: businessBody.toString(),
    });

    if (businessResponse.ok) {
      const businessData = await businessResponse.json();
      console.log('SMS sent to business:', businessData.sid);
    } else {
      console.warn('Failed to send notification to business number');
    }

    return {
      success: true,
      message: 'OTP sent via SMS',
      otp,
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    
    // Generate OTP for demo fallback
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return {
      success: true,
      message: 'Demo mode: OTP generated locally',
      otp,
    };
  }
};
