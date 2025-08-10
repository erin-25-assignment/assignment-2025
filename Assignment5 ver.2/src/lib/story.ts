import type { StoryData, ItemsData, GameState, GameAction, Choice } from './types';
import { BriefcaseMedical, Map, KeyRound, ScrollText, Flashlight, Wrench, Radio, Snowflake, MemoryStick, Battery, BookImage } from 'lucide-react';

export type { GameState, GameAction, Choice };

export const itemsData: ItemsData = {
  battery: { name: "Battery", description: "A high-capacity battery. Might power something important.", icon: Battery },
  firstAid: { name: "First-Aid Kit", description: "Contains bandages and antiseptics.", icon: BriefcaseMedical },
  map: { name: "Old Map", description: "A worn map of the mountain area.", icon: Map },
  key: { name: "Cabin Key", description: "An old, ornate key.", icon: KeyRound },
  note: { name: "Torn Note", description: "A piece of a journal, with frantic handwriting.", icon: ScrollText },
  flashlight: { name: "Flashlight", description: "A heavy-duty flashlight.", icon: Flashlight },
  radioParts: { name: "Radio Parts", description: "Spare components for a long-range radio.", icon: Wrench },
  radioRepaired: { name: "Repaired Radio", description: "The radio is now functional.", icon: Radio },
  memoryFragment: { name: "Memory Fragment", description: "A recovered piece of your past.", icon: MemoryStick },
  clue: { name: "Cryptic Clue", description: "A strange symbol on a piece of bark.", icon: ScrollText },
  frostbite: { name: "Frostbite", description: "A chilling injury. You need to find warmth.", icon: Snowflake },
};

export const storyNodes: StoryData = {
  start: {
    text:
      "깊은 눈 속에 묻힌 산장, 차가운 바람과 함께 잃어버린 기억들이 흩날린다.\n" +
      "누군가는 구조를 위해, 또 누군가는 탈출을 위해 그곳에 남아 있다.\n" +
      "숨겨진 진실과 감춰진 감정 사이, 포기되지 않은 이야기가 시작된다.",
    choices: [
      { text: "리오 (구조대원)", next: "rio_intro" },
      { text: "세라 (조난자)", next: "sera_intro" },
    ],
  },

  // -------- 리오 루트 --------
  rio_intro: {
    text:
      "리오는 차가운 눈덮인 산장에서 의식을 되찾는다. 동료를 찾아야 한다는 본능이 가슴을 짓누르지만, 주변은 깊은 침묵에 잠겨 있다.\n기억은 희미하지만, 이곳에 숨겨진 무언가가 그를 부르고 있다.",
    image: "https://placehold.co/800x450.png",
    hint: "snowy cabin interior",
    choices: [
      { text: "산장 내부를 수색한다", next: "rio_explore" },
      { text: "눈 위에 남은 발자국을 따라간다", next: "rio_outside" },
    ],
  },
  rio_outside: {
    text: "눈속에서 동료의 환청이 들린다. 환각인가?",
    image: "https://placehold.co/800x450.png",
    hint: "footprints snow apparition",
    choices: [
      { text: "소리를 따라간다", next: "rio_crevice" },
      { text: "무시하고 장비를 수색한다", next: "rio_explore" },
    ],
  },
  rio_crevice: {
    text: "눈더미 아래 누군가의 손이 보인다. 그러나… 그것은 리오 자신의 손처럼 보인다.",
    image: "https://placehold.co/800x450.png",
    hint: "hand snow surreal",
    choices: [
      { text: "깊이 파헤친다", next: "ending_vision" },
      { text: "뒤로 물러난다", next: "rio_message" },
    ],
  },
  rio_explore: {
    text:
      "산장 한켠에서 부서진 구조 장비와 고장 난 무전기를 발견했다. 희미한 기계음이 산장 안에 울려 퍼진다.\n" +
      "이 무전기를 다시 작동시킬 수 있다면, 누군가와 연결될지도 모른다.",
    image: "https://placehold.co/800x450.png",
    hint: "broken radio equipment",
    choices: [
      { text: "무전기를 수리한다", next: "rio_repair_radio" },
      { text: "더 많은 단서를 찾아본다", next: "rio_message" },
    ],
  },
  rio_repair_radio: {
    text:
      "무전기를 고쳐 신호를 잡았다. 그러나 신호는 여전히 불안정하다.\n" +
      "누군가가 구조 신호를 보내고 있다. 그 목소리는 낯익은 듯하다.",
    image: "https://placehold.co/800x450.png",
    hint: "radio signal light",
    choices: [
      { text: "신호를 따라간다", next: "rio_signal_follow" },
      { text: "잠시 휴식을 취한다", next: "rio_rest" },
    ],
  },
  rio_signal_follow: {
    text:
      "눈 덮인 산장을 가로질러 신호를 좇던 중, 갑작스러운 경고음과 함께 산장 내 경보가 울려 퍼진다.\n" +
      "멀리서 다가오는 발자국 소리에 긴장이 최고조에 달한다.",
    image: "https://placehold.co/800x450.png",
    hint: "red light alarm",
    choices: [
      { text: "숨는다", next: "rio_hiding" },
      { text: "맞서 싸운다", next: "rio_fight" },
    ],
  },
  rio_hiding: {
    text:
      "숨죽인 채로 심장이 터질 듯 뛰고, 무언가가 산장 안을 뒤지고 있다.\n" +
      "머릿속을 스치는 과거의 기억들이 리오를 흔든다.",
    choices: [
      { text: "용기를 내어 나간다", next: "rio_bunker" },
      { text: "계속 숨는다", next: "ending_wait" },
    ],
  },
  rio_fight: {
    text:
      "정체를 알 수 없는 적과 사투를 벌인다. 싸움 끝에 정신을 잃고 쓰러진다.\n" +
      "눈을 떴을 때, 주변은 낯선 벙커 내부였다.",
    image: "https://placehold.co/800x450.png",
    hint: "dark enemy fight",
    choices: [
      { text: "의식을 회복한다", next: "ending_vision" },
      { text: "모든 것을 포기하고 내려놓는다", next: "ending_fade" },
    ],
  },
  rio_rest: {
    text:
      "잠시 휴식하며 뒤섞인 기억 속을 헤맨다.\n" +
      "한 장의 사진이 떠올랐다. 그 안에 세라가 있었다.",
    choices: [
      { text: "사진을 찾아본다", next: "rio_photo_discover" },
      { text: "눈을 감고 깊은 기억을 더듬는다", next: "ending_vision" },
    ],
  },
  rio_photo_discover: {
    text:
      "사진 속 세라가 점점 선명해지며, 마음 깊은 곳에서 감정이 일렁인다.\n" +
      "‘왜 그녀가 여기 있는 걸까? 내가 알던 그녀가 맞나?’",
    image: "https://placehold.co/800x450.png",
    hint: "faded photograph couple",
    choices: [
      { text: "벙커로 향한다", next: "rio_bunker" },
      { text: "사진을 내려놓고 현실에 집중한다", next: "rio_explore" },
    ],
  },
  rio_message: {
    text:
      "누군가가 남긴 낙서: ‘리오, 여기에 갇혔어.’\n" +
      "흔들리는 글씨 끝에는 붉은 피가 번져 있었다.",
    choices: [
      { text: "낙서를 지운다", next: "rio_bunker" },
      { text: "사진으로 기록해둔다", next: "ending_record" },
    ],
  },
  rio_bunker: {
    text:
      "지하 벙커 입구를 발견했다. 차가운 기운이 온몸을 스친다.\n" +
      "이 안에 중요한 진실이 숨어 있을 것만 같다.",
    image: "https://placehold.co/800x450.png",
    hint: "bunker entrance snow",
    choices: [
      { text: "벙커로 내려간다", next: "ending_merge" },
      { text: "두려움에 다시 눈 덮인 세상으로 나간다", next: "ending_fade" },
    ],
  },

  // -------- 세라 루트 --------
  sera_intro: {
    text:
      "세라는 차가운 눈밭을 헤매다 산장을 발견한다. 기억은 조각조각 떠오르지만, 가슴 한켠엔 설명할 수 없는 불안이 깃든다.",
    image: "https://placehold.co/800x450.png",
    hint: "woman snow forest",
    choices: [
      { text: "산장 내부를 둘러본다", next: "sera_living_room" },
      { text: "창밖을 응시한다", next: "sera_radio_static" },
    ],
  },
  sera_living_room: {
    text:
      "거실에서 낡은 신문 조각과 메모를 발견했다.\n‘남은 생존자 1명. 인식 통합 시작.’",
    image: "https://placehold.co/800x450.png",
    hint: "old newspaper memo",
    choices: [
      { text: "메모를 자세히 읽는다", next: "sera_memo_detail" },
      { text: "신문 조각을 챙긴다", next: "sera_photo_fragment" },
    ],
  },
  sera_memo_detail: {
    text:
      "메모지에는 ‘리오’라는 이름이 빼곡히 적혀 있었다.\n글씨는 점점 흔들리고, 마지막 줄엔 피가 번져 있었다.\n\n" +
      "‘리오를… 구하라…’라는 절박한 문장 뒤에 찢긴 흔적이 남아 있다.\n\n" +
      "세라의 심장은 공포와 이상한 끌림 사이에서 요동친다.\n" +
      "이 이름이 낯설지 않다.\n\n" +
      "‘…내가, 그를… 사랑했었나?’",
    choices: [
      { text: "구조 장비가 있을 법한 창고로 향한다", next: "sera_storage_room" },
      { text: "라디오를 켠다", next: "sera_radio_on" },
    ],
  },
    sera_radio_on: {
    text: "라디오에서 잡음과 함께 간헐적으로 구조 신호가 들린다.",
    choices: [
        { text: "신호를 집중해 듣는다", next: "sera_signal_receive" },
        { text: "신호 무시하고 탐색", next: "sera_living_room" },
    ],
  },
  sera_photo_fragment: {
    text:
      "사진 조각 한쪽에 ‘RIO’라는 글씨가 희미하게 적혀 있다.\n" +
      "복잡한 감정이 밀려온다. 왜 이 이름이 내 마음을 이토록 흔드는 걸까?",
    choices: [
      { text: "사진을 모은다", next: "sera_memory_recall" },
      { text: "사진을 두고 간다", next: "sera_radio_on" },
    ],
  },
  sera_memory_recall: {
    text:
      "사진들을 모으면서 잃어버린 기억의 조각들이 조금씩 떠오른다.\n" +
      "리오와 함께한 시간들, 그리고 이별의 아픔.",
    choices: [
      { text: "감정을 억누르고 창고로 향한다", next: "sera_storage_room" },
      { text: "기억과 마주하기 두려워 라디오로 향한다", next: "sera_radio_on" },
    ],
  },
  sera_storage_room: {
    text:
      "창고 문이 얼어붙어 쉽게 열리지 않는다. 뾰족한 도구가 필요해 보인다.",
    image: "https://placehold.co/800x450.png",
    hint: "frozen storage door",
    choices: [
      { text: "주변에서 도구를 찾는다", next: "sera_find_tool" },
      { text: "강제로 문을 연다", next: "sera_alarm_trigger" },
    ],
  },
  sera_find_tool: {
    text:
      "뾰족한 쇠막대를 발견했다. 이걸로 문을 열 수 있을 것 같다.",
    choices: [
      { text: "조심스럽게 문을 연다", next: "sera_inside_storage" },
      { text: "더 안전한 방법을 고민한다", next: "sera_radio_static" },
    ],
  },
  sera_alarm_trigger: {
    text:
      "억지로 문을 열자 경고음이 울리고 산장이 흔들린다!\n" +
      "긴장감이 극에 달한다.",
    image: "https://placehold.co/800x450.png",
    hint: "red light alarm",
    choices: [
      { text: "경고음을 무시하고 탐색을 계속한다", next: "sera_inside_storage" },
      { text: "황급히 문을 닫고 숨는다", next: "sera_hiding" },
    ],
  },
  sera_inside_storage: {
    text:
      "창고 안에서 고장난 무전기 조각과 쪽지를 발견했다.\n" +
      "쪽지에는 ‘세라, 돌아와줘’라는 간절한 글귀가 적혀 있다.",
    image: "https://placehold.co/800x450.png",
    hint: "broken radio note",
    choices: [
      { text: "쪽지를 챙긴다", next: "sera_love_path" },
      { text: "무전기 수리를 시도한다", next: "sera_repair_radio" },
    ],
  },
  sera_love_path: {
    text:
      "쪽지를 읽으며 리오와의 기억이 떠오른다.\n" +
      "혼란스러우면서도 따뜻한 감정이 마음 깊이 스며든다.",
    image: "https://placehold.co/800x450.png",
    hint: "woman reading letter",
    choices: [
      { text: "리오를 찾아 벙커로 내려간다", next: "ending_love_reunion" },
      { text: "기억의 고통을 피해 산장을 떠난다", next: "ending_fade" },
    ],
  },
  sera_repair_radio: {
    text:
      "무전기를 고치려 애쓰지만 상태가 심각하다.\n" +
      "신호가 희미하게 들려온다.",
    image: "https://placehold.co/800x450.png",
    hint: "radio signal light",
    choices: [
      { text: "신호에 집중해 듣는다", next: "sera_signal_receive" },
      { text: "포기하고 산장 탐색을 계속한다", next: "sera_radio_static" },
    ],
  },
  sera_signal_receive: {
    text:
      "라디오에서 리오의 목소리가 들려온다. ‘세라, 너도 거기 있니?’\n" +
      "희망이 가슴 속에 싹튼다.",
    image: "https://placehold.co/800x450.png",
    hint: "woman listening radio",
    choices: [
      { text: "응답을 시도한다", next: "sera_respond_radio" },
      { text: "두려움에 라디오를 끈다", next: "sera_hiding" },
    ],
  },
  sera_respond_radio: {
    text:
      "응답하자 구조 신호가 선명해지고, 두 사람의 연결이 조금씩 가까워진다.\n" +
      "이제 진짜 만날 수 있을까?",
    image: "https://placehold.co/800x450.png",
    hint: "woman hopeful radio",
    choices: [
      { text: "구조 신호를 따라 이동한다", next: "sera_bunker_entrance" },
      { text: "잠시 휴식을 취한다", next: "sera_rest" },
    ],
  },
  sera_hiding: {
    text:
      "조용히 숨어 주변을 살핀다.\n" +
      "산장 안에 무언가 낯선 기운이 감돌고 있다.",
    image: "https://placehold.co/800x450.png",
    hint: "woman hiding shadows",
    choices: [
      { text: "용기를 내 탐색을 재개한다", next: "sera_radio_static" },
      { text: "그냥 앉아 기다린다", next: "ending_wait" },
    ],
  },
  sera_rest: {
    text:
      "잠시 눈을 감았지만, 불안은 쉽게 가시지 않는다.",
    choices: [
      { text: "몸을 추스르고 다시 움직인다", next: "sera_bunker_entrance" },
      { text: "포기하고 눈 밖으로 나간다", next: "ending_fade" },
    ],
  },
  sera_radio_static: {
    text:
      "라디오에서 잡음과 간헐적인 구조 신호가 들려온다.",
    choices: [
      { text: "신호를 분석한다", next: "sera_signal_analysis" },
      { text: "신호를 무시하고 산장 탐색을 계속한다", next: "sera_living_room" },
    ],
  },
  sera_signal_analysis: {
    text:
      "신호가 반복되는 코드로 이루어져 있다.\n" +
      "중요한 메시지가 숨겨져 있는 듯하다.",
    choices: [
      { text: "코드를 해독해본다", next: "sera_decode_success" },
      { text: "더 깊은 곳을 찾아간다", next: "sera_bunker_entrance" },
    ],
  },
  sera_decode_success: {
    text:
      "해독 결과: ‘너와 나, 하나가 되어야 한다’라는 메시지.\n" +
      "이 말의 의미는 무엇일까?",
    choices: [
      { text: "메시지를 곱씹으며 벙커로 향한다", next: "sera_bunker_entrance" },
      { text: "메시지를 무시하고 떠난다", next: "ending_escape" },
    ],
  },
  sera_bunker_entrance: {
    text:
      "지하 벙커 입구 앞. 차가운 공기가 등골을 스친다.\n" +
      "운명의 문 앞에 섰다.",
    image: "https://placehold.co/800x450.png",
    hint: "bunker entrance snow",
    choices: [
      { text: "벙커로 내려간다", next: "ending_merge" },
      { text: "주저하며 밖으로 나간다", next: "ending_fade" },
    ],
  },
  ending_merge: {
    title: "엔딩: 통합된 자아",
    text: "리오와 세라는 서로의 파편이었다.\n깊은 기억의 미로 속에서 둘은 서로를 발견하고 마침내 경계가 허물어진다.\n“나는 너였고, 너는 나였다.”\n사랑과 상처, 기억과 망각이 모두 하나 되어 새로운 ‘나’가 태어난다.\n두 개의 영혼이 하나로 융합되며 오래된 아픔은 희미해지고, 평화가 찾아온다.\n“이제 우리는 온전하다.”",
    isEnd: true,
    image: "https://placehold.co/600x400.png",
    hint: "merging faces mirror",
    choices: [],
  },
  ending_fade: {
    title: "엔딩: 소멸",
    text: "리오와 세라는 끝없이 반복되는 시간 속에서 점점 흐려진다.\n서로를 찾으려 몸부림치지만, 기억은 점점 빛을 잃고 존재는 안개처럼 사라져 간다.\n“왜 계속 같은 곳에 머물러야만 하는가?”\n마지막 속삭임과 함께 둘은 눈 속으로 걸어가며, 반복되는 고통의 굴레에 갇힌다.\n그들의 이야기는 잔잔한 눈보라에 묻혀 사라진다.",
    isEnd: true,
    image: "https://placehold.co/600x400.png",
    hint: "fading silhouette snowstorm",
    choices: [],
  },
  ending_wait: {
    title: "엔딩: 정지된 구조",
    text: "리오는 눈밭 위 홀로 서서, 세라를 기다린다.\n시간은 멈춘 듯 흐르지 않고, 바람은 차갑게 기억을 흔든다.\n“너는 어디에 있니?”\n고독과 불안 속에서도 희미한 희망의 빛을 놓지 않으려 애쓴다.\n그러나 두 사람은 서로에게 닿지 못한 채, 영원히 그 자리에 머무를 운명 같다.",
    isEnd: true,
    image: "https://placehold.co/600x400.png",
    hint: "lone person snow",
    choices: [],
  },
  ending_record: {
    title: "엔딩: 관찰자",
    text: "세라는 낡은 쪽지를 들여다본다.\n그 속엔 두 사람이 남긴 기억과 진실이 적혀 있다.\n“우리가 남긴 이 조각들이 누군가에게 닿을까?”\n그녀는 더 이상 주체가 아니라, 잊혀진 시간을 기록하는 관찰자일 뿐이다.\n과거의 무게가 마음을 짓누르지만, 앞으로 나아갈 힘은 사라졌다.",
    isEnd: true,
    image: "https://placehold.co/600x400.png",
    hint: "person looking notes",
    choices: [],
  },
  ending_love_reunion: {
    title: "엔딩: 재회의 사랑",
    text: "눈꽃이 흩날리는 순간, 리오와 세라는 마주 선다.\n서로의 눈동자에서 잃어버린 기억과 감정이 조심스럽게 피어난다.\n“그리웠어, 이렇게 다시 만날 줄은 몰랐어.”\n모든 아픔과 혼란이 사라지고, 다시 시작할 희망이 마음에 피어난다.\n이 순간만큼은 영원히 기억될 것이다.",
    isEnd: true,
    image: "https://placehold.co/600x400.png",
    hint: "couple reunion snow",
    choices: [],
  },
  ending_escape: {
    title: "엔딩: 탈출 없는 탈출",
    text: "리오는 차가운 눈밭을 뒤로하며 걷는다.\n세라는 그 곁에 없지만, 마음 깊은 곳엔 그 흔적이 지워지지 않는다.\n“언젠가 다시 만나겠지… 아니면…”\n진실과 기억은 눈 아래 잠들었지만, 도망칠 수 없는 굴레처럼 그를 따라온다.\n탈출했지만 결코 자유로울 수 없는 현실.",
    isEnd: true,
    image: "https://placehold.co/600x400.png",
    hint: "figure walking snow",
    choices: [],
  },
  ending_vision: {
    title: "엔딩: 환영 속 진실",
    text: "거울 속에서 세라는 자신의 얼굴을 본다.\n그 얼굴은 리오의 모습이기도 하고, 세라의 모습이기도 하다.\n“나는 누구인가?”\n현실과 환영의 경계가 흐려지고, 정체성의 혼란 속에서 방황한다.\n진실은 알 수 없고, 그저 허공 속에서 자신을 붙잡으려 한다.",
    isEnd: true,
    image: "https://placehold.co/600x400.png",
    hint: "distorted reflection mirror",
    choices: [],
  },
  ending_signal: {
    title: "엔딩: 반복되는 구조",
    text: "멀리서 울리는 신호 속에서, 리오와 세라는 서로를 부른다.\n누가 송신자이고, 누가 수신자인지 알 수 없다.\n“여기 있어, 나는 아직 여기야.”\n구조의 노래는 끝나지 않고, 두 사람은 고립과 희망의 반복 속에서 갇혀 있다.\n영원한 기다림과 부름이 이어진다.",
    isEnd: true,
    image: "https://placehold.co/600x400.png",
    hint: "radio signal night",
    choices: [],
  },
  ending_success: {
    title: "엔딩: 성공적 구조",
    text: "구조 헬기의 불빛 아래, 리오와 세라는 서로를 바라본다.\n긴 여정 끝에 안전한 곳으로 옮겨지며, 희망이 다시 피어난다.\n“우리는 살아남았어. 그리고 다시 시작할 수 있어.”\n고통과 아픔 뒤에 찾아온 따뜻한 구원의 순간.",
    isEnd: true,
    image: "https://placehold.co/600x400.png",
    hint: "rescue helicopter light",
    choices: [],
  },
  ending_failure: {
    title: "엔딩: 실패 및 고립",
    text: "신호가 점점 왜곡되고 끊긴다.\n리오와 세라는 점점 고립되어 간다.\n“누군가… 들리나요?”\n외로움과 어둠이 몸을 감싸며, 그들의 목소리는 점점 잦아든다.\n희망이 사라져 가는 고통스러운 순간.",
    isEnd: true,
    image: "https://placehold.co/600x400.png",
    hint: "distorted signal dark",
    choices: [],
  },
  ending_madness: {
    title: "엔딩: 혼란과 미쳐감",
    text: "리오는 기억과 진실을 거부한다.\n혼란이 그의 마음을 집어삼키고, 고통 속에서 미쳐간다.\n“진실을 피할수록… 나는 점점 사라져간다.”\n그의 자아는 부서지고, 어둠이 그의 정신을 덮는다.\n깊은 절망과 두려움이 그의 마지막을 감싼다.",
    isEnd: true,
    image: "https://placehold.co/600x400.png",
    hint: "distorted face memory",
    choices: [],
  },
  ending_secret_accept: {
    title: "엔딩: 진실 수용",
    text: "세라는 산장의 어두운 비밀을 마주한다.\n그 진실은 슬프지만, 받아들이기로 한다.\n“진실과 화해하는 것이 내 길이다.”\n슬픔과 희망이 교차하는 그 순간, 그녀는 새로운 시작을 준비한다.\n아픔 속에서도 성장하는 용기를 배운다.",
    isEnd: true,
    image: "https://placehold.co/600x400.png",
    hint: "light dark cabin",
    choices: [],
  },
};

export const isEndingNode = (nodeKey: string): boolean => {
    return !!storyNodes[nodeKey]?.isEnd;
}

export const totalEndings = Object.keys(storyNodes).filter(isEndingNode).length;
