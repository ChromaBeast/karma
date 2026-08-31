'use client';

import React, { useState } from 'react';
import { OnboardingStep1 } from '../../components/onboarding/OnboardingStep1';
import { OnboardingStep2 } from '../../components/onboarding/OnboardingStep2';
import { OnboardingStep3 } from '../../components/onboarding/OnboardingStep3';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export default function OnboardingPage() {
  const { setJobDescription, addNode } = useApp();
  const { addToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [roleTitle, setRoleTitle] = useState('Senior Backend Engineer');
  const [targetCompany, setTargetCompany] = useState('Stripe');
  const [seniority, setSeniority] = useState('Senior');
  const [achievement, setAchievement] = useState('');

  const handleStep2Submit = async () => {
    setJobDescription((prev) => ({
      ...prev,
      roleTitle,
      company: targetCompany,
    }));

    if (achievement.trim()) {
      addNode({
        userId: '',
        title: `${roleTitle} Core Achievement`,
        action: achievement.trim(),
        result: 'Measurable latency reduction and high-throughput reliability',
        metrics: { scale: '100k req/s', latencyReduction: '<2ms latency' },
        tags: ['Distributed Systems', 'Go', 'High Concurrency'],
        nodeType: 'achievement',
        source: 'onboarding',
      });
    }

    addToast({
      title: 'First Milestone Ingested',
      description: 'Structured STAR node and knapsack character budget initialized.',
      type: 'success',
    });
    setStep(3);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center max-w-2xl mx-auto px-6 py-12">
      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === s
                ? 'w-8 bg-indigo-500 shadow-sm shadow-indigo-500/50'
                : step > s
                ? 'w-4 bg-emerald-500'
                : 'w-4 bg-neutral-800'
            }`}
          />
        ))}
      </div>

      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl p-8 shadow-2xl">
        {step === 1 && (
          <OnboardingStep1
            roleTitle={roleTitle}
            setRoleTitle={setRoleTitle}
            targetCompany={targetCompany}
            setTargetCompany={setTargetCompany}
            seniority={seniority}
            setSeniority={setSeniority}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <OnboardingStep2
            achievement={achievement}
            setAchievement={setAchievement}
            onBack={() => setStep(1)}
            onNext={handleStep2Submit}
          />
        )}

        {step === 3 && (
          <OnboardingStep3
            roleTitle={roleTitle}
            targetCompany={targetCompany}
            achievement={achievement}
          />
        )}
      </div>
    </div>
  );
}
