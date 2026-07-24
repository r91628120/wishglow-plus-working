import { IconName } from './iconColors';

export type Affirmation = {
  id: number;
  text: {
    zh: string;
    en: string;
    ja: string;
    ko: string;
  };
  icon: IconName;
  animation: string;
};

export const affirmations: Affirmation[] = [
  {
    id: 1,
    text: {
      zh: "數不盡的好事，現在正以數不盡的方式來到我身上。",
      en: "Countless good things are coming to me in countless ways.",
      ja: "数えきれないほどの良いことが、数えきれない方法で私にやってきています。",
      ko: "셀 수 없이 많은 좋은 일이 셀 수 없이 다양한 방식으로 나에게 오고 있어요."
    },
    icon: "sparkles",
    animation: "rainbow"
  },
  {
    id: 2,
    text: {
      zh: "數不盡的財富，現在正以數不盡的方式來到我身上。",
      en: "Countless wealth is flowing to me in countless ways.",
      ja: "数えきれないほどの富が、数えきれない方法で私に流れてきています。",
      ko: "셀 수 없이 많은 부가 셀 수 없이 다양한 방식으로 나에게 흘러오고 있어요."
    },
    icon: "coins",
    animation: "coins"
  },
  {
    id: 3,
    text: {
      zh: "我做得到！我很棒！",
      en: "I can do it! I'm amazing!",
      ja: "私はできる！私は素晴らしい！",
      ko: "나는 해낼 수 있어요! 나는 멋져요!"
    },
    icon: "trophy",
    animation: "rocket"
  },
  {
    id: 4,
    text: {
      zh: "我很帥、很勇敢！",
      en: "I'm handsome and brave!",
      ja: "私はかっこよくて勇敢です！",
      ko: "나는 잘생기고 용감해요!"
    },
    icon: "shield",
    animation: "bear"
  },
  {
    id: 5,
    text: {
      zh: "我很漂亮、很可愛！",
      en: "I'm beautiful and cute!",
      ja: "私は美しくて可愛い！",
      ko: "나는 예쁘고 귀여워요!"
    },
    icon: "flower",
    animation: "rabbit"
  },
  {
    id: 6,
    text: {
      zh: "我愛你！也愛我自己！",
      en: "I love you! And I love myself too!",
      ja: "あなたを愛しています！そして自分のことも愛しています！",
      ko: "사랑해요! 나 자신도 사랑해요!"
    },
    icon: "heart",
    animation: "hearts"
  },
  {
    id: 7,
    text: {
      zh: "我原諒自己，也原諒別人！",
      en: "I forgive myself and others!",
      ja: "自分を許し、他人も許します！",
      ko: "나는 나 자신을 용서하고, 다른 사람도 용서해요!"
    },
    icon: "leaf",
    animation: "dove"
  },
  {
    id: 8,
    text: {
      zh: "我是不朽的靈性，純潔圓滿！",
      en: "I am an eternal spirit — pure and whole!",
      ja: "私は不滅のスピリット、純粋で完璧な存在です！",
      ko: "나는 불멸의 영혼이에요, 순수하고 완전한 존재예요!"
    },
    icon: "feather",
    animation: "lotus"
  },
  {
    id: 9,
    text: {
      zh: "我感恩所遇見的每一個人！",
      en: "I'm grateful for everyone I meet!",
      ja: "出会うすべての人に感謝しています！",
      ko: "만나는 모든 사람들에게 감사해요!"
    },
    icon: "handshake",
    animation: "prayer"
  },
  {
    id: 10,
    text: {
      zh: "我很健康、很完美、很強壯！",
      en: "I am healthy, perfect, and strong!",
      ja: "私は健康で、完璧で、強いです！",
      ko: "나는 건강하고, 완벽하고, 강해요!"
    },
    icon: "zap",
    animation: "lightning"
  }
];