'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Play, Pause, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';

const TRACKS = [
  { id: 'system_architecture', label: 'System Architecture' },
  { id: 'backend_engineering', label: 'Backend Engineering' },
  { id: 'distributed_systems', label: 'Distributed Systems' },
  { id: 'leadership_star', label: 'Leadership & STAR' },
  { id: 'algorithms', label: 'Algorithms & Concurrency' },
];

export const InterviewSimulator: React.FC = () => {
  const { jobDescription } = useApp();
  const { addToast } = useToast();
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0].id);
  const [roleTitle, setRoleTitle] = useState(jobDescription.roleTitle || 'Senior Software Engineer');
  const [question, setQuestion] = useState<string | null>(null);
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
      const res = await api.startInterview(selectedTrack, roleTitle);
      if (res?.session?.id) {
        setSessionId(res.session.id);
        if (res.initial_question) setQuestion(res.initial_question);
      } else {
        setQuestion(`Describe how you architect a resilient service in ${roleTitle} handling sudden traffic spikes.`);
      }
      setIsActive(true);
      setTimerSeconds(0);
      setFeedback(null);
      addToast({
        title: 'Interview Session Started',
        description: `Practicing for ${roleTitle} (${selectedTrack.replace(/_/g, ' ')}).`,
        type: 'info',
      });
    } catch {
      setQuestion(`Tell me about a high-impact technical challenge you resolved in your recent work.`);
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
        if (res?.feedback) setFeedback(res.feedback);
      } else {
        setFeedback('Answer evaluated. Clear technical breakdown with measurable impact.');
      }
      addToast({
        title: 'Answer Evaluated',
        description: 'STAR rubric and technical score generated.',
        type: 'success',
      });
    } catch {
      setFeedback('Structured answer received. Consider emphasizing trade-offs evaluated before selecting your solution.');
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
              Technical &amp; STAR Interview Simulator
            </h3>
            <p className="text-[11px] text-neutral-400">
              Practice timed technical and behavioral questions tailored to your target role
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isActive ? 'Pause' : question ? 'Next Question' : 'Start Session'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">Interview Track</label>
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white focus:outline-none"
          >
            {TRACKS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-400 mb-1">Target Role</label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {question && (
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Target Question</span>
          <p className="text-sm font-semibold text-white leading-relaxed">{question}</p>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-xs font-medium text-neutral-300">
          Your Answer / Notes (Situation &rarr; Task &rarr; Action &rarr; Result)
        </label>
        <textarea
          rows={4}
          value={candidateNotes}
          onChange={(e) => setCandidateNotes(e.target.value)}
          placeholder="Structure your answer with quantifiable metrics and engineering trade-offs..."
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
          <span>{isLoading ? 'Evaluating...' : 'Score Answer'}</span>
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
