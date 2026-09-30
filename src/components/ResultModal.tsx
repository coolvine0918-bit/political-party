import React from 'react';
import { SubmissionResult } from '../types';
import { getGradeDescription } from '../utils/grading';
import { X, Award, CheckCircle2, AlertCircle, Printer, RotateCcw, CloudCheck, CloudOff } from 'lucide-react';
import { sound } from '../utils/sound';

interface ResultModalProps {
  result: SubmissionResult;
  onClose: () => void;
  onRetry: () => void;
  gasStatus: 'idle' | 'success' | 'failed' | 'not_configured';
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  onClose,
  onRetry,
  gasStatus
}) => {
  const gradeInfo = getGradeDescription(result.grade);

  const handlePrint = () => {
    sound.playPop();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#fffef9] border-4 border-[#8ed476] rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#69cb3f] to-[#48bb78] px-5 py-4 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
              📜
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-ac-title">
                정당의 숲 아카데미 성적표 및 채점 피드백
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                제출일시: {result.submittedAt}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Student & Grade Summary Banner */}
          <div className="bg-[#fcfaf2] border-3 border-[#e8dfc7] rounded-2xl p-5 relative overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Student info */}
              <div className="space-y-1 sm:border-r border-[#e0d6bc] sm:pr-4">
                <span className="text-xs font-bold text-[#8c7a62]">수험생 정보</span>
                <div className="text-base font-extrabold text-[#382b1d]">
                  {result.name || '무명 주민'} ({result.studentId || '학번 미입력'})
                </div>
                <div className="text-xs text-[#71614b] flex items-center gap-1 mt-1">
                  {gasStatus === 'success' ? (
                    <span className="text-[#38a169] font-bold flex items-center gap-1">
                      <CloudCheck className="w-3.5 h-3.5" />
                      구글 시트 기록 완료
                    </span>
                  ) : gasStatus === 'failed' ? (
                    <span className="text-[#e53e3e] font-bold flex items-center gap-1">
                      <CloudOff className="w-3.5 h-3.5" />
                      구글 시트 연동 오류 (로컬 보관됨)
                    </span>
                  ) : (
                    <span className="text-[#718096] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#48bb78]" />
                      앱 내 기록 보관됨
                    </span>
                  )}
                </div>
              </div>

              {/* Total Score */}
              <div className="text-center sm:border-r border-[#e0d6bc] sm:pr-4">
                <span className="text-xs font-bold text-[#8c7a62]">최종 취득 점수</span>
                <div className="text-3xl sm:text-4xl font-black text-[#2e5318] font-ac-title tracking-tight mt-0.5">
                  {result.totalScore} <span className="text-lg font-bold text-[#688a53]">/ 100점</span>
                </div>
              </div>

              {/* Grade Stamp */}
              <div className="flex flex-col items-center justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border-3 border-dashed border-[#e67e22] bg-[#fff5eb] shadow-sm transform -rotate-1">
                  <Award className="w-6 h-6 text-[#d35400]" />
                  <div className="text-left">
                    <span className="text-[10px] font-black text-[#b45309] block uppercase tracking-wider">
                      등급 급간
                    </span>
                    <span className="text-2xl font-black text-[#c0392b] font-ac-title leading-none">
                      {result.grade} 등급
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#8c6b45] mt-1.5">
                  {gradeInfo.title}
                </span>
              </div>
            </div>

            {/* Villager Comment Speech Bubble */}
            <div className="mt-4 p-3.5 bg-white border-2 border-[#dfd4b7] rounded-xl text-xs sm:text-sm text-[#4a3f32] leading-relaxed relative">
              <strong className="text-[#558b2f]">🍃 너굴과 여울이의 총평:</strong> {gradeInfo.message}
            </div>
          </div>

          {/* Detailed Question Feedbacks */}
          <div>
            <h4 className="text-base font-black text-[#2d491f] font-ac-title mb-3 flex items-center gap-2">
              <span>📋 문항별 정/오답 및 키워드 채점 피드백</span>
              <span className="text-xs text-[#71614b] font-normal">
                (총 11개 문항 상세 내역)
              </span>
            </h4>

            <div className="space-y-3">
              {result.feedbacks.map((fb, idx) => {
                const isFull = fb.score === fb.maxScore;
                const isPartial = fb.score > 0 && fb.score < fb.maxScore;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border-2 transition ${
                      isFull
                        ? 'bg-[#f7fcf4] border-[#c2e4ad]'
                        : isPartial
                        ? 'bg-[#fffef0] border-[#fde047]'
                        : 'bg-[#fff8f6] border-[#fecaca]'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {isFull ? (
                          <span className="w-5 h-5 rounded-full bg-[#52b788] text-white flex items-center justify-center text-xs font-bold">
                            ✓
                          </span>
                        ) : isPartial ? (
                          <span className="w-5 h-5 rounded-full bg-[#eab308] text-white flex items-center justify-center text-xs font-bold">
                            ▲
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-[#ef4444] text-white flex items-center justify-center text-xs font-bold">
                            ✗
                          </span>
                        )}
                        <span className="text-sm font-bold text-[#352a1d]">
                          {fb.title}
                        </span>
                      </div>

                      <div className="text-xs font-black">
                        <span className={isFull ? 'text-[#2b8a3e]' : isPartial ? 'text-[#b45309]' : 'text-[#c92a2a]'}>
                          {fb.score}점
                        </span>
                        <span className="text-[#8c7e69]"> / {fb.maxScore}점</span>
                      </div>
                    </div>

                    {/* Answer Comparisons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
                      <div className="bg-white p-2.5 rounded-xl border border-[#ded5be]">
                        <span className="font-bold text-[#71614c] block mb-0.5">내가 적은 답안:</span>
                        <span className="text-[#3c3124] font-medium break-words">
                          {fb.userAnswer}
                        </span>
                      </div>
                      <div className="bg-[#fcfbee] p-2.5 rounded-xl border border-[#e8dfbe]">
                        <span className="font-bold text-[#b45309] block mb-0.5">노란색 기준 모범 정답:</span>
                        <span className="text-[#78350f] font-semibold break-words">
                          {fb.targetAnswer}
                        </span>
                      </div>
                    </div>

                    {/* Keywords Matched Tag */}
                    {fb.matchedKeywords.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-1.5">
                        <span className="font-bold text-[#406828]">일치한 키워드:</span>
                        {fb.matchedKeywords.map((kw, kIdx) => (
                          <span
                            key={kIdx}
                            className="bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-md font-bold border border-[#bbf7d0]"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Teacher Feedback Text */}
                    <div className="text-xs text-[#524535] leading-relaxed mt-1 flex items-start gap-1.5">
                      <span className="font-bold text-[#78593a] shrink-0">💡 피드백:</span>
                      <span>{fb.feedbackText}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Bottom Buttons */}
        <div className="p-4 bg-[#f8f5ea] border-t-2 border-[#e6dcbf] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white hover:bg-[#f1ecd9] text-[#6b583f] rounded-xl border-2 border-[#d9ccae] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#8c7456]" />
              <span>성적표 인쇄</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onRetry();
              }}
              className="px-3.5 py-2 bg-white hover:bg-[#f1ecd9] text-[#6b583f] rounded-xl border-2 border-[#d9ccae] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-[#8c7456]" />
              <span>오답 수정 / 다시 풀기</span>
            </button>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="px-5 py-2 bg-[#68d391] hover:bg-[#48bb78] text-white font-bold rounded-xl border-2 border-[#38a169] shadow-[0_3px_0_#276749] text-xs sm:text-sm transition active:translate-y-0.5"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
