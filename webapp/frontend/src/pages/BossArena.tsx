import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Trophy, ShieldCheck, Code, Clock, Zap, RefreshCw, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HologramFrame from '../components/HologramFrame';

export default function BossArena() {
  const { bossBattle, fetchBossChallenge, submitBossSolution, isLoading } = useAppStore();
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBossChallenge();
  }, [fetchBossChallenge]);

  useEffect(() => {
    if (bossBattle && bossBattle.status === 'ACTIVE') {
      const due = new Date(bossBattle.due_date).getTime();
      const diff = Math.max(0, Math.floor((due - Date.now()) / 1000));
      setTimeLeft(diff);
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [bossBattle]);

  const formatTimer = (secs: number) => {
    const hrs = Math.floor(secs / 3600).toString().padStart(2, '0');
    const mins = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const scs = (secs % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${scs}`;
  };

  const handleSubmit = async () => {
    if (!bossBattle || !code.trim() || isEvaluating) return;
    
    setIsEvaluating(true);
    setEvaluationResult(null);
    
    const res = await submitBossSolution(bossBattle.id, code);
    setEvaluationResult(res);
    setIsEvaluating(false);
  };

  if (isLoading && !bossBattle) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center font-mono text-cyan-500/70">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mb-2" />
        <span>Summoning Dungeon Boss Parameters...</span>
      </div>
    );
  }

  if (!bossBattle) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center font-mono text-cyan-500/70 p-6 text-center max-w-md mx-auto">
        <ShieldAlert className="w-12 h-12 text-cyan-500/30 mb-2" />
        <span>No Boss Challenge is currently unlocked. Progress through daily milestones to awaken the Gatekeeper.</span>
      </div>
    );
  }

  return (
    <HologramFrame maxWidth="max-w-7xl">
      <div className="space-y-4 font-mono pb-2 text-cyan-100">
        
        {/* HEADER CARD (COMPACT) */}
        <div className="holo-panel holo-panel-brackets p-3 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.15)] border-red-500/40">
          <div className="absolute inset-0 bg-red-950/5 pointer-events-none animate-pulse" />
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-2">
              <span className="bg-red-950/40 text-red-400 border border-red-500/30 text-[8px] uppercase font-extrabold px-1.5 py-0.5 rounded-sm">
                DUNGEON BOSS BATTLE
              </span>
              <span className="text-[8px] text-cyan-500/50 uppercase tracking-widest font-bold">Tier Assessment</span>
            </div>
            <h2 className="text-lg font-extrabold uppercase text-white tracking-wide drop-shadow-[0_0_6px_rgba(239,68,68,0.3)] leading-none">{bossBattle.title}</h2>
            <p className="text-[10px] text-gray-400 max-w-2xl leading-snug line-clamp-1">{bossBattle.description}</p>
          </div>

          {/* Time remaining counter */}
          {bossBattle.status === 'ACTIVE' && !evaluationResult && (
            <div className="bg-slate-950/80 border border-red-500/40 px-3 py-1.5 rounded-sm flex items-center gap-2.5 shadow-[0_0_10px_rgba(239,68,68,0.2)] shrink-0 relative z-10">
              <Clock className="w-4 h-4 text-red-500 animate-pulse" />
              <div>
                <span className="text-[7px] text-gray-500 uppercase block font-bold tracking-wider leading-none mb-0.5">Countdown</span>
                <span className="text-sm font-extrabold tracking-wider text-red-500 leading-none">
                  {formatTimer(timeLeft)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* LEFT COLUMN: Workspace/Submit or Results */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="wait">
              {!evaluationResult ? (
                <motion.div 
                  key="workspace"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="holo-panel rounded-sm flex flex-col overflow-hidden h-[340px]"
                >
                  {/* Workspace Header */}
                  <div className="bg-slate-950 p-2 border-b border-cyan-500/20 flex justify-between items-center text-[10px] font-mono text-cyan-500/60 uppercase font-bold tracking-wider">
                    <div className="flex items-center gap-1.5 text-cyan-400">
                      <Code className="w-3.5 h-3.5" />
                      <span>Hunter Code Workspace (Python/SQLModel)</span>
                    </div>
                    <span>UTF-8 Buffer</span>
                  </div>

                  {/* Textarea Codebox */}
                  <textarea
                    placeholder={`# Write your solution code here.
# Include database setups, schema declarations, and FastAPI endpoints.
from sqlmodel import SQLModel, Field, create_engine
...`}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 bg-slate-950/20 p-3 text-[11px] font-mono text-gray-200 outline-none resize-none leading-relaxed border-none focus:ring-0 select-text"
                  />

                  {/* Submission Actions */}
                  <div className="p-2 border-t border-cyan-500/20 bg-slate-950 flex justify-between items-center">
                    <span className="text-[8px] text-cyan-500/50 uppercase font-bold tracking-wider">Check required specs before conceiving</span>
                    <button
                      onClick={handleSubmit}
                      disabled={isEvaluating || !code.trim() || timeLeft <= 0}
                      className="bg-red-950/40 hover:bg-red-900 border border-red-500/50 hover:border-red-500 text-red-200 font-extrabold py-1 px-4 rounded-sm text-[10px] uppercase tracking-widest shadow-[0_0_8px_rgba(239,68,68,0.25)] flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      {isEvaluating ? (
                        <RefreshCw className="w-3 animate-spin" />
                      ) : (
                        <Zap className="w-3 h-3 text-red-200" />
                      )}
                      <span>{isEvaluating ? 'Evaluating...' : 'Conceive Submission'}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`holo-panel rounded-sm p-4 border-2 space-y-3 ${
                    evaluationResult.passed ? 'border-green-500/40 bg-green-950/15' : 'border-red-500/40 bg-red-950/15'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded border ${
                      evaluationResult.passed ? 'bg-green-950/40 text-green-400 border-green-500/40' : 'bg-red-950/40 text-red-400 border-red-500/40'
                    }`}>
                      {evaluationResult.passed ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-base font-bold uppercase tracking-wider text-white font-mono drop-shadow-[0_0_6px_rgba(255,255,255,0.2)] leading-none">
                        {evaluationResult.passed ? 'VICTORY: BOSS CONQUERED' : 'DEFEAT: PARAMETER FAIL'}
                      </h3>
                      <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-wider leading-none">
                        System Evaluation Score: <span className="font-extrabold text-white">{evaluationResult.score}%</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded border border-cyan-500/20 text-[10px] leading-relaxed text-gray-300 font-mono whitespace-pre-wrap select-text max-h-[160px] overflow-y-auto">
                    {evaluationResult.feedback}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[10px] font-mono py-0.5">
                    <div className="bg-slate-950/40 p-2 rounded border border-cyan-500/20">
                      <span className="text-gray-500 block uppercase text-[8px] font-bold">XP Gained</span>
                      <span className="text-xs font-bold text-cyan-400">+{evaluationResult.xp_earned} XP</span>
                    </div>
                    <div className="bg-slate-950/40 p-2 rounded border border-cyan-500/20">
                      <span className="text-gray-500 block uppercase text-[8px] font-bold">Gold Wealth</span>
                      <span className="text-xs font-bold text-cyan-400">+{evaluationResult.gold_earned} G</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 py-2 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Conclude Boss Arena & Claim Rewards
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Requirements & Details */}
          <div className="space-y-4 font-mono text-[11px] h-full flex flex-col justify-between">
            
            {/* Boss requirements list */}
            <div className="holo-panel p-4 rounded-sm space-y-3 bg-slate-950/40 flex-1 flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-cyan-500/25 pb-1.5">
                <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Assessment Specs</span>
              </h3>

              <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1 flex-1">
                {bossBattle.content?.requirements?.map((req: string, idx: number) => (
                  <div key={idx} className="flex gap-2 items-start bg-slate-950/60 border border-cyan-500/20 p-2.5 rounded-sm">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300 leading-snug">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reward Specs */}
            <div className="holo-panel p-4 rounded-sm space-y-2 bg-slate-950/40">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 border-b border-cyan-500/25 pb-1">
                Conquer Loot Rewards
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950/60 p-2 rounded border border-cyan-500/20 text-center">
                  <span className="text-[8px] text-gray-500 block uppercase font-bold">XP Loot</span>
                  <span className="text-xs font-bold text-cyan-400">+{bossBattle.xp_reward} XP</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded border border-cyan-500/20 text-center">
                  <span className="text-[8px] text-gray-500 block uppercase font-bold">Gold Loot</span>
                  <span className="text-xs font-bold text-cyan-400">+{bossBattle.gold_reward} G</span>
                </div>
              </div>
              <div className="text-[8px] text-cyan-500/40 text-center leading-relaxed uppercase">
                Provides S-Rank eligibility upgrade.
              </div>
            </div>

          </div>

        </div>

      </div>
    </HologramFrame>
  );
}
