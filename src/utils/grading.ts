import { CONCEPT_ITEMS, CASE_STUDY_ITEMS } from '../data/partyData';
import { Grade, AnswerItemFeedback, SubmissionResult } from '../types';

/**
 * 문자열 공백 및 특수문자 정규화
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\"\'\?\!\s]/g, '')
    .trim();
}

/**
 * 점수에 따른 A~E 등급 산출
 */
export function calculateGrade(score: number): Grade {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'E';
}

export function getGradeDescription(grade: Grade): { title: string; badge: string; message: string; color: string } {
  switch (grade) {
    case 'A':
      return {
        title: '수석 주민대표 (최우수)',
        badge: '🏆 A 등급 (90~100점)',
        message: '대단해요! 여울이와 너굴도 깜짝 놀랄 만큼 정당의 본질과 기능을 완벽하게 꿰뚫고 있군요! 훌륭한 민주주의 주민대표 자격이 충분합니다.',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-300'
      };
    case 'B':
      return {
        title: '모범 정당 연구원 (우수)',
        badge: '🌟 B 등급 (80~89점)',
        message: '참 잘했어요! 정당의 핵심 개념과 실제 사례를 아주 폭넓게 이해하고 있습니다. 오답 피드백을 조금만 보충하면 만점도 문제없어요!',
        color: 'text-sky-700 bg-sky-50 border-sky-300'
      };
    case 'C':
      return {
        title: '성실한 마을 주민 (보통)',
        badge: '🌱 C 등급 (70~79점)',
        message: '좋은 도전이었어요! 기본적인 정당의 기능은 파악했으나, 정권 획득이나 핵심 키워드 서술에서 아쉬운 부분이 있네요. 오답 노트를 꼼꼼히 확인해 보세요.',
        color: 'text-amber-700 bg-amber-50 border-amber-300'
      };
    case 'D':
      return {
        title: '정치 새싹 꿈나무 (노력 요망)',
        badge: '🌿 D 등급 (60~69점)',
        message: '기본 개념을 조금 더 다져볼까요? 시민단체와 정당의 차이점, 3대 기능의 구체적 사례를 다시 한번 천천히 복습해 보는 것을 추천합니다.',
        color: 'text-orange-700 bg-orange-50 border-orange-300'
      };
    case 'E':
      return {
        title: '수습 섬 주민 (재도전 필요)',
        badge: '🌰 E 등급 (60점 미만)',
        message: '포기하지 마세요! 학습지의 정답 해설과 힌트를 차근차근 읽어본 뒤 다시 도전하면 분명 훌륭한 성적을 거둘 수 있습니다!',
        color: 'text-rose-700 bg-rose-50 border-rose-300'
      };
  }
}

/**
 * 전체 답안 종합 채점 및 피드백 생성
 */
export function gradeSubmission(
  studentId: string,
  name: string,
  conceptAnswers: Record<string, string>,
  caseAnswers: Record<number, string>
): SubmissionResult {
  const feedbacks: AnswerItemFeedback[] = [];
  let totalScore = 0;

  // 1. 기본 개념 5문항 채점
  CONCEPT_ITEMS.forEach((item) => {
    const rawAnswer = conceptAnswers[item.id] || '';
    const normUser = normalizeText(rawAnswer);
    let matchedKeywords: string[] = [];
    let isCorrect = false;
    let score = 0;

    if (normUser.length > 0) {
      // 키워드 검사
      matchedKeywords = item.keywords.filter((kw) => normUser.includes(normalizeText(kw)));

      if (matchedKeywords.length > 0) {
        isCorrect = true;
        score = item.maxPoints;
      } else {
        // 유사어/부분 매칭 검사
        if (item.id === 'concept-1' && (normUser.includes('정치') || normUser.includes('견해') || normUser.includes('생각'))) {
          score = Math.floor(item.maxPoints * 0.6);
          matchedKeywords.push('부분 인정 (정치/견해 관련 표현)');
        } else if (item.id === 'concept-2' && (normUser.includes('정권') || normUser.includes('권력') || normUser.includes('선거'))) {
          score = Math.floor(item.maxPoints * 0.6);
          matchedKeywords.push('부분 인정 (정권/권력 관련 표현)');
        } else if (item.id === 'concept-3' && (normUser.includes('여론') || normUser.includes('수렴') || normUser.includes('의견'))) {
          score = Math.floor(item.maxPoints * 0.6);
          matchedKeywords.push('부분 인정 (여론/수렴 관련 표현)');
        } else if (item.id === 'concept-4' && (normUser.includes('정책') || normUser.includes('공약'))) {
          score = Math.floor(item.maxPoints * 0.6);
          matchedKeywords.push('부분 인정 (정책/공약 관련 표현)');
        } else if (item.id === 'concept-5' && (normUser.includes('후보') || normUser.includes('추천') || normUser.includes('공천'))) {
          score = Math.floor(item.maxPoints * 0.6);
          matchedKeywords.push('부분 인정 (후보자/추천 관련 표현)');
        }
      }
    }

    const missingKeywords = item.keywords.filter((kw) => !normUser.includes(normalizeText(kw))).slice(0, 2);

    feedbacks.push({
      id: item.id,
      title: `[기본개념] ${item.category} - ${item.subElement}`,
      userAnswer: rawAnswer.trim() || '(미작성)',
      targetAnswer: item.targetAnswer,
      isCorrect: score === item.maxPoints,
      score,
      maxScore: item.maxPoints,
      matchedKeywords,
      missingKeywords,
      feedbackText: score === item.maxPoints
        ? '정확한 핵심 용어를 잘 기재하였습니다! 👏'
        : score > 0
        ? `부분 점수가 부여되었습니다. 권장 정답 [${item.targetAnswer}]의 핵심 키워드를 함께 정리해 두세요.`
        : `오답입니다. 정답은 [${item.targetAnswer}] 입니다. ${item.explanation}`
    });

    totalScore += score;
  });

  // 2. 사례형 학습지 6문항 채점
  CASE_STUDY_ITEMS.forEach((item) => {
    const rawAnswer = caseAnswers[item.id] || '';
    const normUser = normalizeText(rawAnswer);
    let matchedKeywords: string[] = [];
    let isCorrect = false;
    let score = 0;

    if (item.id === 6 || item.isInvestigation) {
      // 6번 조사 탐구 문항: 현재 여당과 야당 및 소속 국회의원 수
      const hasRulingParty = normUser.includes('더불어민주당') || normUser.includes('민주당');
      const hasRulingSeats = normUser.includes('161');
      const hasOppSeats = normUser.includes('139');
      const hasOppParty = normUser.includes('나머지') || normUser.includes('야당');

      matchedKeywords = [];
      const missingKeywords: string[] = [];

      if (hasRulingParty) matchedKeywords.push('여당: 더불어민주당');
      else missingKeywords.push('여당: 더불어민주당');

      if (hasRulingSeats) matchedKeywords.push('여당 의원 수: 161명');
      else missingKeywords.push('여당 의원 수: 161명');

      if (hasOppParty) matchedKeywords.push('야당: 나머지 정당들');
      else missingKeywords.push('야당: 나머지 정당들');

      if (hasOppSeats) matchedKeywords.push('야당 의원 수: 139명');
      else missingKeywords.push('야당 의원 수: 139명');

      const matchCount = (hasRulingParty ? 1 : 0) + (hasRulingSeats ? 1 : 0) + (hasOppParty ? 1 : 0) + (hasOppSeats ? 1 : 0);

      if (rawAnswer.trim().length === 0) {
        score = 0;
      } else if (matchCount >= 3) {
        score = item.maxPoints; // 11점 만점 (3개 이상 일치 시 만점 인정)
        isCorrect = true;
      } else if (matchCount === 2) {
        score = 7;
      } else if (matchCount === 1) {
        score = 4;
      } else {
        score = 2; // 최소 응답 시 부분점수
      }

      feedbacks.push({
        id: item.id,
        title: `[사례 ${item.id}번] ${item.question}`,
        userAnswer: rawAnswer.trim() || '(미작성)',
        targetAnswer: item.targetAnswer,
        isCorrect: score === item.maxPoints,
        score,
        maxScore: item.maxPoints,
        matchedKeywords,
        missingKeywords,
        feedbackText: score === item.maxPoints
          ? '훌륭합니다! 현재 여당인 더불어민주당(161명)과 야당인 나머지 정당들(139명)의 현황을 정확하게 기재하였습니다. 👏'
          : score > 0
          ? `일부 내용을 정확히 찾았습니다. 정답 [${item.targetAnswer}]을 확인하여 부족한 부분을 보완해 보세요.`
          : `오답입니다. 정답은 [${item.targetAnswer}] 입니다. ${item.explanation}`
      });
    } else {
      // 1~5번 사례 문항
      matchedKeywords = item.keywords.filter((kw) => normUser.includes(normalizeText(kw)));

      if (matchedKeywords.length >= 1) {
        // 키워드 발견
        score = item.maxPoints;
        isCorrect = true;
      } else {
        // 단어 유사도/부분 인정
        if (item.id === 1 && (normUser.includes('권력') || normUser.includes('선거') || normUser.includes('정치'))) {
          score = Math.floor(item.maxPoints * 0.5);
          matchedKeywords.push('부분 인정 (권력/선거 언급)');
        } else if (item.id === 2 && (normUser.includes('정책') || normUser.includes('공약') || normUser.includes('약속'))) {
          score = Math.floor(item.maxPoints * 0.5);
          matchedKeywords.push('부분 인정 (정책/공약 언급)');
        } else if (item.id === 3 && (normUser.includes('후보') || normUser.includes('추천') || normUser.includes('선출') || normUser.includes('대표'))) {
          score = Math.floor(item.maxPoints * 0.5);
          matchedKeywords.push('부분 인정 (후보/대표 선출 언급)');
        } else if (item.id === 4 && (normUser.includes('여론') || normUser.includes('수렴') || normUser.includes('의견') || normUser.includes('목소리'))) {
          score = Math.floor(item.maxPoints * 0.5);
          matchedKeywords.push('부분 인정 (의견/목소리 경청 언급)');
        } else if (item.id === 5 && (normUser.includes('권력') || normUser.includes('정권') || normUser.includes('출마') || normUser.includes('선거'))) {
          score = Math.floor(item.maxPoints * 0.5);
          matchedKeywords.push('부분 인정 (선거 출마 및 권력 언급)');
        }
      }

      const missingKeywords = item.keywords.filter((kw) => !normUser.includes(normalizeText(kw))).slice(0, 2);

      feedbacks.push({
        id: item.id,
        title: `[사례 ${item.id}번] ${item.question}`,
        userAnswer: rawAnswer.trim() || '(미작성)',
        targetAnswer: item.targetAnswer,
        isCorrect: score === item.maxPoints,
        score,
        maxScore: item.maxPoints,
        matchedKeywords,
        missingKeywords,
        feedbackText: score === item.maxPoints
          ? '정답입니다! 사례에 나타난 정당의 핵심 특징을 정확한 키워드로 잘 짚어냈습니다.'
          : score > 0
          ? `부분 점수가 인정되었습니다. 핵심 키워드 [${item.keywords.slice(0, 2).join(', ')}]를 온전히 포함하면 만점을 받을 수 있습니다.`
          : `오답입니다. 정답 해설: ${item.explanation}`
      });
    }

    totalScore += score;
  });

  const grade = calculateGrade(totalScore);

  return {
    studentId,
    name,
    submittedAt: new Date().toLocaleString('ko-KR'),
    totalScore,
    grade,
    feedbacks,
    conceptAnswers,
    caseAnswers
  };
}
