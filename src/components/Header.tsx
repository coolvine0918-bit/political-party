import React from 'react';
import { Volume2, VolumeX, Save, Settings, Sparkles, CheckCircle2, User, Hash } from 'lucide-react';
import { sound } from '../utils/sound';

interface HeaderProps {
  studentId: string;
  name: string;
  onStudentIdChange: (val: string) => void;
  onNameChange: (val: string) => void;
  onSaveDraft: () => void;
  onOpenTeacherModal: () => void;
  lastSavedTime: string | null;
  isAutoSaved: boolean;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  studentId,
  name,
  onStudentIdChange,
  onNameChange,
  onSaveDraft,
  onOpenTeacherModal,
  lastSavedTime,
  isAutoSaved,
  isMuted,
  onToggleSound
}) => {
  return (
    <header className="relative w-full max-w-5xl mx-auto mb-8 pt-4 px-3 sm:px-4">
      {/* Top utility bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-sm font-semibold">
        <div className="flex items-center gap-2 bg-[#fdfbf3] px-3.5 py-1.5 rounded-full border-2 border-[#e6dcbf] shadow-sm">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#52b788] animate-pulse"></span>
          <span className="text-[#594a38] font-bold text-xs sm:text-sm">🍃 모여봐요 정당의 숲 아카데미</span>
          <span className="text-xs bg-[#e9f5e1] text-[#386629] px-2 py-0.5 rounded-full font-bold">사회과 탐구</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#faf6e9] text-[#6b583f] rounded-full border-2 border-[#ded4b8] shadow-sm transition active:scale-95 text-xs sm:text-sm"
            title={isMuted ? "효과음 켜기" : "효과음 끄기"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-[#48bb78]" />}
            <span className="hidden sm:inline">{isMuted ? "소리 끔" : "효과음"}</span>
          </button>

          {/* Teacher GAS Modal Button */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenTeacherModal();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fef3c7] hover:bg-[#fde68a] text-[#92400e] rounded-full border-2 border-[#fcd34d] shadow-sm transition active:scale-95 text-xs sm:text-sm font-bold"
          >
            <Settings className="w-4 h-4 text-[#d97706]" />
            <span>교사용 시트 연동</span>
          </button>

          {/* Manual Save Draft Button */}
          <button
            onClick={() => {
              sound.playSaveChime();
              onSaveDraft();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#68d391] hover:bg-[#48bb78] text-white font-bold rounded-full border-2 border-[#38a169] shadow-[0_3px_0_#276749] transition active:translate-y-0.5 active:shadow-none text-xs sm:text-sm"
          >
            <Save className="w-4 h-4" />
            <span>임시저장</span>
          </button>
        </div>
      </div>

      {/* Main Themed Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border-4 border-[#8ed476] bg-gradient-to-b from-[#8fd3f4] via-[#84fab0] to-[#f6f5ec] shadow-xl p-5 sm:p-7">
        {/* Decorative clouds and leaves */}
        <div className="absolute top-3 left-4 flex gap-2 opacity-80 pointer-events-none">
          <div className="w-10 h-4 bg-white/70 rounded-full blur-[0.5px]"></div>
          <div className="w-14 h-5 bg-white/60 rounded-full blur-[0.5px] -ml-2 -mt-1"></div>
        </div>
        <div className="absolute top-4 right-8 flex gap-2 opacity-80 pointer-events-none">
          <div className="w-16 h-5 bg-white/80 rounded-full blur-[0.5px]"></div>
          <div className="w-8 h-4 bg-white/60 rounded-full blur-[0.5px] -ml-3 mt-1"></div>
        </div>

        {/* Floating Animal Crossing Badges */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#ffeb3b]/90 text-[#78350f] px-3 py-1 rounded-full text-xs font-black tracking-wide shadow-sm mb-2 border border-[#fef08a]">
              <Sparkles className="w-3.5 h-3.5 text-[#eab308]" />
              <span>무인도 주민대표 민주 자치 프로젝트</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#234e15] drop-shadow-sm font-ac-title tracking-tight leading-tight">
              모여봐요 <span className="text-[#e25c38]">정당</span>의 숲 🌱
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#2f4d1e] max-w-xl font-medium leading-relaxed">
              정당의 진짜 의미와 가장 중요한 목적, 3대 기능을 배우고 현실 속 사례를 탐구해보세요!
              작성한 답안은 키워드 기반으로 정밀 채점되어 <strong className="text-[#c05621] underline decoration-wavy underline-offset-4">A~E 등급</strong> 리포트가 발급됩니다.
            </p>
          </div>

          {/* Cute Villager Character Bulletin Box */}
          <div className="w-full md:w-auto bg-[#ffffff]/95 border-3 border-[#cde0a5] rounded-2xl p-4 shadow-md max-w-xs shrink-0 text-left relative">
            <div className="absolute -top-3.5 right-4 bg-[#74c653] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full border border-[#5ca83c] shadow-sm">
              너굴 촌장의 안내 📢
            </div>
            <p className="text-xs sm:text-sm text-[#40362b] leading-snug font-medium">
              &quot;구루미 섬의 살기 좋은 내일을 위해 정당에 대해 꼼꼼히 공부하고 나만의 멋진 정당 공약도 만들어보라구리!&quot;
            </p>
            <div className="mt-2.5 pt-2 border-t border-dashed border-[#dfd6be] flex items-center justify-between text-[11px] text-[#716551]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#48bb78]" />
                서술형 자동 임시저장
              </span>
              {lastSavedTime && (
                <span className="text-[#38a169] font-bold">
                  {isAutoSaved ? "자동저장:" : "저장됨:"} {lastSavedTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Student Identification Bar */}
        <div className="relative z-10 mt-6 bg-[#fffef9] border-3 border-[#dfd2b2] rounded-2xl p-4 shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 self-start sm:self-center font-bold text-[#5c4a33] text-sm shrink-0">
              <span className="w-8 h-8 rounded-full bg-[#fbebc2] flex items-center justify-center text-lg">🏷️</span>
              <span>주민대표 정보 :</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
              {/* Student ID */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9c8973]">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => onStudentIdChange(e.target.value)}
                  placeholder="학번 입력 (예: 20401 또는 2학년 4반 1번)"
                  className="w-full pl-9 pr-3 py-2 bg-[#fdfbf6] border-2 border-[#d9ccae] focus:border-[#73be4d] focus:bg-white rounded-xl text-sm font-semibold text-[#413426] placeholder-[#aa9e8a] outline-none transition"
                />
              </div>

              {/* Student Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9c8973]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="이름 입력 (예: 홍길동)"
                  className="w-full pl-9 pr-3 py-2 bg-[#fdfbf6] border-2 border-[#d9ccae] focus:border-[#73be4d] focus:bg-white rounded-xl text-sm font-semibold text-[#413426] placeholder-[#aa9e8a] outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
