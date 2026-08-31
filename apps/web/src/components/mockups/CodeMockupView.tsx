'use client';

import React from 'react';

interface CodeMockupViewProps {
  code: string;
  language: string;
  filename: string;
  theme: string;
}

export const CodeMockupView: React.FC<CodeMockupViewProps> = ({
  code,
  language,
  filename,
  theme,
}) => {
  const lines = code.split('\n');

  const getThemeBg = () => {
    switch (theme) {
      case 'dracula':
        return 'bg-[#282a36] border-[#6272a4]/40';
      case 'one-dark':
        return 'bg-[#282c34] border-[#5c6370]/40';
      case 'matrix':
        return 'bg-[#0d1117] border-[#238636]/40';
      default:
        return 'bg-[#18181b]/95 border-neutral-700/60';
    }
  };

  return (
    <div
      className={`rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 ${getThemeBg()}`}
    >
      {/* Window Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-sm" />
        </div>

        <div className="text-[11px] font-mono text-neutral-300 font-medium tracking-tight truncate max-w-[200px]">
          {filename || 'snippet.ts'}
        </div>

        <div className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-neutral-400">
          {language}
        </div>
      </div>

      {/* Code Area */}
      <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-indigo-500/40">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                <td className="pr-4 text-right text-neutral-600 select-none w-8 text-[11px]">
                  {idx + 1}
                </td>
                <td className="text-neutral-200 whitespace-pre">
                  {colorizeLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function colorizeLine(line: string): React.ReactNode {
  if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
    return <span className="text-neutral-500 italic">{line}</span>;
  }
  if (line.includes('func ') || line.includes('function ') || line.includes('const ') || line.includes('export ')) {
    return <span className="text-purple-400 font-semibold">{line}</span>;
  }
  if (line.includes('return ') || line.includes('if ') || line.includes('else ') || line.includes('switch ')) {
    return <span className="text-rose-400 font-medium">{line}</span>;
  }
  if (line.includes('"') || line.includes("'") || line.includes('`')) {
    return <span className="text-emerald-300">{line}</span>;
  }
  return <span>{line}</span>;
}
