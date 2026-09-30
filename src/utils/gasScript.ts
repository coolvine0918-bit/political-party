/**
 * 기본 구글 앱스 스크립트 웹 앱 배포 URL (지정된 기록 시트)
 */
export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbwE2DzqF5lwECpn85IzVWaFIIB5H-uVsu7-Ms8i4tTYwjrWuX_FE8ErrewLFOIQxkkEsw/exec';

/**
 * 구글 앱스 스크립트(Google Apps Script) 배포용 원본 코드
 * 사용자가 복사하여 구글 스프레드시트의 [확장 프로그램] > [Apps Script] 에 붙여넣고
 * 웹 앱으로 배포(Web App: Anyone 접근 권한)하면 즉시 실시간 연동됩니다.
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * 동물의 숲 정당 탐구 아카데미 - 구글 스프레드시트 자동 기록 백엔드 스크립트
 * 배포 방법:
 * 1. 구글 스프레드시트 신규 생성 (예: '정당_학습지_제출명단')
 * 2. 상단 메뉴 [확장 프로그램] -> [Apps Script] 클릭
 * 3. 기존 코드를 모두 지우고 이 스크립트 전체를 붙여넣기
 * 4. 오른쪽 상단 [배포] -> [새 배포] 클릭
 * 5. 유형 선택: [웹 앱] (Web App)
 *    - 설명: 정당 학습지 제출기
 *    - 다음 사용자로 실행: 나 (내 계정)
 *    - 액세스 권한이 있는 사용자: [모든 사용자] (Anyone)  <-- 중요!
 * 6. [배포] 누르고 생성된 '웹 앱 URL'을 복사하여 학습지 앱의 [교사용 연동 설정]에 등록합니다.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rawData = e.postData ? e.postData.contents : "";
    var data = {};

    if (rawData) {
      try {
        data = JSON.parse(rawData);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    // 헤더가 없는 경우 1행에 헤더 자동 생성
    if (sheet.getLastRow() === 0) {
      var headers = [
        "제출일시",
        "학번",
        "이름",
        "총점",
        "등급(A~E)",
        "기본1(정당 의미)",
        "기본2(정당 목적)",
        "기본3(여론 수렴)",
        "기본4(정책·공약)",
        "기본5(후보 추천)",
        "사례1(팬클럽 비교)",
        "사례2(저출생 보육)",
        "사례3(후보자 선출)",
        "사례4(대중교통 경청)",
        "사례5(시민단체 비교)",
        "사례6(여당·야당 및 의원수)"
      ];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#48bb78");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    var conceptAnswers = data.conceptAnswers || {};
    var caseAnswers = data.caseAnswers || {};

    var row = [
      data.submittedAt || new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
      data.studentId || "-",
      data.name || "-",
      data.totalScore || 0,
      data.grade || "-",
      conceptAnswers["concept-1"] || "-",
      conceptAnswers["concept-2"] || "-",
      conceptAnswers["concept-3"] || "-",
      conceptAnswers["concept-4"] || "-",
      conceptAnswers["concept-5"] || "-",
      caseAnswers["1"] || caseAnswers[1] || "-",
      caseAnswers["2"] || caseAnswers[2] || "-",
      caseAnswers["3"] || caseAnswers[3] || "-",
      caseAnswers["4"] || caseAnswers[4] || "-",
      caseAnswers["5"] || caseAnswers[5] || "-",
      caseAnswers["6"] || caseAnswers[6] || "-"
    ];

    sheet.appendRow(row);

    // 등급 열 강조 서식
    var lastRow = sheet.getLastRow();
    var gradeCell = sheet.getRange(lastRow, 5);
    gradeCell.setHorizontalAlignment("center");
    gradeCell.setFontWeight("bold");

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", row: lastRow })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    "🌿 동물의 숲 정당 탐구 아카데미 - 구글 스프레드시트 수집기가 정상 작동 중입니다!"
  );
}
`;
