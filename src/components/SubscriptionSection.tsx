import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Code2, 
  Image as ImageIcon, 
  Volume2, 
  CreditCard,
  Building,
  HelpCircle
} from 'lucide-react';
import { UserSubscription } from '../types';

interface SubscriptionSectionProps {
  subscription: UserSubscription;
  onUpgrade: (tier: 'free' | 'pro' | 'enterprise') => void;
}

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  subscription,
  onUpgrade,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'enterprise'>('pro');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa' | 'googlepay'>('card');

  const plans = [
    {
      id: 'free' as const,
      name: 'Starter / Student',
      badge: 'Free Forever',
      priceMonthly: 0,
      priceAnnual: 0,
      description: 'Ideal for students starting out with ICT fundamentals and daily conversational queries.',
      features: [
        '50 AI Chat queries per day',
        'Standard Gemini 3.8 Flash model access',
        'Basic ICT & Programming study answers',
        '3 AI image generations daily',
        'Web Speech voice recognition',
        'Community discussion support',
      ],
      cta: 'Current Plan',
      isPopular: false,
    },
    {
      id: 'pro' as const,
      name: 'Developer & Pro',
      badge: 'Most Popular',
      priceMonthly: 12,
      priceAnnual: 9,
      description: 'Engineered for computer science students, professional developers, and ICT exam candidates.',
      features: [
        'Unlimited AI Chat & Coding queries',
        'Priority Gemini 3.8 Flash & Deep Thinking',
        'Full ICT Study Lab with syntax debuggers',
        'Unlimited AI Image Studio diffusion',
        'Instant SpeechSynthesis & natural TTS voices',
        'Full Chat History persistence & Markdown export',
        'Early access to new engineering features',
      ],
      cta: 'Upgrade to Pro',
      isPopular: true,
    },
    {
      id: 'enterprise' as const,
      name: 'Campus & Enterprise',
      badge: 'Institution Grade',
      priceMonthly: 49,
      priceAnnual: 39,
      description: 'For coding bootcamps, university computer labs, and engineering teams.',
      features: [
        'Everything in Pro plan included',
        'Multi-seat collaboration (up to 25 accounts)',
        'Custom ICT syllabus & exam mock banks',
        'Dedicated server compute & 99.9% uptime SLA',
        'Pass-through Gemini API Key integration',
        '24/7 dedicated engineering mentor support',
      ],
      cta: 'Upgrade to Enterprise',
      isPopular: false,
    },
  ];

  const handleSelectPlan = (planId: 'free' | 'pro' | 'enterprise') => {
    if (planId === 'free') {
      onUpgrade('free');
      return;
    }
    setSelectedPlan(planId);
    setShowCheckoutModal(true);
    setPaymentSuccess(false);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      onUpgrade(selectedPlan);
      setTimeout(() => {
        setShowCheckoutModal(false);
        setPaymentSuccess(false);
      }, 2000);
    }, 1200);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-8 py-8 bg-[#050814] text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Crown className="w-3.5 h-3.5" />
            <span>ENG MANUH AI Subscriptions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Choose Your AI Superpower
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            From free ICT curriculum study to professional software engineering, select the plan designed for your goals.
          </p>

          {/* Billing Switcher */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-12 h-6 rounded-full bg-[#0e163b] border border-slate-700 transition cursor-pointer p-0.5"
            >
              <div
                className={`w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-md transform transition ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
              <span>Annual Billing</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-full font-bold border border-emerald-500/40">
                Save 25%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {plans.map((p) => {
            const isCurrent = subscription.tier === p.id;
            const price = billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly;

            return (
              <div
                key={p.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                  p.isPopular
                    ? 'bg-gradient-to-b from-[#111942] to-[#0a0f2b] border-2 border-purple-500/70 shadow-2xl shadow-purple-900/30 md:-translate-y-2'
                    : 'bg-[#090d24] border border-slate-800 shadow-xl'
                }`}
              >
                {/* Popular Pill */}
                {p.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-[11px] shadow-lg tracking-wider uppercase">
                    {p.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white font-heading">{p.name}</h3>
                    {!p.isPopular && (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 min-h-[32px]">{p.description}</p>

                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-3xl sm:text-4xl font-black text-white font-heading">
                      ${price}
                    </span>
                    <span className="text-xs text-slate-400">
                      {p.priceMonthly === 0 ? '' : '/ month'}
                    </span>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      What's Included:
                    </span>
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to action */}
                <div className="pt-6 mt-6 border-t border-slate-800/60">
                  <button
                    onClick={() => handleSelectPlan(p.id)}
                    disabled={isCurrent}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition shadow-lg cursor-pointer ${
                      isCurrent
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                        : p.isPopular
                        ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-900/40'
                        : 'bg-blue-600/20 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/40'
                    }`}
                  >
                    {isCurrent ? 'Current Active Plan' : p.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature comparison guarantee footer */}
        <div className="p-5 rounded-2xl bg-[#090d24] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-sm">30-Day Money-Back Guarantee</h4>
              <p>Cancel anytime. Secure end-to-end checkout with instant account tier upgrade.</p>
            </div>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">
            Supported: Visa, Mastercard, M-Pesa, Google Pay
          </span>
        </div>
      </div>

      {/* Checkout Simulation Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#090e26] border border-purple-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white font-heading">
                  Upgrade to {selectedPlan.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white font-heading">Upgrade Successful!</h4>
                <p className="text-xs text-slate-300">
                  Your account has been upgraded to <strong>{selectedPlan.toUpperCase()}</strong>. Enjoy unlimited Gemini AI features!
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Order Summary */}
                <div className="p-3.5 rounded-xl bg-[#060a17] border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Plan:</span>
                    <span className="text-white font-semibold capitalize">{selectedPlan} Plan</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Billing:</span>
                    <span className="text-white capitalize">{billingCycle}</span>
                  </div>
                  <div className="flex justify-between text-slate-200 font-bold pt-2 border-t border-slate-800 text-sm">
                    <span>Total Due:</span>
                    <span className="text-emerald-400">
                      ${selectedPlan === 'pro' ? (billingCycle === 'annual' ? 9 : 12) : 39}/mo
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="text-slate-400 font-semibold block">Select Payment Method:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-blue-900/60 border-blue-500 text-white'
                          : 'bg-[#060a17] border-slate-800 text-slate-400'
                      }`}
                    >
                      Credit Card
                    </button>
                    <button
                      onClick={() => setPaymentMethod('mpesa')}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                        paymentMethod === 'mpesa'
                          ? 'bg-emerald-900/60 border-emerald-500 text-white'
                          : 'bg-[#060a17] border-slate-800 text-slate-400'
                      }`}
                    >
                      M-Pesa
                    </button>
                    <button
                      onClick={() => setPaymentMethod('googlepay')}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                        paymentMethod === 'googlepay'
                          ? 'bg-purple-900/60 border-purple-500 text-white'
                          : 'bg-[#060a17] border-slate-800 text-slate-400'
                      }`}
                    >
                      Google Pay
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                {paymentMethod === 'card' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Card Number (4242 •••• •••• 4242)"
                      defaultValue="4242 8899 0012 3456"
                      className="w-full p-2.5 rounded-xl bg-[#060a17] border border-slate-800 text-slate-200"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="12/28"
                        className="p-2.5 rounded-xl bg-[#060a17] border border-slate-800 text-slate-200"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        defaultValue="890"
                        className="p-2.5 rounded-xl bg-[#060a17] border border-slate-800 text-slate-200"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'mpesa' && (
                  <div className="space-y-2">
                    <label className="text-slate-400">Enter M-Pesa Mobile Number:</label>
                    <input
                      type="text"
                      placeholder="e.g. +254 712 345 678"
                      defaultValue="+254 712 345 678"
                      className="w-full p-2.5 rounded-xl bg-[#060a17] border border-slate-800 text-emerald-300 font-mono"
                    />
                    <p className="text-[10px] text-slate-500">
                      An STK push prompt will simulate on your mobile phone screen.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm transition shadow-lg shadow-purple-900/40 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Processing Secure Transaction...' : `Confirm & Activate ${selectedPlan.toUpperCase()}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
