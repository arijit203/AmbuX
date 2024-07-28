import React, { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
import toast, { Toaster } from 'react-hot-toast';

export default function PhoneNumberPopup({ onSubmit }) {
  const [phoneNo, setPhoneNo] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(null);
  const [countryCode, setCountryCode] = useState('+1');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    setError(null);
    const fullPhoneNumber = `${countryCode}${phoneNo}`;
    try {
      const response = await fetch('/api/sendOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedOtp(data.otp); // Store the OTP for verification
        setOtpSent(true);
        setResendCooldown(30); // Set cooldown for resending OTP
      } else {
        const { error } = await response.json();
        setError(error || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Failed to send OTP');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendOtp();
  };

  const handleOtpSubmit = () => {
    if (otp === generatedOtp.toString()) {
      const fullPhoneNumber = `${countryCode}${phoneNo}`;
      onSubmit(fullPhoneNumber);
      toast.success('OTP verified successfully!');
      window.location.reload();
    } else {
      setError('Incorrect OTP. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-1">
          {otpSent ? 'Enter OTP' : 'Enter Your Phone Number'}
        </h2>
        {otpSent ? (
          <>
            <p className="text-green-600 mb-4">
              OTP sent! Check your phone <span className="text-xs">({countryCode}{phoneNo}).</span>
            </p>          
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              renderInput={(props) => (
                <input
                  {...props}
                  className="border text-center border-gray-600"
                  style={{ width: '50px', height: '50px' }}
                />
              )}
              containerStyle={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                margin: '0 auto',
              }}
            />

            <button
              onClick={handleOtpSubmit}
              className="bg-blue-500 text-white rounded py-2 mt-5 px-4 w-full hover:bg-blue-600"
            >
              Verify OTP
            </button>
            <div className=' flex justify-between'>
            <button
              onClick={() => setOtpSent(false)}
              className="mt-4 text-blue-500 underline"
            >
              Wrong Number?
            </button>
            {resendCooldown > 0 ? (
              <p className="mt-5 text-gray-500">Resend OTP in {resendCooldown}s</p>
            ) : (
              <button
                onClick={handleSendOtp}
                className="mt-5 text-blue-500 underline"
              >
                Resend OTP
              </button>
            )}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-gray-500">Enter your phone number to receive a 4-digit OTP via SMS.</p>            
          <div className="flex items-center">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="border border-gray-300 rounded-l p-2"
              >
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+91">+91 (IN)</option>
                {/* Add more country codes as needed */}
              </select>
              <input
                type="tel"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                placeholder="Enter phone number"
                className="border border-gray-300 rounded-l w-full p-2"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded py-2 px-4 w-full hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
