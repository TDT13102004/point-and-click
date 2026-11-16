export type QuestionId = 'Q-READ' | 'Q-WHO' | 'Q-GARAGE' | 'Q-WHAT' | 'Q-CLEANSE';

export interface InvestigationPuzzle {
  id: QuestionId;
  promptTitle: string;
  originalPrompt: string;
  formatLabel: string;
  lockedReason: string;
  canonicalAnswer: string;
  successMessage: string;
  unlockedDocId?: string;
  unlocksRoom1305?: boolean;
  completesGame?: boolean;
}

export interface PuzzleProgressSnapshot {
  solvedQuestions: QuestionId[];
  unlockedDocs: string[];
  hasRedBook: boolean;
}

export const INVESTIGATION_PUZZLES: Record<QuestionId, InvestigationPuzzle> = {
  'Q-READ': {
    id: 'Q-READ',
    promptTitle: 'Cần đọc thứ gì và tìm ở phòng số mấy trên tầng 13?',
    originalPrompt:
      'What is it you are supposed to read and what room number on the 13th floor should you search (spell out)?',
    formatLabel: 'Nhập bằng tiếng Anh, viết liền không khoảng trắng.',
    lockedReason: '',
    canonicalAnswer: 'redbookfive',
    successMessage: 'Ổ khóa căn hộ 1305 bật mở.',
    unlocksRoom1305: true,
  },
  'Q-WHO': {
    id: 'Q-WHO',
    promptTitle: 'Hai bóng người trên tầng 13 là ai?',
    originalPrompt: 'WHAT ARE THE FIRST NAMES OF THE SHADOW PEOPLE IN ALPHABETICAL ORDER?',
    formatLabel: 'Nhập tên tiếng Anh theo thứ tự A–Z, viết liền không khoảng trắng.',
    lockedReason: '',
    canonicalAnswer: 'athenafargo',
    successMessage: 'Bạn gọi đúng tên họ — máy ghi âm thu được phản hồi mới.',
    unlockedDocId: 'DOC-12',
  },
  'Q-GARAGE': {
    id: 'Q-GARAGE',
    promptTitle: 'Tìm chiếc xe nào trong nhà để xe?',
    originalPrompt: 'SEARCH THE PARKING GARAGE',
    formatLabel: 'Nhập dãy ký tự biển số xe, viết liền không khoảng trắng.',
    lockedReason: 'Chưa có manh mối nào dẫn xuống khu nhà để xe dưới sân.',
    canonicalAnswer: 'irqobt',
    successMessage: 'Tìm thấy chiếc xe phủ bụi và chiếc đĩa than trong cốp xe.',
    unlockedDocId: 'DOC-14',
  },
  'Q-WHAT': {
    id: 'Q-WHAT',
    promptTitle: 'Hai bóng người đã làm gì trong phòng 1313?',
    originalPrompt: 'WHAT DID THE SHADOW PEOPLE DO?',
    formatLabel: 'Nhập cụm từ tiếng Anh viết liền, không khoảng trắng.',
    lockedReason: 'Cánh cửa phòng 1313 đóng im ỉm. Bạn chưa rõ điều gì đã xảy ra bên trong.',
    canonicalAnswer: 'summonedsomething',
    successMessage: 'Cánh cửa phòng 1313 mở ra — bạn tìm thấy bức thư giấu sau vách.',
    unlockedDocId: 'DOC-15',
  },
  'Q-CLEANSE': {
    id: 'Q-CLEANSE',
    promptTitle: 'Thực hiện nghi thức thanh tẩy tại phòng 1313',
    originalPrompt: 'WHAT DO YOU USE TO CLEANSE THE 13TH FLOOR?',
    formatLabel: 'Nhập ký hiệu các dụng cụ theo đúng thứ tự thực hiện, viết liền không khoảng trắng.',
    lockedReason: 'Bạn chưa biết trình tự thực hiện nghi thức thanh tẩy tại căn phòng này.',
    canonicalAnswer: 'qnktgs',
    successMessage: 'Nghi thức thanh tẩy hoàn tất. Tầng 13 đã yên tĩnh trở lại.',
    unlockedDocId: 'DOC-16',
    completesGame: true,
  },
};

export function normalizePuzzleAnswer(input: string): string {
  return input.toLowerCase().replace(/\s+/g, '').trim();
}

export function isQuestionAvailable(
  qId: QuestionId,
  progress: PuzzleProgressSnapshot
): boolean {
  switch (qId) {
    case 'Q-READ':
    case 'Q-WHO':
      return true;
    case 'Q-GARAGE':
      return (
        progress.solvedQuestions.includes('Q-READ') &&
        progress.hasRedBook &&
        progress.unlockedDocs.includes('DOC-13')
      );
    case 'Q-WHAT':
      return (
        progress.solvedQuestions.includes('Q-WHO') &&
        progress.solvedQuestions.includes('Q-GARAGE') &&
        progress.unlockedDocs.includes('DOC-12') &&
        progress.unlockedDocs.includes('DOC-14')
      );
    case 'Q-CLEANSE':
      return (
        progress.solvedQuestions.includes('Q-WHAT') &&
        progress.unlockedDocs.includes('DOC-15')
      );
    default:
      return false;
  }
}
