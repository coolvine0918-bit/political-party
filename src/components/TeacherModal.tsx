import React, { useState } from 'react';
import { GOOGLE_APPS_SCRIPT_CODE, DEFAULT_GAS_URL } from '../utils/gasScript';
import { SubmissionResult } from '../types';
import { X, Copy, Check, ExternalLink, Download, Trash2, Send, ShieldCheck, Database } from 'lucide-react';
import { sound } from '../utils/sound';

interface TeacherModalProps {
  gasUrl: string;
  onSaveGasUrl: (url: string) => void;
  onClose: () => void;
  submissions: SubmissionResult[];
  onClearSubmissions: () => void;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  gasUrl,
  onSaveGasUrl,
  onClose,
  submissions,
  onClearSubmissions
}) => {
  const [inputUrl, setInputUrl] = useState(gasUrl || DEFAULT_GAS_URL);
  const [copied, setCopied] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'settings' | 'records'>('settings');

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setCopied(true);
      sound.playSaveChime();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
    }
  };

  const handleSave = () => {
    onSaveGasUrl(inputUrl.trim());
    sound.playSaveChime();
    setTestStatus('✅ 구글 앱스 스크립트 웹 앱 URL이 안전하게 저장되었습니다!');
    setTimeout(() => setTestStatus(null), 3500);
  };

  const handleTestConnection = async () => {
    if (!inputUrl.trim()) {
      setTestStatus('⚠️ 웹 앱 URL을 먼저 입력해 주세요.');
      return;
    }

    setTestStatus('📡 연결 테스트 중...');
    try {
      await fetch(inputUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'TEST-01',
          name: '연동테스트너굴',
          totalScore: 100,
          grade: 'A',
          submittedAt: new Date().toLocaleString('ko-KR'),
          conceptAnswers: { 'concept-1': '테스트 답안' },
          caseAnswers: { '1': '테스트 답안' }
        })
      });
      sound.playPop();
      setTestStatus('🎉 테스트 데이터가 구글 스프레드시트로 전송되었습니다! 시트 행을 확인해 보세요.');
    } catch (err) {
      setTestStatus('❌ 연결 실패: URL 또는 배포 권한(모든 사용자 허용)을 확인하세요.');
    }
  };

  const exportCSV = () => {
    if (submissions.length === 0) {
      alert('다운로드할 제출 데이터가 아직 없습니다.');
      return;
    }

    const headers = [
      '제출일시', '학번', '이름', '총점', '등급',
      '기본1(정당의미)', '기본2(정당목적)', '기본3(여론수렴)', '기본4(정책공약)', '기본5(후보추천)',
      '사례1(팬클럽)', '사례2(저출생)', '사례3(후보선출)', '사례4(대중교통)', '사례5(시민단체)', '사례6(창작정당)'
    ];

    const rows = submissions.map((s) => [
      `"${s.submittedAt}"`,
      `"${s.studentId}"`,
      `"${s.name}"`,
      s.totalScore,
      `"${s.grade}"`,
      `"${(s.conceptAnswers['concept-1'] || '').replace(/"/g, '""')}"`,
      `"${(s.conceptAnswers['concept-2'] || '').replace(/"/g, '""')}"`,
      `"${(s.conceptAnswers['concept-3'] || '').replace(/"/g, '""')}"`,
      `"${(s.conceptAnswers['concept-4'] || '').replace(/"/g, '""')}"`,
      `"${(s.conceptAnswers['concept-5'] || '').replace(/"/g, '""')}"`,
      `"${(s.caseAnswers[1] || '').replace(/"/g, '""')}"`,
      `"${(s.caseAnswers[2] || '').replace(/"/g, '""')}"`,
      `"${(s.caseAnswers[3] || '').replace(/"/g, '""')}"`,
      `"${(s.caseAnswers[4] || '').replace(/"/g, '""')}"`,
      `"${(s.caseAnswers[5] || '').replace(/"/g, '""')}"`,
      `"${(s.caseAnswers[6] || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `정당학습지_학생제출현황_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    sound.playPop();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#fffef9] border-4 border-[#e2a03f] rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] px-5 py-4 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
              ⚙️
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-ac-title">
                교사용 구글 스프레드시트 연동 & 제출 현황 관리
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                구글 앱스 스크립트(Google Apps Script) 배포 및 실시간 데이터 기록 설정
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

        {/* Tab Selector */}
        <div className="flex border-b border-[#e8dfc7] bg-[#f9f6ec] px-4 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === 'settings'
                ? 'border-[#d97706] text-[#b45309] bg-white rounded-t-xl'
                : 'border-transparent text-[#786953] hover:text-[#453b2d]'
            }`}
          >
            1. 구글 앱스 스크립트 연동 설정
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'records'
                ? 'border-[#d97706] text-[#b45309] bg-white rounded-t-xl'
                : 'border-transparent text-[#786953] hover:text-[#453b2d]'
            }`}
          >
            <span>2. 실시간 제출 명단 대시보드</span>
            <span className="px-2 py-0.2 bg-[#fcd34d] text-[#78350f] text-[11px] rounded-full font-black">
              {submissions.length}명
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'settings' ? (
            <>
              {/* URL Input Box */}
              <div className="bg-[#fefce8] border-2 border-[#fef08a] rounded-2xl p-4 sm:p-5 shadow-xs">
                <label className="block text-xs sm:text-sm font-black text-[#854d0e] mb-1.5 flex items-center justify-between">
                  <span>Google Apps Script 웹 앱(Web App) 배포 URL</span>
                  <span className="text-[11px] text-[#a16207] font-semibold">
                    (https://script.google.com/macros/s/.../exec)
                  </span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="배포된 구글 앱스 스크립트 웹 앱 URL을 붙여넣으세요"
                    className="flex-1 px-3.5 py-2.5 bg-white border-2 border-[#fde047] focus:border-[#d97706] rounded-xl text-xs sm:text-sm font-medium outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl font-bold text-xs sm:text-sm transition active:scale-95 shadow-xs shrink-0"
                    >
                      저장하기
                    </button>
                    <button
                      onClick={handleTestConnection}
                      className="px-3.5 py-2 bg-white hover:bg-[#fef3c7] text-[#92400e] border border-[#f59e0b] rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1 transition active:scale-95 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      테스트
                    </button>
                  </div>
                </div>

                {testStatus && (
                  <div className="mt-2.5 text-xs font-bold text-[#b45309] bg-white/80 p-2 rounded-lg border border-[#fde047]">
                    {testStatus}
                  </div>
                )}
              </div>

              {/* Step by step deployment guide */}
              <div className="bg-white border-2 border-[#e6dcbf] rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm sm:text-base font-extrabold text-[#453625] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
                    <span>구글 스프레드시트 3분 완성 배포 가이드</span>
                  </h4>

                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#15803d] border border-[#86efac] rounded-lg text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '스크립트 복사완료!' : 'Apps Script 코드 복사'}</span>
                  </button>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-[#5a4c38] leading-relaxed">
                  <div className="flex items-start gap-2.5 bg-[#faf7ee] p-3 rounded-xl border border-[#ede5d0]">
                    <span className="w-5 h-5 rounded-full bg-[#f59e0b] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-[#3c3124]">구글 스프레드시트 생성 :</strong> 구글 드라이브에서 새 스프레드시트를 만들고 상단 메뉴 <strong>[확장 프로그램] ➔ [Apps Script]</strong>를 클릭합니다.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-[#faf7ee] p-3 rounded-xl border border-[#ede5d0]">
                    <span className="w-5 h-5 rounded-full bg-[#f59e0b] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-[#3c3124]">코드 붙여넣기 :</strong> 위 오른쪽 버튼(<strong>[Apps Script 코드 복사]</strong>)을 눌러 복사한 스크립트를 Apps Script 편집창의 내용을 지우고 전체 붙여넣은 뒤 저장(Ctrl+S)합니다.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-[#faf7ee] p-3 rounded-xl border border-[#ede5d0]">
                    <span className="w-5 h-5 rounded-full bg-[#f59e0b] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-[#3c3124]">웹 앱으로 배포하기 :</strong> 우측 상단 <strong>[배포] ➔ [새 배포] ➔ 유형: [웹 앱]</strong>을 선택합니다.
                      <ul className="list-disc list-inside mt-1 text-xs text-[#78654a] space-y-0.5 pl-1">
                        <li>다음 사용자로 실행: <strong>나(내 이메일)</strong></li>
                        <li>액세스 권한: <strong>모든 사용자(Anyone)</strong> <span className="text-[#dc2626] font-bold">★중요(학생들이 로그인 없이 제출 가능)</span></li>
                      </ul>
                      배포 완료 후 나타나는 <strong>웹 앱 URL</strong>을 위 입력창에 등록하면 모든 학생의 답안, 학번, 이름, 등급(A~E)이 구글 시트에 실시간 자동 입력됩니다!
                    </div>
                  </div>
                </div>

                {/* Direct Code Preview box */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-[#8c7b64] mb-1">
                    <span>Code.gs 소스코드 미리보기:</span>
                  </div>
                  <pre className="p-3 bg-[#1e293b] text-[#cbd5e1] rounded-xl text-[11px] font-mono overflow-x-auto max-h-40 border border-[#334155]">
                    {GOOGLE_APPS_SCRIPT_CODE}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            /* Records Tab */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#faf7ee] p-3.5 rounded-2xl border border-[#e6dcbf]">
                <div>
                  <h4 className="text-sm font-extrabold text-[#3d3122]">
                    제출 완료된 학생 기록 ({submissions.length}건)
                  </h4>
                  <p className="text-xs text-[#7c6c55]">
                    구글 시트 연동 여부와 관계없이 브라우저에도 실시간으로 안전하게 백업됩니다.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportCSV}
                    className="px-3.5 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>엑셀(CSV) 다운로드</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('모든 제출 기록을 초기화하시겠습니까?')) {
                        onClearSubmissions();
                      }
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 transition active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>기록 비우기</span>
                  </button>
                </div>
              </div>

              {submissions.length === 0 ? (
                <div className="text-center py-12 text-[#9c8973] bg-[#faf8f2] rounded-2xl border-2 border-dashed border-[#e2d8be]">
                  <Database className="w-8 h-8 mx-auto mb-2 text-[#bfb29c]" />
                  <p className="text-sm font-bold">아직 제출된 학생 답안이 없습니다.</p>
                  <p className="text-xs mt-1">학생이 [답안 최종 제출하기]를 완료하면 여기에 즉시 나타납니다.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border-2 border-[#e6dcbf] rounded-2xl shadow-xs">
                  <table className="w-full text-left text-xs bg-white">
                    <thead className="bg-[#f5ebd2] text-[#4d3d29] font-black border-b border-[#dfd2b2]">
                      <tr>
                        <th className="py-2.5 px-3">제출시각</th>
                        <th className="py-2.5 px-3">학번</th>
                        <th className="py-2.5 px-3">이름</th>
                        <th className="py-2.5 px-3 text-center">점수</th>
                        <th className="py-2.5 px-3 text-center">등급</th>
                        <th className="py-2.5 px-3">사례6(창작 정당명 및 공약)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eee6d3]">
                      {submissions.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-[#faf7ee] transition">
                          <td className="py-2.5 px-3 text-[#786751] whitespace-nowrap">{sub.submittedAt}</td>
                          <td className="py-2.5 px-3 font-bold text-[#382b1d]">{sub.studentId}</td>
                          <td className="py-2.5 px-3 font-bold text-[#382b1d]">{sub.name}</td>
                          <td className="py-2.5 px-3 text-center font-black text-[#2e5318]">{sub.totalScore}점</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full font-black text-[11px] ${
                              sub.grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                              sub.grade === 'B' ? 'bg-sky-100 text-sky-800' :
                              sub.grade === 'C' ? 'bg-amber-100 text-amber-800' :
                              sub.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {sub.grade} 등급
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[#524434] max-w-xs truncate">
                            {sub.caseAnswers[6] || '(미작성)'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8f5ea] border-t-2 border-[#e6dcbf] flex items-center justify-between shrink-0">
          <span className="text-xs text-[#71614b]">
            💡 Google Apps Script는 완전 무료이며 구글 스프레드시트와 실시간 연동됩니다.
          </span>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="px-5 py-2 bg-[#d97706] hover:bg-[#b45309] text-white font-bold rounded-xl text-xs sm:text-sm transition active:scale-95 shadow-xs"
          >
            설정 창 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
