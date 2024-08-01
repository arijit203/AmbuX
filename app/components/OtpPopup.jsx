import React, { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
import toast from 'react-hot-toast';

export default function OtpPopup({ onSubmit, phoneNumber, onClose }) {
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    console.log("phoneNumber :",phoneNumber)
    if (phoneNumber) {
      console.log("Otp send 1")
      handleSendOtp(phoneNumber);
    }
  }, [phoneNumber]);

  const handleSendOtp = async () => {
    setError(null);
    try {
      const response = await fetch('/api/sendOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneratedOtp(data.otp); // Store the OTP for verification
        setResendCooldown(30); // Set cooldown for resending OTP
      } else {
        const { error } = await response.json();
        toast.error(error || 'Failed to send OTP');
      }
    } catch (error) {
        console.log("response: ",response)
      toast.error('Failed to send OTP');
    }
  };

  const handleOtpSubmit = () => {
    if (otp === generatedOtp.toString()) {
      onSubmit(phoneNumber); // Call the onSubmit function with the phone number
      toast.success('OTP verified successfully!');
    } else {
      toast.error('Incorrect OTP. Please try again.');
    }
  };

  const handleResendOtp = () => {
    handleSendOtp();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-1">
          Enter OTP
        </h2>
        <p className="text-green-600 mb-4">
          OTP sent! Check your phone for the 4-digit code.
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
        <div className='flex justify-between items-center mt-5'>
          <button
            onClick={onClose} // Close the popup when clicked
            className="text-blue-500 underline"
          >
            Change Number?
          </button>
          {resendCooldown > 0 ? (
            <p className="text-gray-500">Resend OTP in {resendCooldown}s</p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-blue-500 underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
