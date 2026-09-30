import React from 'react';
import { CONCEPT_ITEMS } from '../data/partyData';
import { BookOpen, Check } from 'lucide-react';

interface ConceptSectionProps {
  answers: Record<string, string>;
  onAnswerChange: (id: string, value: string) => void;
  isSubmitted: boolean;
}

export const ConceptSection: React.FC<ConceptSectionProps> = ({
  answers,
  onAnswerChange,
  isSubmitted
}) => {
  return (
    <section className="w-full max-w-5xl mx-auto mb-10 px-3 sm:px-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-dashed border-[#dcd2ba]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#79c546] text-white flex items-center justify-center font-black shadow-md border-2 border-[#5a9e30] text-xl">
            1
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2e471f] font-ac-title flex items-center gap-2">
              <span>[1부] 정당 기본 개념 마스터 백과</span>
              <span className="text-xs px-2.5 py-0.5 bg-[#fef08a] text-[#854d0e] font-black rounded-full border border-[#fde047]">
                배점 35점 (문항당 7점)
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#665742]">
              정당의 본질을 이루는 기본 정의, 가장 중요한 목적, 그리고 3가지 핵심 기능을 완성해보세요.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#6e5d47] bg-[#f8f5eb] px-3 py-1.5 rounded-full border border-[#e4dac0]">
          <BookOpen className="w-4 h-4 text-[#79c546]" />
          <span>개념 총 5문항</span>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="bg-[#fff9db] border-2 border-[#f6e05e] rounded-2xl p-3.5 mb-6 text-xs sm:text-sm text-[#744210] flex items-start gap-2.5 shadow-sm">
        <span className="text-lg leading-none">⭐️</span>
        <div className="leading-relaxed">
          <strong>작성 안내:</strong> 아래 문장의 <strong>[ 빈칸 ]</strong>에 들어갈 핵심 정답을 노란색 하이라이트 기준에 맞추어 정확하게 적어주세요. <strong>(교과서 P.186을 보세요.)</strong>
        </div>
      </div>

      {/* Concept Items Cards */}
      <div className="grid grid-cols-1 gap-4">
        {CONCEPT_ITEMS.map((item, index) => {
          const val = answers[item.id] || '';
          const hasValue = val.trim().length > 0;

          return (
            <div
              key={item.id}
              className="bg-white border-3 border-[#e5dcbf] rounded-2xl p-4 sm:p-5 shadow-sm hover:border-[#96cf64] transition group relative overflow-hidden"
            >
              {/* Top Meta Tag */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#f1ebd8] text-[#5e4f3c] text-xs font-black flex items-center justify-center border border-[#dacfb4]">
                    0{index + 1}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#eef7e6] text-[#3b7324] border border-[#d2ebbe]">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8c7e69] font-medium">배점 7점</span>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-bold bg-[#fef9c3] text-[#854d0e] border-[#fde047]">
                    📖 교과서 P.186을 보세요.
                  </span>
                </div>
              </div>

              {/* Question Statement */}
              <div className="mb-3.5 text-sm sm:text-base font-semibold text-[#3c3124] leading-relaxed bg-[#faf8f2] p-3.5 rounded-xl border border-[#ece3ce]">
                {item.id === 'concept-1' && (
                  <span>
                    비슷한 <span className="bg-[#fef08a] px-2 py-0.5 rounded border border-[#facc15] font-black text-[#713f12]">[ 빈칸 ]</span>을 가진 사람들이 모여 만든 단체
                  </span>
                )}
                {item.id === 'concept-2' && (
                  <span>
                    선거에 후보자를 내고 당선시켜 <span className="bg-[#fef08a] px-2 py-0.5 rounded border border-[#facc15] font-black text-[#713f12]">[ 빈칸 ]</span>을 잡는 것이 정당의 최종 목표 (※ 이익 집단이나 시민 단체와 구별되는 가장 큰 차이점)
                  </span>
                )}
                {item.id === 'concept-3' && (
                  <span>
                    국민의 다양한 의견, 불만, 요구 사항을 모아서 정부나 국회에 전달함 : <span className="bg-[#fef08a] px-2 py-0.5 rounded border border-[#facc15] font-black text-[#713f12]">[ 빈칸 ]</span>
                  </span>
                )}
                {item.id === 'concept-4' && (
                  <span>
                    국민의 삶을 개선하기 위한 정책을 연구하고, 선거 때 약속(공약)으로 발표함 : <span className="bg-[#fef08a] px-2 py-0.5 rounded border border-[#facc15] font-black text-[#713f12]">[ 빈칸 ]</span>
                  </span>
                )}
                {item.id === 'concept-5' && (
                  <span>
                    선거에 나설 경쟁력 있고 적합한 인물을 정당의 대표(후보)로 내세움 : <span className="bg-[#fef08a] px-2 py-0.5 rounded border border-[#facc15] font-black text-[#713f12]">[ 빈칸 ]</span>
                  </span>
                )}
              </div>

              {/* Input Field */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    disabled={isSubmitted}
                    value={val}
                    onChange={(e) => onAnswerChange(item.id, e.target.value)}
                    placeholder="빈칸에 들어갈 정답을 입력하세요 (예: 핵심 단어)"
                    className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm sm:text-base font-bold outline-none transition ${
                      hasValue
                        ? 'border-[#6dbf3f] bg-[#fbfdf9] text-[#204414]'
                        : 'border-[#dfd3b6] bg-white text-[#4a3d2e] focus:border-[#73be4d]'
                    }`}
                  />
                  {hasValue && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#52b788] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
