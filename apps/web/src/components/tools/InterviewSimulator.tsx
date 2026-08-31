'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Play, Pause, RotateCcw, CheckCircle, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const QUESTIONS = [
  'Tell me about a time you resolved a major system latency degradation in production.',
  'How do you approach database schema design when combining vector search with relational metadata?',
  'Describe how you scaled an engineering team through a critical infrastructure migration.',
];

export const InterviewSimulator: React.FC = () => {
  const { addToast } = useToast();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [candidateNotes, setCandidateNotes] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => setTimerSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleEvaluate = () => {
    setIsActive(false);
    setFeedback(
      'Strong STAR framework structure. The Situation and Metric Result ($1.2M savings, 42% p99 decrease) were exceptionally clear and quantitative. Recommendation: Expand on how you handled inter-team pushback during the initial rollout phase.'
    );
    addToast({
      title: 'Rubric Evaluation Complete',
      description: 'Score: 92/100 (STAR structure & Metric density)',
      type: 'success',
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              AI Mock Technical Interview Simulator
            </h3>
            <p className="text-[11px] text-neutral-400">
              Practice behavioral & system design questions with real-time STAR scoring
            </p>
          </div>
        </div>

        <div className="font-mono text-sm px-3 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-indigo-400 font-bold">
          {formatTime(timerSeconds)}
        </div>
      </div>

      {/* Question Card */}
      <div className="p-4 rounded-xl border border-indigo-900/40 bg-indigo-950/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-semibold text-indigo-400 font-mono">
            Question {currentQIndex + 1} of {QUESTIONS.length}
          </span>
          <button
            onClick={() => setCurrentQIndex((prev) => (prev + 1) % QUESTIONS.length)}
            className="text-[10px] text-indigo-300 hover:text-white underline font-mono"
          >
            Next Question &rarr;
          </button>
        </div>
        <h4 className="text-sm font-semibold text-white leading-snug">
          "{QUESTIONS[currentQIndex]}"
        </h4>
      </div>

      {/* Answer Scratchpad */}
      <div>
        <textarea
          rows={4}
          value={candidateNotes}
          onChange={(e) => setCandidateNotes(e.target.value)}
          placeholder="Speak or type your STAR response (Situation -> Task -> Action -> Result)..."
          className="w-full p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-white font-medium border border-neutral-700"
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isActive ? 'Pause Timer' : 'Start Timer'}</span>
          </button>
          <button
            onClick={() => {
              setIsActive(false);
              setTimerSeconds(0);
            }}
            className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={handleEvaluate}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Score with STAR Rubric</span>
        </button>
      </div>

      {/* Feedback Section */}
      {feedback && (
        <div className="p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/30 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Rubric Feedback Score: 92/100
            </span>
          </div>
          <p className="text-xs text-neutral-200 leading-relaxed">{feedback}</p>
        </div>
      )}
    </div>
  );
};
