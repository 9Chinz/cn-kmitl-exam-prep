import type { Question, Level } from "@/types/quiz";
import type { SubjectConfig } from "@/types/subject";
import { shuffleArray } from "@/lib/shuffle";

import rawEasy from "@/data/cn/easy.json";
import rawNormal from "@/data/cn/normal.json";
import rawHard from "@/data/cn/hard.json";
import rawGuidelineEasy from "@/data/cn/guideline-easy.json";
import rawGuidelineNormal from "@/data/cn/guideline-normal.json";
import rawGuidelineHard from "@/data/cn/guideline-hard.json";

const easyQuestions = (rawEasy as Question[]).map((q) => ({ ...q, id: q.id }));
const normalQuestions = (rawNormal as Question[]).map((q) => ({ ...q, id: q.id + 100 }));
const hardQuestions = (rawHard as Question[]).map((q) => ({ ...q, id: q.id + 200 }));
const guidelineEasyQuestions = (rawGuidelineEasy as Question[]).map((q) => ({ ...q, id: q.id + 300 }));
const guidelineNormalQuestions = (rawGuidelineNormal as Question[]).map((q) => ({ ...q, id: q.id + 400 }));
const guidelineHardQuestions = (rawGuidelineHard as Question[]).map((q) => ({ ...q, id: q.id + 500 }));

const allQuestions = [
  ...easyQuestions, ...normalQuestions, ...hardQuestions,
  ...guidelineEasyQuestions, ...guidelineNormalQuestions, ...guidelineHardQuestions,
];

const questions: Record<string, Question[]> = {
  easy: easyQuestions,
  normal: normalQuestions,
  hard: hardQuestions,
  "guideline-easy": guidelineEasyQuestions,
  "guideline-normal": guidelineNormalQuestions,
  "guideline-hard": guidelineHardQuestions,
};

function buildQuestions(level: Level): Question[] {
  if (level === "random") {
    const pick20 = (qs: Question[]) => shuffleArray(qs).slice(0, 20);
    return shuffleArray([
      ...pick20(easyQuestions),
      ...pick20(normalQuestions),
      ...pick20(hardQuestions),
    ]);
  }
  if (level === "guideline-random") {
    const pick20 = (qs: Question[]) => shuffleArray(qs).slice(0, 20);
    return shuffleArray([
      ...pick20(guidelineEasyQuestions),
      ...pick20(guidelineNormalQuestions),
      ...pick20(guidelineHardQuestions),
    ]);
  }
  return shuffleArray([...questions[level]]);
}

export const cnSubject: SubjectConfig = {
  id: "cn",
  name: "Computer Networks",
  code: "01076116",
  description: "180 questions across 4 difficulty levels",
  icon: "🌐",
  color: "bg-blue-600",
  lectures: [
    { id: "Lec 8", key: "Lec8-Ethernet", title: "Data Link Layer & Ethernet", color: "bg-blue-500" },
    { id: "Lec 9A", key: "Lec9A-NetworkLayer", title: "Network Layer & IPv4", color: "bg-green-500" },
    { id: "Lec 9B", key: "Lec9B-Subnetting", title: "IPv4 Subnetting & VLSM", color: "bg-orange-500" },
    { id: "Lec 10", key: "Lec10-VLAN", title: "VLAN, DHCP & IPv6", color: "bg-purple-500" },
    { id: "Lec 11", key: "Lec11-Routing", title: "Introduction to Routing", color: "bg-red-500" },
    { id: "Lec 12", key: "Lec12-Transport", title: "Transport & Application Layer", color: "bg-teal-500" },
  ],
  lectureNames: {
    "Lec8-Ethernet": "Lec 8 · Ethernet & Data Link",
    "Lec9A-NetworkLayer": "Lec 9A · Network Layer & IPv4",
    "Lec9B-Subnetting": "Lec 9B · Subnetting & VLSM",
    "Lec10-VLAN": "Lec 10 · VLAN, DHCP & IPv6",
    "Lec11-Routing": "Lec 11 · Routing",
    "Lec12-Transport": "Lec 12 · Transport & App Layer",
    "Guideline-IOS": "Guideline · Cisco IOS",
    "Guideline-VLAN": "Guideline · VLAN Config",
    "Guideline-Routing": "Guideline · RIP & OSPF",
    "Guideline-Redistribution": "Guideline · Redistribution",
    "Guideline-ACL": "Guideline · ACL",
  },
  lectureOrder: [
    "Lec8-Ethernet",
    "Lec9A-NetworkLayer",
    "Lec9B-Subnetting",
    "Lec10-VLAN",
    "Lec11-Routing",
    "Lec12-Transport",
    "Guideline-IOS",
    "Guideline-VLAN",
    "Guideline-Routing",
    "Guideline-Redistribution",
    "Guideline-ACL",
  ],
  levelGroups: [
    {
      groupLabel: "Original (เนื้อหาบทเรียน)",
      levels: [
        { level: "easy", label: "Easy", desc: "คำถามพื้นฐาน จำข้อมูลและนิยาม", color: "bg-green-500 hover:bg-green-600" },
        { level: "normal", label: "Normal", desc: "ทดสอบความเข้าใจและเปรียบเทียบ", color: "bg-yellow-500 hover:bg-yellow-600" },
        { level: "hard", label: "Hard", desc: "สถานการณ์จำลอง คำนวณ และวิเคราะห์", color: "bg-red-500 hover:bg-red-600" },
        { level: "random", label: "Random", desc: "สุ่มคำถามจากทุกระดับ 20 ข้อต่อระดับ", color: "bg-purple-500 hover:bg-purple-600" },
      ],
    },
    {
      groupLabel: "Guideline (ตัวอย่างข้อสอบ)",
      levels: [
        { level: "guideline-easy", label: "Easy", desc: "คำถามจากตัวอย่างข้อสอบตรง ๆ", color: "bg-cyan-500 hover:bg-cyan-600" },
        { level: "guideline-normal", label: "Normal", desc: "เนื้อหาเดียวกัน แต่ถามลึกขึ้น", color: "bg-cyan-600 hover:bg-cyan-700" },
        { level: "guideline-hard", label: "Hard", desc: "สถานการณ์จำลอง วิเคราะห์เชิงลึก", color: "bg-cyan-700 hover:bg-cyan-800" },
        { level: "guideline-random", label: "Random", desc: "สุ่มจากทุกระดับ Guideline", color: "bg-cyan-400 hover:bg-cyan-500" },
      ],
    },
  ],
  questions,
  allQuestions,
  buildQuestions,
};
