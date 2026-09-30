import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { ConceptSection } from './components/ConceptSection';
import { WorksheetSection } from './components/WorksheetSection';
import { ResultModal } from './components/ResultModal';
import { TeacherModal } from './components/TeacherModal';
import { gradeSubmission } from './utils/grading';
import { DEFAULT_GAS_URL } from './utils/gasScript';
import { sound } from './utils/sound';
import { SubmissionResult } from './types';
import { Save, Send, RotateCcw, Sparkles, CheckCircle2, AlertCircle, Loader2, Award } from 'lucide-react';

const DRAFT_STORAGE_KEY = 'ac_party_worksheet_draft_v1';
const GAS_URL_STORAGE_KEY = 'ac_party_gas_url_v1';
const SUBMISSIONS_STORAGE_KEY = 'ac_party_submissions_v1';

export default function App() {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [conceptAnswers, setConceptAnswers] = useState<Record<string, string>>({});
  const [caseAnswers, setCaseAnswers] = useState<Record<number, string>>({});

  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isAutoSaved, setIsAutoSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 배포된 구글 앱스 스크립트 URL 기본 내장
  const [gasUrl, setGasUrl] = useState(DEFAULT_GAS_URL);
  const [gasStatus, setGasStatus] = useState<'idle' | 'success' | 'failed' | 'not_configured'>('idle');

  const [submissions, setSubmissions] = useState<SubmissionResult[]>([]);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initial Load from localStorage
  useEffect(() => {
    try {
      const savedGas = localStorage.getItem(GAS_URL_STORAGE_KEY);
      if (savedGas && savedGas.trim().length > 0) {
        setGasUrl(savedGas);
      } else {
        setGasUrl(DEFAULT_GAS_URL);
        localStorage.setItem(GAS_URL_STORAGE_KEY, DEFAULT_GAS_URL);
      }

      const savedSubs = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
      if (savedSubs) {
        setSubmissions(JSON.parse(savedSubs));
      }

      const rawDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (rawDraft) {
        const draft = JSON.parse(rawDraft);
        if (draft.studentId) setStudentId(draft.studentId);
        if (draft.name) setName(draft.name);
        if (draft.conceptAnswers) setConceptAnswers(draft.conceptAnswers);
        if (draft.caseAnswers) setCaseAnswers(draft.caseAnswers);
        if (draft.savedAt) {
          setLastSavedTime(draft.savedAt);
          setHasRestoredDraft(true);
        }
      }
    } catch (e) {
      console.error('Failed to load local draft:', e);
    }
  }, []);

  // Toast message helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Manual Draft Save
  const handleSaveDraft = (isAutomatic = false) => {
    const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const draftData = {
      studentId,
      name,
      conceptAnswers,
      caseAnswers,
      savedAt: timeStr
    };

    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
      setLastSavedTime(timeStr);
      setIsAutoSaved(isAutomatic);
      if (!isAutomatic) {
        showToast('🌱 작성하신 서술형 답안이 안전하게 임시저장되었습니다!');
      }
    } catch (e) {
      console.error('Save draft error:', e);
    }
  };

  // Debounced Auto-save (triggers 3 seconds after typing stops)
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      const hasAnyInput =
        studentId.trim() ||
        name.trim() ||
        Object.values(conceptAnswers).some((v) => v.trim()) ||
        Object.values(caseAnswers).some((v) => v.trim());

      if (hasAnyInput && !isSubmitted) {
        handleSaveDraft(true);
      }
    }, 3500);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [studentId, name, conceptAnswers, caseAnswers, isSubmitted]);

  // Answer change handlers
  const handleConceptChange = (id: string, val: string) => {
    sound.playPop();
    setConceptAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const handleCaseChange = (id: number, val: string) => {
    sound.playPop();
    setCaseAnswers((prev) => ({ ...prev, [id]: val }));
  };

  // GAS URL Save
  const handleSaveGasUrl = (url: string) => {
    setGasUrl(url);
    try {
      localStorage.setItem(GAS_URL_STORAGE_KEY, url);
    } catch {}
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const newMuted = sound.toggleMute();
    setIsMuted(newMuted);
  };

  // Clear Submissions in Teacher View
  const handleClearSubmissions = () => {
    setSubmissions([]);
    try {
      localStorage.removeItem(SUBMISSIONS_STORAGE_KEY);
    } catch {}
  };

  // Count answered questions (out of 11: 5 concept + 6 cases)
  const answeredConceptCount = Object.values(conceptAnswers).filter((v) => v && v.trim().length > 0).length;
  const answeredCaseCount = Object.values(caseAnswers).filter((v) => v && v.trim().length > 0).length;
  const totalAnswered = answeredConceptCount + answeredCaseCount;
  const totalQuestions = 11;
  const progressPercent = Math.round((totalAnswered / totalQuestions) * 100);

  // Submit and Grade
  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!studentId.trim() || !name.trim()) {
      const confirmContinue = confirm(
        '⚠️ 학번과 이름이 아직 입력되지 않았습니다!\n학번과 이름 없이 그대로 제출하여 채점하시겠습니까?'
      );
      if (!confirmContinue) return;
    }

    if (totalAnswered < 3) {
      const proceed = confirm(
        `아직 ${totalAnswered}문항만 작성하셨습니다.\n정말 이대로 제출하여 채점을 진행할까요?`
      );
      if (!proceed) return;
    }

    setIsSubmitting(true);

    // 1. Grade locally using keywords & sheet standards
    const result = gradeSubmission(
      studentId.trim() || '미입력',
      name.trim() || '무명 주민',
      conceptAnswers,
      caseAnswers
    );

    // 2. Send to Google Apps Script Web App (단 1회 전송하여 중복 기록 방지)
    const targetGasUrl = gasUrl.trim() || DEFAULT_GAS_URL;
    const payload = {
      studentId: result.studentId,
      name: result.name,
      totalScore: result.totalScore,
      grade: result.grade,
      submittedAt: result.submittedAt,
      conceptAnswers: result.conceptAnswers,
      caseAnswers: result.caseAnswers
    };

    try {
      // Browser direct send (text/plain avoids CORS preflight failures in GAS Web App)
      await fetch(targetGasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      setGasStatus('success');
    } catch (err) {
      console.warn('Direct GAS POST notice:', err);
      setGasStatus('failed');
    }

    // Node Server local backup only (서버에서 구글 시트로 재전송하지 않음)
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (proxyErr) {
      // ignore local backup error
    }

    // 학생이 로딩 및 채점 과정을 눈으로 체감할 수 있도록 자연스러운 연출 딜레이 부여
    await new Promise((resolve) => setTimeout(resolve, 650));

    setSubmissionResult(result);
    setIsSubmitted(true);

    // 3. Play celebratory sounds & confetti!
    sound.playFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // 4. Save to local submissions list
    const updatedSubs = [result, ...submissions];
    setSubmissions(updatedSubs);
    try {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(updatedSubs));
    } catch {}

    setIsSubmitting(false);
    setIsResultModalOpen(true);
  };

  // Reset form
  const handleResetForm = () => {
    if (confirm('학습지 작성을 초기화하시겠습니까? (작성 중인 모든 답안이 비워집니다)')) {
      setConceptAnswers({});
      setCaseAnswers({});
      setIsSubmitted(false);
      setSubmissionResult(null);
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {}
      setLastSavedTime(null);
      sound.playPop();
      showToast('학습지가 새로 초기화되었습니다.');
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#305a26] text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-xl border-2 border-[#549e41] flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#8fe276]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Draft restoration notification bar */}
      {hasRestoredDraft && (
        <div className="w-full bg-[#fefce8] border-b border-[#fde047] py-2 px-4 text-center text-xs font-semibold text-[#854d0e] flex items-center justify-center gap-2">
          <span>🍃 이전에 임시저장해 둔 작성 답안을 자동으로 불러왔습니다!</span>
          <button
            onClick={() => setHasRestoredDraft(false)}
            className="text-stone-400 hover:text-stone-700 ml-1 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Header */}
      <Header
        studentId={studentId}
        name={name}
        onStudentIdChange={setStudentId}
        onNameChange={setName}
        onSaveDraft={() => handleSaveDraft(false)}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
        lastSavedTime={lastSavedTime}
        isAutoSaved={isAutoSaved}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />

      <main>
        {/* Part 1: 정당 기본 개념 백과 (Sheet 1) */}
        <ConceptSection
          answers={conceptAnswers}
          onAnswerChange={handleConceptChange}
          isSubmitted={isSubmitted}
        />

        {/* Part 2: 정당 실전 사례 탐구 (Sheet 2) */}
        <WorksheetSection
          answers={caseAnswers}
          onAnswerChange={handleCaseChange}
          isSubmitted={isSubmitted}
        />
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#fffef9]/95 backdrop-blur-md border-t-3 border-[#dfd5bc] px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Progress Indicator */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-[#f2ecdc] border border-[#d9ccae] flex items-center justify-center text-xl shrink-0">
              🏝️
            </div>
            <div className="flex-1 min-w-[150px]">
              <div className="flex items-center justify-between text-xs font-black text-[#5c4a34] mb-1">
                <span>학습지 작성 진행률</span>
                <span className="text-[#38a169]">{totalAnswered} / {totalQuestions} 완료 ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2.5 bg-[#e8e0cc] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#84fab0] to-[#8fd3f4] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleResetForm}
              title="처음부터 다시 작성하기"
              className="p-2.5 bg-white hover:bg-stone-100 text-[#7d6f5c] border-2 border-[#d9ccae] rounded-2xl transition active:scale-95 text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-[#8c7456]" />
              <span className="hidden md:inline">초기화</span>
            </button>

            {/* Manual Save Draft Button */}
            <button
              type="button"
              onClick={() => {
                sound.playSaveChime();
                handleSaveDraft(false);
              }}
              className="px-4 py-2.5 bg-[#fff8db] hover:bg-[#ffefb8] text-[#8a4b08] border-2 border-[#f6d860] rounded-2xl font-black text-xs sm:text-sm shadow-[0_3px_0_#d4aa22] transition active:translate-y-0.5 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-[#b45309]" />
              <span>임시저장</span>
            </button>

            {/* Submit & Grade Button with clear loading animation & states */}
            {isSubmitting ? (
              <button
                type="button"
                disabled={true}
                className="flex-1 sm:flex-initial px-6 py-2.5 animate-submit-loading text-white font-black text-sm sm:text-base rounded-2xl border-3 border-[#2f6615] flex items-center justify-center gap-2 cursor-wait scale-[0.98] select-none"
              >
                <Loader2 className="w-5 h-5 animate-spin text-[#fffb8f]" />
                <span className="tracking-tight">시트 기록 및 자동 채점 중...</span>
                <span className="inline-flex items-center gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"></span>
                </span>
              </button>
            ) : isSubmitted ? (
              <button
                type="button"
                onClick={() => setIsResultModalOpen(true)}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#2f855a] hover:bg-[#276749] text-white font-black text-sm sm:text-base rounded-2xl border-3 border-[#1c4d35] shadow-[0_4px_0_#173c2a] transition-all active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer hover:brightness-105"
              >
                <Award className="w-5 h-5 text-[#fef08a]" />
                <span>{submissionResult?.grade}등급 성적표 다시보기</span>
                <CheckCircle2 className="w-4 h-4 text-[#86efac]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="group flex-1 sm:flex-initial px-6 py-2.5 bg-[#78c850] hover:bg-[#68b840] text-white font-black text-sm sm:text-base rounded-2xl border-3 border-[#569830] shadow-[0_4px_0_#3f7520] transition-all active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_6px_0_#3f7520] hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5 text-[#fffb8f] group-hover:rotate-12 transition-transform" />
                <span>최종 답안 제출 & A~E 채점 받기</span>
                <Send className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-[#8c7e69] py-8 px-4 border-t border-[#dfd5bc] mt-16 space-y-1">
        <p className="font-bold">🍃 모여봐요 정당의 숲 아카데미 • 중·고등학교 사회과 정당 및 선거 탐구 학습지</p>
        <p>정당의 기본개념 및 3대 기능, 실전 사례 분석, 나만의 정당 창작 및 구글 앱스 스크립트 실시간 시트 채점 연동</p>
      </footer>

      {/* Result Modal */}
      {isResultModalOpen && submissionResult && (
        <ResultModal
          result={submissionResult}
          onClose={() => setIsResultModalOpen(false)}
          onRetry={() => {
            setIsResultModalOpen(false);
            setIsSubmitted(false);
          }}
          gasStatus={gasStatus}
        />
      )}

      {/* Teacher Modal */}
      {isTeacherModalOpen && (
        <TeacherModal
          gasUrl={gasUrl}
          onSaveGasUrl={handleSaveGasUrl}
          onClose={() => setIsTeacherModalOpen(false)}
          submissions={submissions}
          onClearSubmissions={handleClearSubmissions}
        />
      )}
    </div>
  );
}
