'use client';

import { useState, useEffect, useRef } from 'react';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Phone,
  ShieldCheck,
  ArrowRight,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhoneAuthModal({ isOpen, onClose }: Props) {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  // Handle OTP countdown timer
  useEffect(() => {
    let timer: any;
    if (step === 'OTP' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            setCanResend(true);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Clean up recaptcha verifier when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('PHONE');
      setPhoneNumber('');
      setOtp('');
      setError(null);
      setLoading(false);
      setCountdown(60);
      setCanResend(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const initRecaptcha = () => {
    if (typeof window === 'undefined') return null;
    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-verifier-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            setError('reCAPTCHA expired. Please request OTP again.');
          },
        });
      }
      return recaptchaVerifierRef.current;
    } catch (err) {
      console.warn('Recaptcha init warning:', err);
      return null;
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanNum = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanNum.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    const fullFormattedNumber = `+91${cleanNum}`;
    setLoading(true);

    try {
      const verifier = initRecaptcha();
      if (!verifier) {
        throw new Error('Unable to initialize SMS verification.');
      }

      const confirmation = await signInWithPhoneNumber(auth, fullFormattedNumber, verifier);
      setConfirmationResult(confirmation);
      setStep('OTP');
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      console.error('Error sending phone OTP:', err);
      // Helpful fallback message if app domain or quota is restricted
      if (err.code === 'auth/billing-not-enabled' || err.code === 'auth/quota-exceeded') {
        setError('SMS service is temporarily operating in test mode. You can use test credentials or Google sign-in.');
      } else if (err.code === 'auth/invalid-phone-number') {
        setError('The phone number entered is invalid. Please check and try again.');
      } else {
        setError(err.message || 'Failed to send OTP code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code sent to your phone.');
      return;
    }

    setLoading(true);
    try {
      if (!confirmationResult) {
        throw new Error('Verification session expired. Please request a new code.');
      }

      await confirmationResult.confirm(otp);
      // Successfully authenticated!
      onClose();
    } catch (err: any) {
      console.error('Error verifying OTP code:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('Incorrect OTP code. Please check the SMS and re-enter.');
      } else if (err.code === 'auth/code-expired') {
        setError('OTP code has expired. Please tap "Resend Code".');
      } else {
        setError(err.message || 'Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp('');
    setCountdown(60);
    setCanResend(false);
    handleSendOtp({ preventDefault: () => {} } as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Hidden Recaptcha container */}
      <div id="recaptcha-verifier-container"></div>

      <div className="relative w-full max-w-md bg-[#FFFDF7] dark:bg-[#141414] border border-[rgba(33,29,24,0.15)] dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6F675C] hover:text-[#211D18] dark:text-slate-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#1C3D5A] dark:bg-sky-600 text-white flex items-center justify-center shadow-md">
            <Phone size={26} />
          </div>
          <h2 className="font-serif font-black text-2xl text-[#211D18] dark:text-white">
            {step === 'PHONE' ? 'Sign In with Phone' : 'Enter 6-Digit Code'}
          </h2>
          <p className="text-xs text-[#6F675C] dark:text-slate-400 mt-1.5 leading-relaxed">
            {step === 'PHONE'
              ? 'Enter your mobile number to receive a secure one-time verification code.'
              : `We sent a 6-digit verification code to +91 ${phoneNumber}.`}
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        {/* STEP 1: Phone Number Input */}
        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6F675C] dark:text-slate-400 mb-2">
                Mobile Number
              </label>
              <div className="flex items-center rounded-2xl border-2 border-[rgba(33,29,24,0.15)] dark:border-white/10 bg-white dark:bg-[#1E1E1E] focus-within:border-[#1C3D5A] dark:focus-within:border-sky-400 transition overflow-hidden">
                <span className="px-3.5 py-3 text-xs font-black text-[#1C3D5A] dark:text-sky-300 border-r border-[rgba(33,29,24,0.1)] dark:border-white/10 select-none">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  autoFocus
                  placeholder="Enter 10-digit number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-3 text-sm font-semibold text-[#211D18] dark:text-white bg-transparent focus:outline-none placeholder:text-[#6F675C]/60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phoneNumber.length !== 10}
              className="w-full bg-[#1C3D5A] hover:bg-[#142A3E] dark:bg-sky-600 dark:hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 transition shadow cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending Code...
                </>
              ) : (
                <>
                  Get Verification Code <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-[#6F675C] dark:text-slate-500 leading-normal">
              By proceeding, you agree to DK Times&apos;s Terms of Service and Privacy Policy. Standard SMS charges may apply.
            </p>
          </form>
        ) : (
          /* STEP 2: 6-Digit OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6F675C] dark:text-slate-400">
                  6-Digit OTP
                </label>
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="text-xs text-[#1C3D5A] dark:text-sky-400 font-bold hover:underline"
                >
                  Change Number
                </button>
              </div>

              <input
                type="text"
                maxLength={6}
                autoFocus
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.5em] text-2xl font-black py-3 rounded-2xl border-2 border-[rgba(33,29,24,0.15)] dark:border-white/10 bg-white dark:bg-[#1E1E1E] text-[#211D18] dark:text-white focus:outline-none focus:border-[#1C3D5A] dark:focus:border-sky-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 transition shadow cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} /> Confirm &amp; Sign In
                </>
              )}
            </button>

            {/* Countdown / Resend Code */}
            <div className="text-center pt-2">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-xs font-bold text-[#1C3D5A] dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Resend OTP Code
                </button>
              ) : (
                <p className="text-xs text-[#6F675C] dark:text-slate-400">
                  Resend code in <span className="font-bold text-[#211D18] dark:text-white">{countdown}s</span>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
