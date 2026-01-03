// Free Email OTP Service using EmailJS
// No billing required - completely free for up to 200 emails/month

interface SendOtpResponse {
  success: boolean;
  message: string;
  otp?: string;
}

export const sendOtpViaEmail = async (
  phoneNumber: string,
  email?: string
): Promise<SendOtpResponse> => {
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // If email is provided, send via EmailJS (free service)
    if (email) {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        // Send email via EmailJS
        const emailData = {
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: email,
            otp_code: otp,
            phone_number: phoneNumber,
          },
        };

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        if (response.ok) {
          console.log('OTP sent via email to:', email);
          
          // Also send notification to business
          await sendBusinessNotification(phoneNumber, otp, email);
          
          return {
            success: true,
            message: 'OTP sent via email',
            otp,
          };
        }
      }
    }

    // Fallback to demo mode
    console.log(`Demo OTP for ${phoneNumber}: ${otp}`);
    return {
      success: true,
      message: 'Demo mode: OTP generated locally',
      otp,
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return {
      success: true,
      message: 'Demo mode: OTP generated locally',
      otp,
    };
  }
};

// Send notification to business email
const sendBusinessNotification = async (
  phoneNumber: string,
  otp: string,
  customerEmail?: string
) => {
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_BUSINESS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      const emailData = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          to_email: 'yurekagarwal15@gmail.com', // Your business email
          phone_number: phoneNumber,
          customer_email: customerEmail || 'Not provided',
          otp_code: otp,
        },
      };

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      console.log('Business notification sent');
    }
  } catch (error) {
    console.warn('Failed to send business notification:', error);
  }
};
