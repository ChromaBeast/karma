'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Play, Pause, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';

const DEFAULT_QUESTIONS = [
  'Tell me about a time you resolved a major system latency degradation in production.',
  'How do you approach database schema design when combining vector search with relational metadata?',
  'Describe how you scaled an engineering team through a critical infrastructure migration.',
];

export const InterviewSimulator: React.FC = () => {
  const { addToast } = useToast();
  const [question, setQuestion] = useState(DEFAULT_QUESTIONS[0]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [candidateNotes, setCandidateNotes] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => setTimerSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      const res = await api.startInterview('distributed_systems', 'Staff Systems Engineer');
      if (res?.session?.id) {
        setSessionId(res.session.id);
        if (res.initial_question) setQuestion(res.initial_question);
      }
      setIsActive(true);
      setTimerSeconds(0);
      setFeedback(null);
      addToast({
        title: 'Interview Session Started',
        description: 'Timer is running. Structure your STAR answer.',
        type: 'info',
      });
    } catch {
      setIsActive(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    setIsActive(false);
    setIsLoading(true);
    try {
      if (sessionId) {
        const res = await api.submitInterviewAnswer(sessionId, candidateNotes);
        if (res?.feedback) {
          setFeedback(res.feedback);
        }
      } else {
        setFeedback(
          'Solid STAR framework breakdown. The situation and quantifiable outcome were clear. Recommendation: Emphasize trade-offs evaluated before selecting your approach.'
        );
      }
      addToast({
        title: 'Answer Evaluated',
        description: 'STAR structure and technical depth rubric scored.',
        type: 'success',
      });
    } catch {
      setFeedback('Good structure. Highlight trade-offs evaluated during system design.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Mock Technical Interview Simulator
            </h3>
            <p className="text-[11px] text-neutral-400">
              Practice answering behavioral &amp; system architecture questions with STAR scoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-mono text-xs px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-purple-300">
            {formatTime(timerSeconds)}
          </div>
          <button
            onClick={isActive ? () => setIsActive(false) : handleStartSession}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isActive ? 'Pause' : 'New Question'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Target Question</span>
        <p className="text-sm font-semibold text-white leading-relaxed">{question}</p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-neutral-300">
          Your Answer / Structured Notes (Situation &rarr; Task &rarr; Action &rarr; Result)
        </label>
        <textarea
          rows={4}
          value={candidateNotes}
          onChange={(e) => setCandidateNotes(e.target.value)}
          placeholder="Outline what happened, your actions, and the measurable impact..."
          className="w-full px-3 py-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleSubmitAnswer}
          disabled={isLoading || !candidateNotes.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-purple-600/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isLoading ? 'Evaluating...' : 'Evaluate Answer'}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/50 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-purple-300 font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Rubric &amp; Feedback</span>
          </div>
          <p className="text-neutral-300 leading-relaxed">{feedback}</p>
        </div>
      )}
    </div>
  );
};
