import type { Note, Category } from './types';

export const initialCategories: Category[] = [
  { id: '1', name: '개인' },
  { id: '2', name: '업무' },
  { id: '3', name: '아이디어' },
];

export const initialNotes: Note[] = [
  {
    id: '1',
    title: '식료품 쇼핑 목록',
    content: '우유,빵,계란,치즈',
    categoryId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: 'medium',
    tags: ['장보기', '집안일'],
    color: 'bg-yellow-200',
    deletedAt: null,
  },
  {
    id: '2',
    title: '3분기 프로젝트 계획',
    content: '3분기 프로젝트 초기 계획 초안을 작성합니다. 핵심 결과물과 일정에 집중해야 합니다. 마케팅 팀과 개발 일정을 반드시 조율해야 합니다. 8월에 디자인 팀의 참여가 어려울 수 있으므로, 7월 말까지 와이어프레임 승인을 완료해야 합니다.',
    categoryId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: 'high',
    tags: ['기획', '마케팅'],
    color: 'bg-blue-200',
    deletedAt: null,
  },
  {
    id: '3',
    title: '앱 아이디어: 식물 관리 도우미',
    content: '사용자가 식물에 물 주는 시기를 놓치지 않도록 도와주는 모바일 앱. 주요 기능: 푸시 알림, 식물 종류별 데이터베이스 및 관리 팁, 성장 과정을 기록하는 사진 로그. 수익 모델은 해충 진단과 같은 프리미엄 기능을 통해 구현할 수 있습니다.',
    categoryId: '3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: 'low',
    tags: ['사이드프로젝트', '앱개발'],
    color: 'bg-green-200',
    deletedAt: null,
  },
   {
    id: '4',
    title: '회의록: 마케팅 캠페인',
    content: '새로운 소셜 미디어 캠페인에 대해 논의했습니다.예산으로 5,000달러를 확정했습니다.이번 주말까지 콘텐츠 제작자를 선정해야 합니다.다음 회의는 금요일에 콘텐츠 초안을 검토하기 위해 열릴 예정입니다.',
    categoryId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: 'medium',
    tags: ['회의록'],
    color: 'bg-purple-200',
    deletedAt: null,
  },
];
