import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { motion } from 'framer-motion';
import { 
  Trophy, Flame, Shield, Award, CheckCircle, 
  Play, Lock, Calendar, Star, Compass, Clock, Zap, ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HologramFrame from '../components/HologramFrame';

export default function Dashboard() {
  const { user, dailies, roadmap, fetchDailies, fetchRoadmap, completeQuest } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDailies();
    fetchRoadmap();
  }, [fetchDailies, fetchRoadmap]);

  if (!user) return null;

  // Level Up requirement calculation (level * 1000)
  const xpNeeded = user.level * 1000;
  const xpPercentage = Math.min((user.xp / xpNeeded) * 100, 100);

  // Filter out Main Quests from dailies
  const activeDailies = dailies.filter(q => q.type === 'DAILY' || q.type === 'RECOVERY');
  const recoveryQuest = dailies.find(q => q.type === 'RECOVERY');
  
  // Find current active Main Quest
  const activeMain = roadmap.find(q => q.status === 'ACTIVE');

  // Simple hardcoded activity heatmap for demo visualization
  const mockHeatmap = [
    { day: 'Mon', mins: 45, level: 2 },
    { day: 'Tue', mins: 120, level: 4 },
    { day: 'Wed', mins: 0, level: 0 },
    { day: 'Thu', mins: 60, level: 3 },
    { day: 'Fri', mins: 30, level: 1 },
    { day: 'Sat', mins: 180, level: 4 },
    { day: 'Sun', mins: 90, level: 3 }
  ];

  return (
    <HologramFrame maxWidth="max-w-7xl">
      <div className="space-y-4 font-mono pb-2">
      
      {/* 1. HUNTER STATUS ROW (COMPACT) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Hunter Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 holo-panel holo-panel-brackets p-4 rounded-sm relative overflow-hidden shadow-rpg-glow flex flex-col justify-center"
        >
          <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-rpg-gold/5 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Avatar & Rank Plate */}
            <div className="relative">
              <div className="w-14 h-14 rounded-lg bg-rpg-dark border-2 border-rpg-gold flex items-center justify-center text-rpg-gold shadow-rpg-glow relative">
                <Shield className="w-8 h-8" />
                <span className="absolute bottom-[-6px] right-[-6px] bg-rpg-gold text-rpg-bg text-[8px] font-bold uppercase px-1 py-0.5 rounded border border-rpg-border">
                  LV {user.level}
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-1.5 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-xl font-extrabold tracking-wide uppercase text-white leading-none">{user.name}</h2>
                <div className={`inline-block self-center px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase border font-mono ${
                  user.rank.includes('S') ? 'bg-red-950/40 text-red-400 border-red-500 shadow-rank-glow' :
                  user.rank.includes('A') ? 'bg-orange-950/40 text-orange-400 border-orange-500' :
                  user.rank.includes('B') ? 'bg-purple-950/40 text-purple-400 border-purple-500' :
                  'bg-rpg-dark text-gray-400 border-rpg-border'
                }`}>
                  {user.rank}
                </div>
              </div>
              
              {/* XP Progression Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] uppercase font-mono text-gray-400">
                  <span>EXP Progress</span>
                  <span>{user.xp} / {xpNeeded} XP</span>
                </div>
                <div className="w-full bg-rpg-dark h-2 rounded border border-rpg-border overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercentage}%` }}
                    transition={{ duration: 1 }}
                    className="bg-gradient-to-r from-rpg-xp to-indigo-500 h-full rounded shadow-xp-glow"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Currency & Streak widgets */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="holo-panel p-4 rounded-sm flex flex-col justify-center relative overflow-hidden"
          >
            <div className="text-gray-400 uppercase text-[9px] font-mono tracking-wider">Gold Wealth</div>
            <div className="text-2xl font-extrabold text-rpg-gold tracking-wide mt-1">
              {user.gold} <span className="text-xs font-mono font-bold text-rpg-gold/80">G</span>
            </div>
            <div className="text-[8px] text-gray-500 font-mono mt-1">Earned in battles</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="holo-panel p-4 rounded-sm flex flex-col justify-center relative overflow-hidden"
          >
            <div className="text-gray-400 uppercase text-[9px] font-mono tracking-wider">Active Streak</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-orange-500">{user.streak}</span>
              <span className="text-[10px] text-gray-400 uppercase font-mono">Days</span>
              <Flame className="w-4 h-4 text-orange-500 animate-pulse inline self-center ml-1" />
            </div>
            <div className="text-[8px] text-gray-500 font-mono mt-1">Consecutive Quests</div>
          </motion.div>
        </div>
      </div>

      {/* 2. QUEST BOARD & HEATMAP & BOSS (THREE COLUMNS FOR MAXIMUM DENSITY) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Side: Daily Quests */}
        <div className="holo-panel holo-panel-brackets p-4 rounded-sm flex flex-col justify-between space-y-3 h-full">
          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-wide uppercase text-white font-mono border-b border-rpg-border pb-1.5 flex items-center gap-2">
              <Compass className="w-4 h-4 text-rpg-gold" />
              <span>Daily Quest Log</span>
            </h3>

            {/* Recovery Warning Indicator */}
            {recoveryQuest && (
              <div className="p-2.5 bg-red-950/30 border border-red-500/40 rounded-sm text-red-200 text-xs font-mono flex flex-col gap-1 shadow-rank-glow">
                <div className="flex items-center gap-1.5 text-red-400 font-bold uppercase tracking-wider text-[10px]">
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                  <span>Recovery Lock</span>
                </div>
                <p className="text-[10px] text-gray-300 leading-tight">
                  Milestones locked. Complete the Recovery Quest to resume.
                </p>
              </div>
            )}

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {activeDailies.map((quest) => (
                <div 
                  key={quest.id}
                  className={`p-2.5 rounded-lg bg-rpg-dark/70 border flex flex-col justify-between gap-2 transition-all ${
                    quest.status === 'COMPLETED' 
                      ? 'border-green-950 bg-green-950/5 opacity-60' 
                      : quest.type === 'RECOVERY'
                      ? 'border-red-500/40 hover:border-red-500'
                      : 'border-rpg-border hover:border-rpg-gold'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] uppercase font-mono font-bold px-1 py-0.2 rounded border ${
                        quest.type === 'RECOVERY' ? 'bg-red-950 text-red-400 border-red-500/30' : 'bg-rpg-card text-rpg-gold border-rpg-gold'
                      }`}>
                        {quest.type}
                      </span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wide truncate">{quest.title}</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 line-clamp-2 leading-snug">{quest.description}</p>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-rpg-border/20">
                    <div className="flex gap-2 text-[9px] font-mono text-gray-500">
                      <span>+{quest.xp_reward}XP</span>
                      <span>+{quest.gold_reward}G</span>
                    </div>

                    <button
                      onClick={() => completeQuest(quest.id)}
                      disabled={quest.status === 'COMPLETED'}
                      className={`py-0.5 px-2.5 rounded text-[9px] uppercase font-extrabold tracking-wider transition-all border ${
                        quest.status === 'COMPLETED'
                          ? 'bg-transparent text-green-500 border-green-500/20 cursor-default'
                          : quest.type === 'RECOVERY'
                          ? 'bg-red-950 text-red-300 border-red-500/40 hover:bg-red-900'
                          : 'bg-rpg-dark/90 text-rpg-gold border-rpg-gold/30 hover:border-rpg-gold'
                      }`}
                    >
                      {quest.status === 'COMPLETED' ? 'Conquered' : 'Conquer'}
                    </button>
                  </div>
                </div>
              ))}

              {activeDailies.length === 0 && (
                <div className="text-center py-6 text-[10px] text-gray-500 font-mono italic">
                  All parameters complete.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Side: Main Quest Checklist */}
        <div className="holo-panel holo-panel-brackets p-4 rounded-sm flex flex-col justify-between space-y-3 h-full">
          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-wide uppercase text-white font-mono border-b border-rpg-border pb-1.5 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Main Quest Milestone</span>
            </h3>

            {activeMain ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <h4 className="font-extrabold text-purple-300 uppercase truncate max-w-[170px]">{activeMain.title}</h4>
                  <span className="text-rpg-gold uppercase text-[9px] bg-purple-950/20 border border-purple-500/30 px-1 py-0.2 rounded">Week {activeMain.week_number}</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-snug line-clamp-3">{activeMain.description}</p>
                
                {/* Core Topics Checklist */}
                {activeMain.content?.topics && (
                  <div className="pt-1.5 space-y-1.5">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Chapter Modules</span>
                    <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
                      {activeMain.content.topics.map((topic: string) => (
                        <div key={topic} className="flex items-center gap-2 bg-rpg-dark/50 border border-rpg-border/20 p-1.5 rounded text-[10px] text-gray-300 font-mono">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                          <span className="truncate">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-[10px] text-gray-500 font-mono italic">
                No active chapter milestone. Enter onboarding to define parameters.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Heatmap and Boss Battle Gateway */}
        <div className="space-y-4 flex flex-col justify-between h-full">
          {/* Weekly Heatmap Widget */}
          <div className="holo-panel p-4 rounded-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rpg-gold" />
              <span>Training Consistency</span>
            </h3>
            
            {/* Heatmap Grid */}
            <div className="grid grid-cols-7 gap-1.5 pt-1 text-center">
              {mockHeatmap.map((day) => (
                <div key={day.day} className="flex flex-col items-center gap-1">
                  <div 
                    className={`w-6 h-6 rounded border transition-all ${
                      day.level === 0 ? 'bg-rpg-dark/55 border-rpg-border/50' :
                      day.level === 1 ? 'bg-amber-900/30 border-amber-800/40' :
                      day.level === 2 ? 'bg-amber-800/50 border-amber-700/50' :
                      day.level === 3 ? 'bg-amber-600/70 border-rpg-gold/60' :
                      'bg-rpg-gold text-rpg-bg border-white shadow-rpg-glow'
                    }`}
                    title={`${day.mins} minutes studied`}
                  />
                  <span className="text-[8px] font-mono text-gray-500">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Boss Battle Gateway */}
          <div className="holo-panel holo-panel-brackets p-4 rounded-sm space-y-3 relative overflow-hidden border-red-950/40 shadow-rank-glow flex-1 flex flex-col justify-center">
            <div className="absolute inset-0 bg-red-950/5 pointer-events-none animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-red-500 font-mono flex items-center gap-1.5 border-b border-red-950/40 pb-1.5 relative z-10">
              <Trophy className="w-3.5 h-3.5 text-red-500" />
              <span>Boss Battle Active</span>
            </h3>
            <p className="text-[10px] text-gray-400 leading-snug relative z-10 line-clamp-3">
              Deploy a secure REST API before the timer expires to achieve Hunter Rank promotion.
            </p>
            <button
              onClick={() => navigate('/boss')}
              disabled={!!recoveryQuest}
              className="w-full bg-red-950/80 hover:bg-red-900 border border-red-500/50 hover:border-red-500 text-red-200 py-1.5 rounded font-bold uppercase text-[9px] tracking-widest shadow-rank-glow transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <Play className="w-3 h-3 fill-red-200" /> Enter Dungeon Arena
            </button>
          </div>
        </div>

      </div>

      </div>
    </HologramFrame>
  );
}

