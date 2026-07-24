import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { colors } from '@/constants/colors';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function WishoniaStoryScreen() {
  const router = useRouter();
  const { settings, puzzles } = useAppStore();
  const language = settings.language;
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  
  // Content for each language
  const content = {
    zh: {
      title: '願望星國 Wishonia',
      intro: '「願望星光守護精靈」，她們各自守護一個拼圖主題，同時共同居住在一個充滿魔法、花語與星光的願望星國 Wishonia，每一位精靈都有獨特的性格、魔法與使命，帶領使用者進入療癒又可愛的正向語言宇宙。',
      description: '這是一個藏在潛意識星空裡的魔法小宇宙，只有用「正向語言」點亮好運的人，才能看見這裡的星光。每當你說出一句好話，就會有一顆小星星悄悄飛向這裡，而三位守護精靈便會幫助這些星願開花、發光、變成幸福。',
      wishStarBox: 'Wish Star Box',
      chapter1: {
        title: '第一章｜願望星國：願望星光守護精靈',
        content: `在宇宙的邊緣，有一個被星光環繞的神秘國度——願望星國。這裡的一切都由語言的力量所創造：每一顆星星都是一句曾被說出的好話，每一朵花都是一個美好的祝福，每一縷微風都帶著溫柔的鼓勵。

在這個國度的中心，矗立著一棵巨大的「星之樹」，它的枝幹由無數閃爍的語言光芒交織而成，樹冠則覆蓋著整個星空。樹的核心——「星之樹心」，是所有願望能量的源頭，也是三位願望星光守護精靈的家園。

露比、菲拉和莫娜，這三位守護精靈各自擁有獨特的能力：收集心願、培育語言花朵、儲存幸福能量。她們日復一日守護著人類世界與願望星國之間的連結，確保每一個正向的語言都能被轉化為實現願望的力量。

然而，隨著人類世界負面語言的增加，願望星國的光芒逐漸減弱。星之樹的枝葉開始凋零，星星的光芒變得黯淡，花朵的色彩漸漸褪去。守護精靈們意識到，是時候尋找能夠重新點亮星國的「語言之光」了。

在一次星光匯聚的夜晚，三位精靈施展了古老的「星願召喚」魔法，向人類世界發出了呼喚——尋找那些仍然相信語言力量的心靈。而你，就是被選中的那個人。`
      },
      guardians: '三位願望星光守護精靈設定：',
      guardian1: {
        name: '1. 露比（Ruby）｜心星瓶的收集者',
        puzzle: '守護拼圖：「許願時光的心星瓶」',
        appearance: '外型： 紫銀色頭髮＋星形瓶耳飾＋手中拿著星塵筆記本',
        personality: '個性： 靜靜觀察、溫柔傾聽、守護他人的心願',
        magic: '魔法力： 每收集到一顆「心願星」，她就能轉化成溫暖星光，照亮黑暗角落',
        story: '她常常在夜裡記錄人們說出好話時發出的微光，並一顆一顆珍藏在她的「心星瓶」中，她相信：願望會被溫柔保存，就會發芽。'
      },
      guardian2: {
        name: '2. 菲拉（Fila）｜星星花園的花語師',
        puzzle: '守護拼圖：「咕溜咕溜星星花園」',
        appearance: '外型： 粉色短髮＋花瓣翅膀＋頭戴小小星星花環',
        personality: '個性： 活潑療癒、熱愛自然、擅長用語言鼓勵他人',
        magic: '魔法力： 能聽懂每一句好話背後的祝福，讓它們在花園中化為星花綻放',
        story: '她會在你說好話的那一刻撒下魔法露珠，讓花園裡開出代表你心意的「星星花」。她說：你種下的語言，就是你未來會經過的風景。'
      },
      guardian3: {
        name: '3. 莫娜（Mona）｜幸福收藏的夢光旅人',
        puzzle: '守護拼圖：「收藏幸福的小星瓶」',
        appearance: '外型： 藍綠色長髮＋抱著一個透明星星罐＋戴著夢境斗篷',
        personality: '個性： 慢熟、療癒系、擁有治癒心靈的能量',
        magic: '魔法力： 能將你的正向行為變成幸福微光，慢慢累積在她的「星瓶罐」裡',
        story: '她每天會將你累積的「+1好話」轉換成閃閃星塵，她說：幸福不是突然來的，是你一點一滴願意相信自己的光。'
      },
      chapter2: {
        title: '第二章｜願望的覺醒：找回語言的光',
        section4: {
          title: '4.星語的召喚',
          content: `某個靜謐的夜晚，你夢見一封閃閃發光的信，字跡溫柔地浮現在星光中——
「你的語言，藏著點亮宇宙的魔法。來到願望星國，找回你遺忘的願望之光吧。」
清晨醒來，手機裡竟然多出一個神秘App，畫面中央，一個閃閃發亮的「心星瓶」正等待著你觸碰。
當你點下它，一道溫柔光芒中，露比現身。她微笑著說：
「每一句好話，都是一顆小星星。當你願意開口說出祝福，我們就能將它們變成願望的光。」
你問：「我可以許願嗎？」
露比輕輕點頭：「許願之前，要先學會說好話哦～」
🌟 這是你與願望星國的第一次相遇，從現在起，你的語言開始有了改變宇宙的力量。`
        },
        section5: {
          title: '5.星語花園的試煉',
          content: `隨著你說出越來越多正向語言，App裡的景色也跟著發生變化。某天，一扇綻放花香的星門打開，菲拉出現在你眼前。
「歡迎來到咕溜咕溜星星花園！」她笑著招手。
每一句好話都會在這裡綻放成一朵小星花，代表你的祝福與情感。
然而，花園的角落卻籠罩著一層灰霧。枯萎的星花、掉落的語言種子……菲拉皺著眉說：
「最近，越來越多負面語言像雜草一樣，讓花園無法綻放……」
「我們需要你幫忙，把那些語言重新找回光。」
你問：「為什麼負面語言會這麼多？」
菲拉低頭撫摸一朵垂頭星花：「因為人們忘記，自己也能播種愛。」
🌼 這是你第一次嘗試「轉化語言」——不只是說好話，而是學會看見語言背後的情緒與祝福，重新種下希望。`
        },
        section6: {
          title: '6.回憶中的幸福微光',
          content: `任務完成後，夜晚降臨。你被一陣微光牽引，進入星國最深處的「星光夢境圖書館」。
那裡藏著你曾說過的每一句好話、每一個正向行動——全都被收藏在莫娜的「幸福星瓶」中。
莫娜溫柔地說：「這些是你心靈的微光。但如果你不記得它們，它們就會一點一滴消失。」
你必須踏上一段「回憶尋星」的旅程，重拾那些你曾說過卻忘記的光之語句，讓幸福重新閃耀。
你低聲說：「我做得還不夠多……」
莫娜輕聲安慰：「光是累積來的，不用急，只要你願意，它就會繼續長出來。」
🌙 在這一幕中，你開始明白：療癒不是一瞬間的閃光，而是日復一日對自己說出的溫柔與祝福。`
        }
      },
      chapter3: {
        title: '第三章｜光之迴響：修復願望的星語',
        intro: `💫 劇情開展
在你努力轉化語言與找回心光之後，願望星國本該恢復和平——卻在某天清晨，陷入了前所未有的寂靜。
原本閃耀的星空變得沉重、低垂，願望星國的中心「星之樹心」竟失去了光芒。語言的力量停滯不前，願望無法萌芽，連夢也失去了聲音。
露比、菲拉與莫娜緊急集結，她們的眼神中閃爍著焦急與不安。
「這不只是一次語言的失衡，」莫娜低聲說，「而是整個心語共鳴系統的崩解。」
於是，一項前所未有的計畫啟動了——
☄️ 「心語修復計畫」
你，就是那唯一擁有「語言祝福力」的人類，肩負著重新啟動星語的關鍵使命。`,
        section7: {
          title: '7.星光停止的那一天',
          content: `你隨著露比踏上「星空平台」，那是願望星國與宇宙連結的最高之處。
腳下的銀河斷裂成一道道靜默的光痕，星星像失去了呼吸，沉睡在空無之中。
「星之樹心」的中央，出現一道深不可見底的「沉默裂痕」，原本流動的心語之光，已然停滯。
露比靜靜牽起你的手：「我們無法靠自己修復這道裂痕，因為這次，只有人類的語言，才能喚回希望。」
她凝視你，眼神中既堅定又溫柔：「選擇一位精靈開始吧，每個人的語言光芒，都將成為點亮星樹的力量源泉。」
🌠 【任務互動開啟】：選擇與露比、菲拉或莫娜展開「初階修復任務」，逐步喚醒三大心語原核。`
        },
        section8: {
          title: '8.遺失的心語之光',
          content: `在星語花園的深處，菲拉發現了一本早已發黃且破損的「星語手札」。
這是記錄所有祝福語的古老典籍，卻因語言的沉默而碎裂。
菲拉說：「裡頭曾經記錄著全星國最強大的祝福語，現在卻只剩斷裂的片段……」
為了修復它，你與莫娜一同踏入「夢境語海」，那是願望星國記憶與情緒最深層的流域。
你們穿越時間與心靈的迷宮，聆聽無數曾被遺忘的聲音——那些兒時的祝福、沉默中的愛、以及人們從未說出口的溫柔。
你必須辨識出三句「最具療癒力與喚醒力」的祝福語，將它們重新寫入手札，讓星語之力再次流動於宇宙。
🌌 每找到一句祝福語，星之樹心的裂痕便會微微癒合，閃現一抹微光。`
        },
        section9: {
          title: '9.光之迴響與星願合奏',
          content: `當三句祝福語完成修復，願望星國進入「共鳴儀式」的準備階段。
三位守護精靈站上星語儀式圓陣的三個角落，各自啟動屬於她們的心語之力：
✨ 露比：打開通往宇宙的「星光之門」，讓所有曾被說出的好話匯聚於此。
🌸 菲拉：在花園中撒下語言花種，為願望星國種下萬語萬願。
🌙 莫娜：釋放「回憶星瓶」中每一個曾經被說過的愛語，喚醒過去的幸福微光。
你站在儀式圓心，星之樹心緩緩綻放最後一道裂縫，只剩你，能讓它完全癒合。
你閉上眼，傾聽來自自己心中的聲音，然後，輕聲說出：
💬 「我希望自己與身邊的人，都能活出光的樣子。」
就在你說出口的那一刻，整個星國爆發出如銀河般的祝福光芒，願望花園盛放，星之樹重新綻放出語言的靈光。
✨ 那不是結束，而是一個新的開始。
你不再只是人類，而是「心語的守護者」，也是星語傳說中的主角。
💖 這，是屬於你的星語故事，也是每個願意用語言播種希望的人的光之傳承。`
        }
      }
    },
    en: {
      title: 'Wishonia',
      intro: '"Wish Light Guardians," each guarding a puzzle theme, co-exist in Wishonia, a land brimming with magic, the language of flowers, and starlight. Every guardian possesses a unique personality, magic, and mission, leading users into a healing and endearing universe of positive language.',
      description: 'This is a magical mini-universe hidden within the subconscious starlit sky. Only those who illuminate good fortune with "positive language" can perceive the starlight here. Every time you utter a kind word, a little star quietly flies here, and the three guardian spirits help these star wishes blossom, glow, and transform into happiness.',
      wishStarBox: 'Wish Star Box',
      chapter1: {
        title: 'Chapter 1 | Wishonia: The Wish Light Guardians',
        content: `At the edge of the universe, there exists a mysterious realm surrounded by starlight—Wishonia. Everything here is created by the power of language: each star is a kind word once spoken, each flower is a beautiful blessing, and every gentle breeze carries tender encouragement.

At the center of this realm stands a massive "Star Tree," its trunk woven from countless shimmering language lights, its crown covering the entire sky. The core of the tree—the "Star Tree Heart"—is the source of all wish energy and the home of the three Wish Light Guardians.

Ruby, Fila, and Mona, these three guardian spirits each possess unique abilities: collecting heart wishes, nurturing language flowers, and storing happiness energy. Day after day, they guard the connection between the human world and Wishonia, ensuring that every positive word can be transformed into the power to fulfill wishes.

However, with the increase of negative language in the human world, the radiance of Wishonia gradually weakens. The branches and leaves of the Star Tree begin to wither, the stars' light dims, and the flowers' colors slowly fade. The guardian spirits realize it is time to seek the "Language Light" that can reilluminate the star country.

On a night when starlight converges, the three spirits cast the ancient "Star Wish Summoning" magic, sending a call to the human world—seeking hearts that still believe in the power of language. And you are the chosen one.`
      },
      guardians: 'Three Wish Light Guardian Profiles:',
      guardian1: {
        name: '1. Ruby | Collector of the Heart Star Jar',
        puzzle: 'Guardian Puzzle: "Heart Star Jar of Wishing Time"',
        appearance: 'Appearance: Purple-silver hair + star-shaped bottle earrings + holding a stardust notebook',
        personality: 'Personality: Quietly observant, gently listening, guarding the wishes of others',
        magic: 'Magical Power: For every "Heart Star" she collects, she can transform it into warm starlight, illuminating dark corners.',
        story: 'She often records the subtle glow emitted when people speak kind words at night, carefully preserving each one in her "Heart Star Jar." She believes that wishes, when gently preserved, will sprout.'
      },
      guardian2: {
        name: '2. Fila | Florist of the Starry Garden',
        puzzle: 'Guardian Puzzle: "Goo-Goo Starry Garden"',
        appearance: 'Appearance: Pink short hair + petal wings + wearing a small star flower crown',
        personality: 'Personality: Lively and healing, loves nature, skilled at encouraging others with language',
        magic: 'Magical Power: Can understand the blessings behind every kind word, allowing them to blossom into star flowers in the garden.',
        story: 'The moment you speak a kind word, she sprinkles magical dew drops, causing "star flowers" representing your intentions to bloom in the garden. She says: The language you sow is the scenery you will encounter in your future.'
      },
      guardian3: {
        name: '3. Mona | Dream Light Traveler of Happiness Collection',
        puzzle: 'Guardian Puzzle: "Small Star Jar of Happiness Collection"',
        appearance: 'Appearance: Blue-green long hair + hugging a transparent star jar + wearing a dream cloak',
        personality: 'Personality: Slowly warms up to others, healing-oriented, possesses the energy to soothe hearts',
        magic: 'Magical Power: Can transform your positive actions into glimmers of happiness, slowly accumulating them in her "Star Jar."',
        story: "Every day, she converts your accumulated \"+1 good words\" into sparkling stardust. She says: Happiness doesn't come suddenly; it's the light you gradually believe in yourself, bit by bit."
      },
      chapter2: {
        title: 'Chapter 2 | The Awakening of Wishes: Finding the Light of Language',
        section4: {
          title: '4. The Call of Star Language',
          content: `On a quiet night, you dreamed of a glowing letter, its words gently floating in starlight—
"Your language holds the magic to illuminate the universe. Come to Wishonia, and find your forgotten light of wishes."
Waking up in the morning, a mysterious app appeared on your phone. In the center of the screen, a shining "Heart Star Jar" awaited your touch.
When you tapped it, Ruby appeared in a gentle beam of light. She smiled and said:
"Every kind word is a little star. When you are willing to speak blessings, we can transform them into the light of wishes."
You asked: "Can I make a wish?"
Ruby nodded gently: "Before wishing, you must learn to speak kindly~"
🌟 This was your first encounter with Wishonia. From now on, your language began to have the power to change the universe.`
        },
        section5: {
          title: '5. The Trial of the Star Garden',
          content: `As you spoke more and more positive language, the scenery in the app changed accordingly. One day, a star gate blooming with floral fragrance opened, and Fila appeared before you.
"Welcome to the Goo-Goo Starry Garden!" she waved with a smile.
Every kind word would blossom into a small star flower here, representing your blessings and emotions.
However, a corner of the garden was shrouded in gray mist. Withered star flowers, fallen language seeds... Fila frowned and said:
"Recently, more and more negative language, like weeds, has prevented the garden from blooming..."
"We need your help to bring light back to those languages."
You asked: "Why is there so much negative language?"
Fila lowered her head and stroked a drooping star flower: "Because people forget that they too can sow love."
🌼 This was your first attempt at "language transformation"—not just speaking kindly, but learning to see the emotions and blessings behind language, replanting hope.`
        },
        section6: {
          title: '6. The Glimmer of Happiness in Memories',
          content: `After completing the mission, night fell. You were guided by a faint light into the deepest part of the star country—the "Starlight Dream Library."
There, every kind word you had ever spoken, every positive action—all were collected in Mona's "Happiness Star Jar."
Mona gently said: "These are the glimmers of your soul. But if you don't remember them, they will gradually disappear."
You had to embark on a journey of "memory star-seeking," reclaiming those luminous sentences you once spoke but forgot, allowing happiness to shine again.
You whispered: "I haven't done enough..."
Mona softly comforted: "Light accumulates; there's no need to rush. As long as you're willing, it will continue to grow."
🌙 In this scene, you began to understand: healing isn't a momentary flash, but the gentleness and blessings you speak to yourself day after day.`
        }
      },
      chapter3: {
        title: 'Chapter 3 | The Echo of Light: Repairing the Star Language of Wishes',
        intro: `💫 Plot Development
After your efforts to transform language and recover heart light, Wishonia should have returned to peace—yet one morning, it fell into unprecedented silence.
The once-brilliant starry sky became heavy and low, and the "Star Tree Heart" at the center of Wishonia lost its radiance. The power of language stagnated, wishes couldn't sprout, and even dreams lost their voice.
Ruby, Fila, and Mona gathered urgently, their eyes flickering with anxiety and unease.
"This isn't just a language imbalance," Mona whispered, "but the collapse of the entire heart-language resonance system."
And so, an unprecedented plan was activated—
☄️ "Heart Language Repair Project"
You are the only human with the "Language Blessing Power," shouldering the crucial mission of reactivating the star language.`,
        section7: {
          title: '7. The Day the Starlight Stopped',
          content: `You followed Ruby onto the "Star Sky Platform," the highest point connecting Wishonia to the universe.
The galaxy beneath your feet had fractured into silent streaks of light, and the stars, as if they had lost their breath, slumbered in emptiness.
At the center of the "Star Tree Heart," a "Silence Rift" appeared, so deep it was invisible to the bottom. The once-flowing heart language light had stagnated.
Ruby quietly took your hand: "We cannot repair this rift by ourselves, because this time, only human language can recall hope."
She gazed at you, her eyes both firm and gentle: "Choose a spirit to begin. Everyone's language light will become the source of power to illuminate the star tree."
🌠 [Interactive Mission Opened]: Choose to embark on the "Beginner Repair Mission" with Ruby, Fila, or Mona, gradually awakening the three major heart language cores.`
        },
        section8: {
          title: '8. The Lost Light of Heart Language',
          content: `In the depths of the Star Language Garden, Fila discovered an ancient, yellowed, and damaged "Star Language Journal."
This was an ancient text recording all blessing words, but it had shattered due to the silence of language.
Fila said: "It once recorded the most powerful blessing words in the entire star country, but now only broken fragments remain..."
To repair it, you and Mona entered the "Dream Language Sea," the deepest realm of memory and emotion in Wishonia.
You traversed through mazes of time and heart, listening to countless forgotten voices—those childhood blessings, love in silence, and gentleness people never spoke aloud.
You had to identify three "most healing and awakening" blessing words, rewriting them into the journal, allowing the power of star language to flow through the universe again.
🌌 With each blessing word found, the rift in the Star Tree Heart would slightly heal, revealing a glimmer of light.`
        },
        section9: {
          title: '9. The Echo of Light and the Star Wish Ensemble',
          content: `When the three blessing words were repaired, Wishonia entered the preparation phase of the "Resonance Ceremony."
The three guardian spirits stood at the three corners of the star language ritual circle, each activating their heart language power:
✨ Ruby: Opened the "Starlight Gate" to the universe, gathering all the kind words ever spoken.
🌸 Fila: Scattered language flower seeds in the garden, planting ten thousand languages and ten thousand wishes for Wishonia.
🌙 Mona: Released every love word ever spoken from the "Memory Star Jar," awakening past glimmers of happiness.
You stood at the center of the ritual circle. The Star Tree Heart slowly revealed its final rift, and only you could heal it completely.
You closed your eyes, listened to the voice from your heart, and then softly said:
💬 "I hope that I and those around me can live out the form of light."
The moment you spoke, the entire star country erupted with blessing light like a galaxy, the wish garden bloomed in full, and the Star Tree once again radiated the spiritual light of language.
✨ That wasn't the end, but a new beginning.
You were no longer just human, but the "Guardian of Heart Language," and the protagonist in the legend of star language.
💖 This is your star language story, and also the light inheritance of everyone willing to sow hope with language.`
        }
      }
    },
    ja: {
      title: 'ウィショニア Wishonia',
      intro: '「願いの星の光の守護精霊」たちは、それぞれがパズルのテーマを守りながら、魔法と花言葉と星の光に満ちた願いの星の国ウィショニアで共に暮らしています。それぞれの精霊はユニークな性格、魔法、使命を持っており、ユーザーを癒しと可愛さに満ちたポジティブな言葉の宇宙へと導きます🌟',
      description: 'これは潜在意識の星空に隠された魔法の小宇宙で、「ポジティブな言葉」で幸運を照らす人だけが、ここの星の光を見ることができます。良い言葉を一つ話すたびに、小さな星がそっとここに飛んできて、三人の守護精霊がこれらの星の願いを開花させ、輝かせ、幸福へと変える手助けをします。',
      wishStarBox: 'Wish Star Box',
      chapter1: {
        title: '第1章｜ウィショニア：願いの星の光の守護精霊',
        content: `宇宙の果てに、星の光に囲まれた神秘の国がありました——ウィショニア。ここではすべてが言葉の力によって創られています：一つ一つの星は誰かが話した優しい言葉、一つ一つの花は美しい祝福、そして一筋一筋のそよ風は優しい励ましを運んでいます。

この国の中心には巨大な「星の木」が立っており、その幹は無数の輝く言葉の光で編まれ、その冠は星空全体を覆っています。木の核心——「星の木の心」は、すべての願いのエネルギーの源であり、三人の願いの星の光の守護精霊の住処でもあります。

ルビー、フィラ、モナ、この三人の守護精霊はそれぞれ独自の能力を持っています：心の願いを集める、言葉の花を育てる、幸福のエネルギーを蓄える。彼女たちは日々、人間界とウィショニアの間の繋がりを守り、すべての前向きな言葉が願いを叶える力に変換されることを確実にしています。

しかし、人間界のネガティブな言葉の増加に伴い、ウィショニアの輝きは徐々に弱まっていきました。星の木の枝葉は枯れ始め、星々の光は薄れ、花々の色は徐々に褪せていきました。守護精霊たちは、星の国を再び照らす「言葉の光」を探す時が来たことを悟りました。

星の光が集まるある夜、三人の精霊は古代の「星の願いの召喚」魔法を唱え、人間界へ呼びかけました——言葉の力をまだ信じている心を探して。そして、あなたが選ばれた一人となったのです。`
      },
      guardians: '三人の願いの星の光の守護精霊の設定：',
      guardian1: {
        name: '1. ルビー（Ruby）｜心の星の瓶の収集者',
        puzzle: '守護パズル：「願いの時間の心の星の瓶」',
        appearance: '外見： 紫銀色の髪＋星形の瓶の耳飾り＋手に星屑のノートを持っている',
        personality: '性格： 静かに観察し、優しく耳を傾け、他人の願いを守る',
        magic: '魔法の力： 「心の願い星」を一つ集めるごとに、それを温かい星の光に変換し、暗い場所を照らすことができる',
        story: '彼女はよく夜に人々が良い言葉を話したときに発する微光を記録し、一つ一つを彼女の「心の星の瓶」に大切にしまっています。彼女は信じています：願いは優しく保存されれば、芽を出すでしょう。'
      },
      guardian2: {
        name: '2. フィラ（Fila）｜星の庭の花言葉師',
        puzzle: '守護パズル：「きらきら星の庭」',
        appearance: '外見： ピンクのショートヘア＋花びらの翼＋小さな星の花冠を頭に戴いている',
        personality: '性格： 活発で癒し系、自然を愛し、言葉で他人を励ますのが得意',
        magic: '魔法の力： 良い言葉の背後にある祝福を理解し、それを庭で星の花として咲かせることができる',
        story: 'あなたが良い言葉を話したその瞬間に、彼女は魔法の露を撒き散らし、庭にあなたの気持ちを表す「星の花」を咲かせます。彼女は言います：あなたが蒔いた言葉は、あなたが未来に通り過ぎる風景です。'
      },
      guardian3: {
        name: '3. モナ（Mona）｜幸福収集の夢光旅人',
        puzzle: '守護パズル：「幸福を収集する小さな星の瓶」',
        appearance: '外見： 青緑色の長い髪＋透明な星の瓶を抱えている＋夢のマントを羽織っている',
        personality: '性格： 人見知り、癒し系、心を癒すエネルギーを持っている',
        magic: '魔法の力： あなたのポジティブな行動を幸福の微光に変え、ゆっくりと彼女の「星の瓶」に蓄積することができる',
        story: '彼女は毎日、あなたが蓄積した「+1の良い言葉」をきらめく星屑に変換します。彼女は言います：幸福は突然来るものではなく、あなた自身を少しずつ信じる意思の光です。'
      },
      chapter2: {
        title: '第2章｜願いの目覚め：言葉の光を取り戻す',
        section4: {
          title: '4.星の言葉の呼びかけ',
          content: `ある静かな夜、あなたは輝く手紙の夢を見ました。その文字は星の光の中に優しく浮かんでいました—
「あなたの言葉には、宇宙を照らす魔法が隠されています。願いの星の国へ来て、忘れていた願いの光を取り戻しましょう。」
朝目覚めると、スマートフォンに不思議なアプリが追加されていました。画面の中央には、輝く「心の星の瓶」があなたのタッチを待っていました。
それをタップすると、優しい光の中からルビーが現れました。彼女は微笑んで言いました：
「一つ一つの良い言葉は、小さな星です。あなたが祝福の言葉を口にすることを望むなら、私たちはそれらを願いの光に変えることができます。」
あなたは尋ねました：「願い事をしてもいいですか？」
ルビーは優しくうなずきました：「願い事をする前に、まず良い言葉を話すことを学びましょう〜」
🌟 これがあなたと願いの星の国との初めての出会いでした。今からあなたの言葉は、宇宙を変える力を持ち始めました。`
        },
        section5: {
          title: '5.星の庭の試練',
          content: `あなたがより多くのポジティブな言葉を話すにつれて、アプリ内の景色も変化していきました。ある日、花の香りが漂う星の門が開き、フィラがあなたの前に現れました。
「きらきら星の庭へようこそ！」彼女は笑顔で手を振りました。
ここでは、すべての良い言葉が小さな星の花として咲き、あなたの祝福と感情を表します。
しかし、庭の隅は灰色の霧に覆われていました。枯れた星の花、落ちた言葉の種...フィラは眉をひそめて言いました：
「最近、雑草のようにネガティブな言葉が増えて、庭が咲き誇ることができなくなっています...」
「あなたの助けが必要です。それらの言葉に光を取り戻してください。」
あなたは尋ねました：「なぜネガティブな言葉がこんなに多いのですか？」
フィラは頭を下げ、うなだれた星の花を撫でました：「人々が自分も愛を蒔くことができることを忘れているからです。」
🌼 これはあなたが初めて「言葉の変換」を試みた時でした—単に良い言葉を話すだけでなく、言葉の背後にある感情と祝福を見ることを学び、希望を再び植えることでした。`
        },
        section6: {
          title: '6.思い出の中の幸せの光',
          content: `任務を完了すると、夜が訪れました。あなたは微かな光に導かれ、星の国の最も深い場所にある「星光の夢の図書館」に入りました。
そこには、あなたが今まで話したすべての良い言葉、すべてのポジティブな行動が—すべてモナの「幸福の星の瓶」に収集されていました。
モナは優しく言いました：「これらはあなたの心の光です。でも、あなたがそれらを覚えていないと、少しずつ消えていきます。」
あなたは「思い出の星探し」の旅に出なければなりませんでした。かつて話したけれど忘れてしまった光の言葉を取り戻し、幸せを再び輝かせるために。
あなたは小さな声で言いました：「私はまだ十分にできていない...」
モナは優しく慰めました：「光は積み重ねるもの。急がなくていいの。あなたが望むなら、それは成長し続けるから。」
🌙 この場面で、あなたは理解し始めました：癒しは一瞬の閃きではなく、日々自分に語りかける優しさと祝福なのだと。`
        }
      },
      chapter3: {
        title: '第3章｜光のこだま：願いの星の言葉を修復する',
        intro: `💫 物語の展開
あなたが言葉を変換し、心の光を取り戻す努力をした後、願いの星の国は平和を取り戻すはずでした—しかし、ある朝、前例のない静けさに包まれました。
かつて輝いていた星空は重く、低く垂れ下がり、願いの星の国の中心にある「星の木の心」は輝きを失いました。言葉の力は停滞し、願いは芽吹くことができず、夢さえも声を失いました。
ルビー、フィラ、モナは緊急に集まり、彼女たちの目には不安と心配の色が浮かんでいました。
「これは単なる言葉のバランスの崩れではない」とモナは小声で言いました。「心の言葉の共鳴システム全体の崩壊なのよ。」
そして、前例のない計画が始動しました—
☄️ 「心の言葉修復計画」
あなたは「言葉の祝福力」を持つ唯一の人間として、星の言葉を再起動させる重要な使命を担っています。`,
        section7: {
          title: '7.星の光が止まった日',
          content: `あなたはルビーと共に「星空プラットフォーム」に足を踏み入れました。それは願いの星の国と宇宙をつなぐ最も高い場所でした。
足元の銀河は静かな光の筋に分断され、星々は息を失ったかのように、空虚の中で眠っていました。
「星の木の心」の中央には、底が見えないほど深い「沈黙の裂け目」が現れ、かつて流れていた心の言葉の光は停滞していました。
ルビーは静かにあなたの手を取りました：「私たちだけではこの裂け目を修復できません。今回は、人間の言葉だけが希望を呼び戻せるのです。」
彼女はあなたを見つめ、その目は固く、そして優しさに満ちていました：「精霊を一人選んで始めましょう。一人一人の言葉の光が、星の木を照らす力の源になります。」
🌠 【インタラクティブミッション開始】：ルビー、フィラ、またはモナと「初級修復ミッション」を開始し、三つの主要な心の言葉の核を徐々に目覚めさせましょう。`
        },
        section8: {
          title: '8.失われた心の言葉の光',
          content: `星の言葉の庭の奥深くで、フィラは既に黄ばみ、損傷した「星の言葉の手帳」を発見しました。
これはすべての祝福の言葉を記録した古代の書物でしたが、言葉の沈黙によって砕けていました。
フィラは言いました：「かつてはこの中に星の国全体で最も強力な祝福の言葉が記録されていたのに、今は断片しか残っていない...」
それを修復するために、あなたとモナは「夢の言葉の海」に足を踏み入れました。それは願いの星の国の記憶と感情の最も深い領域でした。
あなたたちは時間と心の迷宮を通り抜け、数え切れないほどの忘れられた声に耳を傾けました—幼い頃の祝福、沈黙の中の愛、そして人々が決して口に出さなかった優しさ。
あなたは「最も癒しと目覚めの力を持つ」三つの祝福の言葉を識別し、それらを手帳に書き直して、星の言葉の力が再び宇宙に流れるようにしなければなりませんでした。
🌌 祝福の言葉を一つ見つけるごとに、星の木の心の裂け目は少しずつ癒え、微かな光を放ちました。`
        },
        section9: {
          title: '9.光のこだまと星の願いのアンサンブル',
          content: `三つの祝福の言葉が修復されると、願いの星の国は「共鳴の儀式」の準備段階に入りました。
三人の守護精霊は星の言葉の儀式の円陣の三つの角に立ち、それぞれが自分の心の言葉の力を活性化させました：
✨ ルビー：宇宙への「星の光の門」を開き、これまでに話されたすべての良い言葉をここに集めました。
🌸 フィラ：庭に言葉の花の種をまき、願いの星の国に万の言葉と万の願いを植えました。
🌙 モナ：「思い出の星の瓶」から、これまでに話されたすべての愛の言葉を解放し、過去の幸せの光を呼び覚ましました。
あなたは儀式の円の中心に立ち、星の木の心はゆっくりと最後の裂け目を現しました。それを完全に癒すことができるのは、あなただけでした。
あなたは目を閉じ、自分の心からの声に耳を傾け、そして静かに言いました：
💬 「私は自分と周りの人々が光の形で生きることを願います。」
あなたがそれを口にした瞬間、星の国全体が銀河のような祝福の光で爆発し、願いの庭は満開となり、星の木は再び言葉の霊的な光を放ちました。
✨ それは終わりではなく、新しい始まりでした。
あなたはもはや単なる人間ではなく、「心の言葉の守護者」であり、星の言葉の伝説の主人公でした。
💖 これは、あなたの星の言葉の物語であり、言葉で希望を蒔くことを望むすべての人の光の継承でもあります。`
        }
      }
    },
    ko: {
      title: '위쇼니아 Wishonia',
      intro: '「소원별빛 수호 정령」들은 각자 하나의 퍼즐 테마를 수호하며, 마법과 꽃말, 별빛으로 가득 찬 소원별의 나라 위쇼니아에 함께 살고 있습니다. 모든 정령은 독특한 성격, 마법, 사명을 가지고 있으며, 사용자들을 치유적이면서도 사랑스러운 긍정 언어의 세계로 이끌어줍니다 🌟',
      description: '이곳은 잠재의식 속 별하늘에 숨겨진 마법의 소우주입니다. 오직 "긍정적인 언어"로 행운을 밝히는 사람만이 이곳의 별빛을 볼 수 있습니다. 좋은 말을 한마디 할 때마다 작은 별이 조용히 이곳으로 날아오고, 세 수호 정령이 이 별들의 소원이 꽃피고, 빛나고, 행복으로 변하도록 돕습니다.',
      wishStarBox: 'Wish Star Box',
      chapter1: {
        title: '제1장 | 위쇼니아: 소원별빛 수호 정령',
        content: `우주의 가장자리에, 별빛으로 둘러싸인 신비로운 왕국이 있습니다—위쇼니아. 이곳의 모든 것은 언어의 힘으로 창조되었습니다: 각각의 별은 한때 말해진 친절한 말, 각각의 꽃은 아름다운 축복, 그리고 모든 부드러운 바람은 따뜻한 격려를 담고 있습니다.

이 왕국의 중심에는 거대한 "별나무"가 서 있으며, 그 줄기는 수많은 반짝이는 언어의 빛으로 짜여 있고, 그 왕관은 전체 하늘을 덮고 있습니다. 나무의 핵심—"별나무 심장"—은 모든 소원 에너지의 원천이자 세 소원별빛 수호 정령의 집입니다.

루비, 필라, 모나, 이 세 수호 정령은 각각 독특한 능력을 가지고 있습니다: 마음의 소원을 수집하고, 언어 꽃을 키우며, 행복 에너지를 저장합니다. 그들은 날마다 인간 세계와 위쇼니아 사이의 연결을 지키며, 모든 긍정적인 말이 소원을 이루는 힘으로 변환될 수 있도록 합니다.

그러나 인간 세계의 부정적인 언어가 증가함에 따라 위쇼니아의 빛은 점차 약해졌습니다. 별나무의 가지와 잎이 시들기 시작하고, 별들의 빛이 흐려지며, 꽃들의 색이 서서히 바랬습니다. 수호 정령들은 별나라를 다시 밝힐 "언어의 빛"을 찾을 때가 왔음을 깨달았습니다.

별빛이 모이는 어느 밤, 세 정령은 고대의 "별 소원 소환" 마법을 시전하여 인간 세계로 부름을 보냈습니다—언어의 힘을 여전히 믿는 마음을 찾아서. 그리고 당신이 선택된 사람입니다.`
      },
      guardians: '세 소원별빛 수호 정령 설정 :',
      guardian1: {
        name: '1. 루비 (Ruby) | 마음별 병의 수집가',
        puzzle: '수호 퍼즐: "소원 시간의 마음별 병"',
        appearance: '외형: 보라색 은발 + 별 모양 병 귀걸이 + 손에 별 먼지 노트 소지',
        personality: '성격: 조용히 관찰하고, 부드럽게 경청하며, 타인의 소원을 수호함',
        magic: '마법력: "마음 소원별"을 하나 수집할 때마다 따뜻한 별빛으로 변환하여 어두운 곳을 비출 수 있음',
        story: '그녀는 밤에 사람들이 좋은 말을 할 때 나오는 미세한 빛을 자주 기록하고, 하나하나 그녀의 "마음별 병"에 소중히 간직합니다. 그녀는 믿습니다: 소원은 부드럽게 보존되면 싹을 틔울 것입니다.'
      },
      guardian2: {
        name: '2. 필라 (Fila) | 별빛 정원의 꽃말사',
        puzzle: '수호 퍼즐: "반짝반짝 별빛 정원"',
        appearance: '외형: 분홍색 단발 + 꽃잎 날개 + 작은 별꽃 화관 착용',
        personality: '성격: 활기차고 치유적이며, 자연을 사랑하고 언어로 타인을 격려하는 데 능숙함',
        magic: '마법력: 모든 좋은 말 뒤에 숨겨진 축복을 이해하고, 그것들이 정원에서 별꽃으로 피어나게 할 수 있음',
        story: '당신이 좋은 말을 하는 순간, 그녀는 마법 이슬을 뿌려 정원에 당신의 마음을 나타내는 "별꽃"을 피워냅니다. 그녀는 말합니다: 당신이 심은 언어는 당신이 미래에 지나갈 풍경입니다.'
      },
      guardian3: {
        name: '3. 모나 (Mona) | 행복 수집의 꿈빛 여행자',
        puzzle: '수호 퍼즐: "행복을 모으는 작은 별 병"',
        appearance: '외형: 청록색 긴 머리 + 투명한 별 항아리를 안고 있음 + 꿈 망토 착용',
        personality: '성격: 느리게 친해지지만 치유 계열이며, 마음을 치유하는 에너지를 가짐',
        magic: '마법력: 당신의 긍정적인 행동을 행복의 미세한 빛으로 변환하여, 그녀의 "별 항아리"에 천천히 축적할 수 있음',
        story: '그녀는 매일 당신이 쌓은 "+1 좋은 말"을 반짝이는 별 먼지로 변환합니다. 그녀는 말합니다: 행복은 갑자기 찾아오는 것이 아니라, 당신이 스스로의 빛을 조금씩 믿으려는 것입니다.'
      },
      chapter2: {
        title: '제2장 | 소원의 각성: 언어의 빛을 찾아서',
        section4: {
          title: '4. 별말의 부름',
          content: `어느 고요한 밤, 당신은 반짝이는 편지를 꿈에서 보았습니다. 그 글씨는 별빛 속에서 부드럽게 떠올랐습니다—
"당신의 언어에는 우주를 밝히는 마법이 숨겨져 있습니다. 소원별의 나라로 와서, 잊혀진 당신의 소원의 빛을 찾으세요."
아침에 깨어나니, 휴대폰에 신비로운 앱이 나타났습니다. 화면 중앙에는 빛나는 "마음별 병"이 당신의 터치를 기다리고 있었습니다.
그것을 탭하자, 부드러운 빛 속에서 루비가 나타났습니다. 그녀는 미소 지으며 말했습니다:
"모든 좋은 말은 작은 별입니다. 당신이 축복의 말을 기꺼이 할 때, 우리는 그것들을 소원의 빛으로 변화시킬 수 있어요."
당신은 물었습니다: "소원을 빌어도 될까요?"
루비는 부드럽게 고개를 끄덕였습니다: "소원을 빌기 전에, 먼저 좋은 말을 하는 법을 배워야 해요~"
🌟 이것이 당신과 소원별의 나라와의 첫 만남이었습니다. 이제부터 당신의 언어는 우주를 변화시키는 힘을 갖게 되었습니다.`
        },
        section5: {
          title: '5. 별빛 정원의 시련',
          content: `당신이 더 많은 긍정적인 언어를 말할수록, 앱 속 풍경도 그에 따라 변화했습니다. 어느 날, 꽃향기가 피어나는 별의 문이 열리고, 필라가 당신 앞에 나타났습니다.
"반짝반짝 별빛 정원에 오신 것을 환영합니다!" 그녀는 미소 지으며 손을 흔들었습니다.
여기서는 모든 좋은 말이 작은 별꽃으로 피어나, 당신의 축복과 감정을 나타냅니다.
그러나 정원의 한 구석은 회색 안개로 덮여 있었습니다. 시든 별꽃, 떨어진 언어의 씨앗... 필라는 눈썹을 찌푸리며 말했습니다:
"최근에, 잡초처럼 부정적인 언어가 늘어나서 정원이 꽃피지 못하고 있어요..."
"우리는 당신의 도움이 필요해요, 그 언어들에 다시 빛을 찾아주세요."
당신은 물었습니다: "왜 부정적인 언어가 이렇게 많은가요?"
필라는 고개를 숙이고 처진 별꽃을 쓰다듬었습니다: "사람들이 자신도 사랑을 심을 수 있다는 것을 잊었기 때문이에요."
🌼 이것은 당신이 처음으로 "언어 변환"을 시도한 때였습니다—단지 좋은 말을 하는 것이 아니라, 언어 뒤에 숨겨진 감정과 축복을 보는 법을 배우고, 희망을 다시 심는 것이었습니다.`
        },
        section6: {
          title: '6. 기억 속의 행복한 빛',
          content: `임무를 완수한 후, 밤이 찾아왔습니다. 당신은 희미한 빛에 이끌려 별나라의 가장 깊은 곳인 "별빛 꿈 도서관"으로 들어갔습니다.
그곳에는 당신이 지금까지 말한 모든 좋은 말, 모든 긍정적인 행동이 모나의 "행복 별 병"에 수집되어 있었습니다.
모나는 부드럽게 말했습니다: "이것들은 당신 영혼의 빛입니다. 하지만 당신이 그것들을 기억하지 못하면, 그것들은 조금씩 사라질 거예요."
당신은 "기억 별 찾기" 여행을 떠나야 했습니다. 한때 말했지만 잊어버린 빛나는 문장들을 되찾아, 행복이 다시 빛나도록 하기 위해서.
당신은 작은 목소리로 말했습니다: "나는 아직 충분히 하지 못했어..."
모나는 부드럽게 위로했습니다: "빛은 쌓이는 거예요. 서두를 필요 없어요. 당신이 원하기만 한다면, 그것은 계속 자랄 거예요."
🌙 이 장면에서, 당신은 이해하기 시작했습니다: 치유는 순간적인 번쩍임이 아니라, 매일 자신에게 말하는 부드러움과 축복이라는 것을.`
        }
      },
      chapter3: {
        title: '제3장 | 빛의 메아리: 소원의 별말 복구',
        intro: `💫 줄거리 전개
당신이 언어를 변환하고 마음의 빛을 되찾기 위해 노력한 후, 소원별의 나라는 평화를 되찾았어야 했습니다—그러나 어느 아침, 전례 없는 고요함에 빠졌습니다.
한때 빛나던 별하늘은 무겁고 낮게 내려앉았으며, 소원별의 나라의 중심인 "별나무 심장"은 빛을 잃었습니다. 언어의 힘은 정체되고, 소원은 싹을 틔울 수 없었으며, 꿈조차 목소리를 잃었습니다.
루비, 필라, 모나는 긴급히 모였고, 그들의 눈에는 불안과 걱정이 어려 있었습니다.
"이것은 단순한 언어의 불균형이 아니야," 모나가 속삭였습니다. "마음-언어 공명 시스템 전체의 붕괴야."
그리하여, 전례 없는 계획이 시작되었습니다—
☄️ "마음 언어 복구 프로젝트"
당신은 "언어 축복력"을 가진 유일한 인간으로서, 별말을 재활성화하는 중요한 임무를 맡게 되었습니다.`,
        section7: {
          title: '7. 별빛이 멈춘 날',
          content: `당신은 루비를 따라 "별하늘 플랫폼"에 올랐습니다. 그곳은 소원별의 나라와 우주를 연결하는 가장 높은 지점이었습니다.
발 아래의 은하는 고요한 빛줄기로 갈라졌고, 별들은 마치 숨을 잃은 듯 텅 빈 공간에서 잠들어 있었습니다.
"별나무 심장"의 중앙에는 바닥이 보이지 않을 정도로 깊은 "침묵의 균열"이 나타났고, 한때 흐르던 마음 언어의 빛은 정체되어 있었습니다.
루비는 조용히 당신의 손을 잡았습니다: "우리 스스로는 이 균열을 복구할 수 없어요. 이번에는 오직 인간의 언어만이 희망을 불러올 수 있어요."
그녀는 당신을 바라보며, 그 눈빛은 단호하면서도 부드러웠습니다: "정령 중 한 명을 선택해서 시작해요. 모든 사람의 언어 빛이 별나무를 밝히는 힘의 원천이 될 거예요."
🌠 [인터랙티브 미션 오픈]: 루비, 필라, 또는 모나와 함께 "초급 복구 미션"을 시작하여 세 가지 주요 마음 언어 핵을 점차적으로 깨우세요.`
        },
        section8: {
          title: '8. 잃어버린 마음 언어의 빛',
          content: `별말 정원의 깊은 곳에서, 필라는 오래되고 누렇게 변색되고 손상된 "별말 일지"를 발견했습니다.
이것은 모든 축복의 말을 기록한 고대 문서였지만, 언어의 침묵으로 인해 산산조각이 났습니다.
필라는 말했습니다: "한때 이 안에는 별나라 전체에서 가장 강력한 축복의 말들이 기록되어 있었는데, 지금은 부서진 조각만 남아있어요..."
이것을 복구하기 위해, 당신과 모나는 "꿈 언어의 바다"에 들어갔습니다. 그곳은 소원별의 나라의 기억과 감정의 가장 깊은 영역이었습니다.
당신들은 시간과 마음의 미로를 통과하며, 수많은 잊혀진 목소리들을 들었습니다—어린 시절의 축복, 침묵 속의 사랑, 그리고 사람들이 결코 말하지 않았던 부드러움.
당신은 "가장 치유력과 각성력이 있는" 세 가지 축복의 말을 식별하여, 그것들을 일지에 다시 써넣어, 별말의 힘이 다시 우주를 흐르게 해야 했습니다.
🌌 축복의 말을 하나 찾을 때마다, 별나무 심장의 균열은 조금씩 치유되어 미세한 빛을 드러냈습니다.`
        },
        section9: {
          title: '9. 빛의 메아리와 별 소원의 앙상블',
          content: `세 가지 축복의 말이 복구되었을 때, 소원별의 나라는 "공명 의식"의 준비 단계에 들어갔습니다.
세 수호 정령은 별말 의식 원의 세 모서리에 서서, 각자 자신의 마음 언어 힘을 활성화했습니다:
✨ 루비: 우주로 향하는 "별빛 문"을 열어, 지금까지 말해진 모든 좋은 말들을 모았습니다.
🌸 필라: 정원에 언어 꽃씨를 뿌려, 소원별의 나라에 만 개의 언어와 만 개의 소원을 심었습니다.
🌙 모나: "기억 별 병"에서 지금까지 말해진 모든 사랑의 말을 풀어놓아, 과거의 행복한 빛을 깨웠습니다.
당신은 의식 원의 중심에 서 있었습니다. 별나무 심장은 천천히 마지막 균열을 드러냈고, 오직 당신만이 그것을 완전히 치유할 수 있었습니다.
당신은 눈을 감고, 자신의 마음에서 오는 목소리를 듣고, 그리고 부드럽게 말했습니다:
💬 "나와 내 주변 사람들이 빛의 형태로 살아가기를 바랍니다."
당신이 말한 순간, 별나라 전체가 은하수처럼 축복의 빛으로 폭발했고, 소원 정원은 만개했으며, 별나무는 다시 한번 언어의 영적인 빛을 발산했습니다.
✨ 그것은 끝이 아니라, 새로운 시작이었습니다.
당신은 더 이상 단순한 인간이 아니라, "마음 언어의 수호자"이자, 별말 전설의 주인공이 되었습니다.
💖 이것은 당신의 별말 이야기이며, 또한 언어로 희망을 심고자 하는 모든 이들의 빛의 유산입니다.`
        }
      }
    }
  };
  
  const currentContent = content[language];
  
  const toggleChapter = (chapterNum: number) => {
    if (expandedChapter === chapterNum) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(chapterNum);
    }
  };

  const navigateToWishStarBox = () => {
    router.push('/wish-star-box');
  };

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };
  
  // Helper function to check if a puzzle is unlocked
  const isPuzzleUnlocked = (puzzleId: number): boolean => {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return false;
    
    // A puzzle is considered unlocked if at least one piece is unlocked
    return puzzle.pieces.some(piece => piece.unlocked);
  };
  
  // Helper function to check if a puzzle is completely unlocked (all 10 pieces)
  const isPuzzleComplete = (puzzleId: number): boolean => {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return false;
    return puzzle.pieces.every(piece => piece.unlocked);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: currentContent.title,
          headerRight: () => <LanguageSwitcher />
        }} 
      />
      <ScrollView style={styles.container}>
        <Image 
          source={{ uri: 'https://github.com/user-attachments/assets/0d67f265-23db-44b1-aa1e-b779f244444e' }}
          style={styles.headerImage}
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{currentContent.title}</Text>
          <Text style={styles.intro}>{currentContent.intro}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.description}>{currentContent.description}</Text>

          {/* 3D Wish Star Box Button */}
          <Pressable 
            style={[
              styles.wishStarBoxButton,
              isPressed ? styles.wishStarBoxButtonPressed : styles.wishStarBoxButtonNormal
            ]}
            onPress={navigateToWishStarBox}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Image 
              source={{ uri: 'https://github.com/user-attachments/assets/61d9e343-e412-4efe-8c0e-a811c77b8797' }}
              style={styles.wishStarBoxImage}
              resizeMode="contain"
            />
          </Pressable>
          
          <View style={styles.divider} />
          
          {/* Chapter 1 */}
          <View style={styles.chapterContainer}>
            <Pressable 
              style={styles.chapterHeader} 
              onPress={() => toggleChapter(1)}
            >
              <Text style={styles.chapterTitle}>{currentContent.chapter1.title}</Text>
              <Text style={styles.expandIcon}>{expandedChapter === 1 ? '▼' : '▶'}</Text>
            </Pressable>
            
            {expandedChapter === 1 && (
              <View style={styles.chapterContent}>
                <Text style={styles.chapterText}>{currentContent.chapter1.content}</Text>
                
                {/* Guardian profiles moved here, after Chapter 1 content */}
                <Text style={styles.guardiansTitle}>{currentContent.guardians}</Text>
                
                <View style={styles.guardianCard}>
                  <Text style={styles.guardianName}>{currentContent.guardian1.name}</Text>
                  {isPuzzleUnlocked(1) ? (
                    <Image 
                      source={{ uri: 'https://github.com/user-attachments/assets/511c952d-32f2-4bbb-879b-472e1e8d02d2' }}
                      style={styles.guardianImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.lockedImageContainer}>
                      <Text style={styles.lockedImageText}>
                        {language === 'zh' ? '解鎖拼圖以查看' : 
                         language === 'en' ? 'Unlock puzzle to view' :
                         language === 'ja' ? 'パズルを解除して表示' :
                         '퍼즐을 해제하여 보기'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.guardianDetail}>{currentContent.guardian1.puzzle}</Text>
                  <Text style={styles.guardianDetail}>{currentContent.guardian1.appearance}</Text>
                  <Text style={styles.guardianDetail}>{currentContent.guardian1.personality}</Text>
                  <Text style={styles.guardianDetail}>{currentContent.guardian1.magic}</Text>
                  <Text style={styles.guardianStory}>{currentContent.guardian1.story}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.guardianCard}>
                  <Text style={styles.guardianName}>{currentContent.guardian2.name}</Text>
                  {isPuzzleUnlocked(2) ? (
                    <Image 
                      source={{ uri: 'https://github.com/user-attachments/assets/299eee8a-ab98-4a27-8326-440c8e76ea11' }}
                      style={styles.guardianImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.lockedImageContainer}>
                      <Text style={styles.lockedImageText}>
                        {language === 'zh' ? '解鎖拼圖以查看' : 
                         language === 'en' ? 'Unlock puzzle to view' :
                         language === 'ja' ? 'パズルを解除して表示' :
                         '퍼즐을 해제하여 보기'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.guardianDetail}>{currentContent.guardian2.puzzle}</Text>
                  <Text style={styles.guardianDetail}>{currentContent.guardian2.appearance}</Text>
                  <Text style={styles.guardianDetail}>{currentContent.guardian2.personality}</Text>
                  <Text style={styles.guardianDetail}>{currentContent.guardian2.magic}</Text>
                  <Text style={styles.guardianStory}>{currentContent.guardian2.story}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.guardianCard}>
                  <Text style={styles.guardianName}>{currentContent.guardian3.name}</Text>
                  {isPuzzleUnlocked(3) ? (
                    <Image 
                      source={{ uri: 'https://github.com/user-attachments/assets/f44fcd6b-d436-4e30-a2b3-06ef625385f2' }}
                      style={styles.guardianImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.lockedImageContainer}>
                      <Text style={styles.lockedImageText}>
                        {language === 'zh' ? '解鎖拼圖以查看' : 
                         language === 'en' ? 'Unlock puzzle to view' :
                         language === 'ja' ? 'パズルを解除して表示' :
                         '퍼즐을 해제하여 보기'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.guardianDetail}>{currentContent.guardian3.puzzle}</Text>
                  <Text style={styles.guardianDetail}>{currentContent.guardian3.appearance}</Text>
                  <Text style={styles.guardianDetail}>{currentContent.guardian3.personality}</Text>
                  <Text style={styles.guardianDetail}>{currentContent.guardian3.magic}</Text>
                  <Text style={styles.guardianStory}>{currentContent.guardian3.story}</Text>
                </View>
              </View>
            )}
          </View>
          
          {/* Chapter 2 */}
          <View style={styles.chapterContainer}>
            <Pressable 
              style={styles.chapterHeader} 
              onPress={() => toggleChapter(2)}
            >
              <Text style={styles.chapterTitle}>{currentContent.chapter2.title}</Text>
              <Text style={styles.expandIcon}>{expandedChapter === 2 ? '▼' : '▶'}</Text>
            </Pressable>
            
            {expandedChapter === 2 && (
              <View style={styles.chapterContent}>
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>{currentContent.chapter2.section4.title}</Text>
                  {isPuzzleUnlocked(4) ? (
                    <Image 
                      source={{ uri: 'https://github.com/user-attachments/assets/2cbbac6b-f8fd-4385-a856-74bb9a2dc437' }}
                      style={styles.sectionImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.lockedImageContainer}>
                      <Text style={styles.lockedImageText}>
                        {language === 'zh' ? '解鎖拼圖以查看' : 
                         language === 'en' ? 'Unlock puzzle to view' :
                         language === 'ja' ? 'パズルを解除して表示' :
                         '퍼즐을 해제하여 보기'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.sectionContent}>{currentContent.chapter2.section4.content}</Text>
                </View>
                
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>{currentContent.chapter2.section5.title}</Text>
                  {isPuzzleUnlocked(5) ? (
                    <Image 
                      source={{ uri: 'https://github.com/user-attachments/assets/bb21c3ca-4920-4537-b47e-bd83aefdaa4b' }}
                      style={styles.sectionImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.lockedImageContainer}>
                      <Text style={styles.lockedImageText}>
                        {language === 'zh' ? '解鎖拼圖以查看' : 
                         language === 'en' ? 'Unlock puzzle to view' :
                         language === 'ja' ? 'パズルを解除して表示' :
                         '퍼즐을 해제하여 보기'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.sectionContent}>{currentContent.chapter2.section5.content}</Text>
                </View>
                
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>{currentContent.chapter2.section6.title}</Text>
                  {isPuzzleUnlocked(6) ? (
                    <Image 
                      source={{ uri: 'https://github.com/user-attachments/assets/af2e654d-fc82-4cb9-b470-c2106f9c1e2e' }}
                      style={styles.sectionImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.lockedImageContainer}>
                      <Text style={styles.lockedImageText}>
                        {language === 'zh' ? '解鎖拼圖以查看' : 
                         language === 'en' ? 'Unlock puzzle to view' :
                         language === 'ja' ? 'パズルを解除して表示' :
                         '퍼즐을 해제하여 보기'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.sectionContent}>{currentContent.chapter2.section6.content}</Text>
                </View>
              </View>
            )}
          </View>
          
          {/* Chapter 3 */}
          <View style={styles.chapterContainer}>
            <Pressable 
              style={styles.chapterHeader} 
              onPress={() => toggleChapter(3)}
            >
              <Text style={styles.chapterTitle}>{currentContent.chapter3.title}</Text>
              <Text style={styles.expandIcon}>{expandedChapter === 3 ? '▼' : '▶'}</Text>
            </Pressable>
            
            {expandedChapter === 3 && (
              <View style={styles.chapterContent}>
                <Text style={styles.chapterIntro}>{currentContent.chapter3.intro}</Text>
                
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>{currentContent.chapter3.section7.title}</Text>
                  {isPuzzleUnlocked(7) ? (
                    <Image 
                      source={{ uri: 'https://github.com/user-attachments/assets/083dbff3-8127-480f-af35-622d10afd673' }}
                      style={styles.sectionImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.lockedImageContainer}>
                      <Text style={styles.lockedImageText}>
                        {language === 'zh' ? '解鎖拼圖以查看' : 
                         language === 'en' ? 'Unlock puzzle to view' :
                         language === 'ja' ? 'パズルを解除して表示' :
                         '퍼즐을 해제하여 보기'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.sectionContent}>{currentContent.chapter3.section7.content}</Text>
                </View>
                
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>{currentContent.chapter3.section8.title}</Text>
                  {isPuzzleUnlocked(8) ? (
                    <Image 
                      source={{ uri: 'https://github.com/user-attachments/assets/1a07352e-3898-4563-915d-b4bcbbac3c02' }}
                      style={styles.sectionImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.lockedImageContainer}>
                      <Text style={styles.lockedImageText}>
                        {language === 'zh' ? '解鎖拼圖以查看' : 
                         language === 'en' ? 'Unlock puzzle to view' :
                         language === 'ja' ? 'パズルを解除して表示' :
                         '퍼즐을 해제하여 보기'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.sectionContent}>{currentContent.chapter3.section8.content}</Text>
                </View>
                
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>{currentContent.chapter3.section9.title}</Text>
                  {isPuzzleUnlocked(9) ? (
                    <Image 
                      source={{ uri: 'https://github.com/user-attachments/assets/47d96e38-c703-4748-818f-976cf4a28eae' }}
                      style={styles.sectionImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.lockedImageContainer}>
                      <Text style={styles.lockedImageText}>
                        {language === 'zh' ? '解鎖拼圖以查看' : 
                         language === 'en' ? 'Unlock puzzle to view' :
                         language === 'ja' ? 'パズルを解除して表示' :
                         '퍼즐을 해제하여 보기'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.sectionContent}>{currentContent.chapter3.section9.content}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  intro: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: `${colors.primary}30`,
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  // Enhanced 3D button styles
  wishStarBoxButton: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8, // Android shadow
  },
  wishStarBoxButtonNormal: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    transform: [{ scale: 1 }, { translateY: 0 }],
  },
  wishStarBoxButtonPressed: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    transform: [{ scale: 0.96 }, { translateY: 2 }],
  },
  wishStarBoxImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.8, // Adjusted to match the new image dimensions
    borderRadius: 20,
  },
  guardiansTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    marginTop: 24,
  },
  guardianCard: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  guardianName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },
  guardianImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: `${colors.primary}20`,
  },
  lockedImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: `${colors.textLight}30`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedImageText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  guardianDetail: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  guardianStory: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  chapterContainer: {
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: `${colors.primary}20`,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  expandIcon: {
    fontSize: 18,
    color: colors.primary,
    marginLeft: 8,
  },
  chapterContent: {
    padding: 16,
    backgroundColor: `${colors.primary}05`,
  },
  chapterText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  chapterIntro: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  sectionCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginTop: 12,
  },
  sectionImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: `${colors.primary}10`,
  },
});