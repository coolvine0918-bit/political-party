import React from 'react';
import { CASE_STUDY_ITEMS } from '../data/partyData';
import { Search, MessageSquare, FileText, CheckCircle2 } from 'lucide-react';

interface WorksheetSectionProps {
  answers: Record<number, string>;
  onAnswerChange: (id: number, value: string) => void;
  isSubmitted: boolean;
}

export const WorksheetSection: React.FC<WorksheetSectionProps> = ({
  answers,
  onAnswerChange,
  isSubmitted
}) => {
  return (
    <section className="w-full max-w-5xl mx-auto mb-12 px-3 sm:px-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-dashed border-[#dcd2ba]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#4faee8] text-white flex items-center justify-center font-black shadow-md border-2 border-[#368bbd] text-xl">
            2
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1b4353] font-ac-title flex items-center gap-2">
              <span>[2부] 정당 실전 사례 탐구 학습지</span>
              <span className="text-xs px-2.5 py-0.5 bg-[#dbeafe] text-[#1e40af] font-black rounded-full border border-[#bfdbfe]">
                배점 65점 (문항당 10~11점)
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#665742]">
              일상과 정치 현실의 실제 상황 스토리를 읽고 질문에 알맞은 개념을 서술해 보세요.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#6e5d47] bg-[#f8f5eb] px-3 py-1.5 rounded-full border border-[#e4dac0]">
          <FileText className="w-4 h-4 text-[#4faee8]" />
          <span>사례 총 6문항</span>
        </div>
      </div>

      {/* Guide Card */}
      <div className="bg-[#eef8fd] border-2 border-[#9cd1f5] rounded-2xl p-3.5 mb-6 text-xs sm:text-sm text-[#0c4a6e] flex items-start gap-2.5 shadow-sm">
        <span className="text-lg leading-none">🔍</span>
        <div className="leading-relaxed">
          <strong>채점 기준 안내:</strong> 문항별 핵심 키워드(예: <em>정권 획득, 정치 권력, 정책 개발 및 공약 제시, 선거 후보자 추천, 여론 수렴 등</em>)가 잘 드러나도록 서술해주세요. <strong>(교과서 P.186을 보세요.)</strong> 마지막 6번 문항은 현재 대한민국의 여당과 야당의 명칭 및 각각의 소속 국회의원 의석수를 정확하게 기재해야 만점이 부여됩니다.
        </div>
      </div>

      {/* Case Studies Cards */}
      <div className="space-y-6">
        {CASE_STUDY_ITEMS.map((item) => {
          const val = answers[item.id] || '';
          const hasValue = val.trim().length > 0;

          return (
            <div
              key={item.id}
              className="bg-white border-3 border-[#e2d8bd] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm hover:border-[#7ec1e8] transition relative overflow-hidden"
            >
              {/* Question Number & Points */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#4faee8] text-white rounded-full text-xs font-black shadow-xs">
                    사례 {item.id}번
                  </span>
                  {item.isInvestigation && (
                    <span className="px-2.5 py-0.5 bg-[#e0f2fe] text-[#0369a1] rounded-full text-xs font-black border border-[#bae6fd] flex items-center gap-1">
                      <Search className="w-3 h-3 text-[#0284c7]" />
                      국회 현황 조사 탐구
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#8c7e69] bg-[#f8f5ea] px-2.5 py-1 rounded-lg border border-[#e4d8bc]">
                    배점 {item.maxPoints}점
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-bold bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]">
                    📖 교과서 P.186을 보세요.
                  </span>
                </div>
              </div>

              {/* Story Scenario Box (Animal Crossing Dialog Style) */}
              <div className="mb-4 bg-[#fcfbf7] border-2 border-[#e6dcbf] rounded-2xl p-4 relative">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#5c4b37] mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#e25c38]" />
                  <span>상황 및 구체적 스토리텔링</span>
                </div>
                <p className="text-sm sm:text-base text-[#3c3123] font-medium leading-relaxed">
                  {item.caseText}
                </p>
              </div>

              {/* Question Banner */}
              <div className="mb-3.5 bg-[#fdf2e9] border border-[#fbd38d] rounded-xl px-4 py-2.5 text-sm sm:text-base font-extrabold text-[#9c4221] flex items-center gap-2">
                <span className="text-base">❓</span>
                <span>{item.question}</span>
              </div>

              {/* Answer Input Area */}
              <div>
                <label className="block text-xs font-bold text-[#6d5f4c] mb-1.5">
                  나의 답안 작성하기 :
                </label>
                {item.isInvestigation ? (
                  <textarea
                    rows={3}
                    disabled={isSubmitted}
                    value={val}
                    onChange={(e) => onAnswerChange(item.id, e.target.value)}
                    placeholder="조사한 현재 대한민국 여당과 야당의 명칭 및 국회의원 수를 적어주세요.&#10;예: 여당: [정당명] ([의원수]명) / 야당: [정당명] ([의원수]명)"
                    className={`w-full p-3.5 rounded-xl border-2 text-sm sm:text-base font-medium outline-none transition resize-y ${
                      hasValue
                        ? 'border-[#4faee8] bg-[#f8fbfe] text-[#133e54]'
                        : 'border-[#dfd3b6] bg-white text-[#4a3d2e] focus:border-[#4faee8]'
                    }`}
                  />
                ) : (
                  <textarea
                    rows={2}
                    disabled={isSubmitted}
                    value={val}
                    onChange={(e) => onAnswerChange(item.id, e.target.value)}
                    placeholder="상황에 알맞은 정당의 개념 또는 기능, 핵심 차이점을 서술하세요."
                    className={`w-full p-3 rounded-xl border-2 text-sm sm:text-base font-semibold outline-none transition resize-none ${
                      hasValue
                        ? 'border-[#4faee8] bg-[#f8fbfe] text-[#133e54]'
                        : 'border-[#dfd3b6] bg-white text-[#4a3d2e] focus:border-[#4faee8]'
                    }`}
                  />
                )}

                <div className="flex items-center justify-between mt-2 text-xs text-[#8c7e69]">
                  <span className="flex items-center gap-1">
                    {hasValue ? (
                      <span className="text-[#38a169] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        답안 작성 완료 ({val.trim().length}자)
                      </span>
                    ) : (
                      <span className="text-[#a89c89]">아직 답안을 작성하지 않았습니다.</span>
                    )}
                  </span>
                  <span>임시저장 지원됨 🍃</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
