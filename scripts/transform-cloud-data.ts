/**
 * One-time script to transform cloud architecture quiz data
 * from source format to app's Question format.
 *
 * Usage: npx tsx scripts/transform-cloud-data.ts
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.resolve(
  __dirname,
  "../../year1 semester 2/Cloud Architecture/extract-module-answers-yt/aws_quiz_extractor/data"
);
const OUTPUT_DIR = path.resolve(__dirname, "../src/data/cloud-architecture");

const INCLUDED_MODULES = [2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14];

interface SourceQuestion {
  module: number;
  module_title: string;
  question_number: number;
  question_text: string;
  choices: string[];
  correct_indices: number[];
}

interface Choice {
  key: string;
  text: string;
}

interface TransformedQuestion {
  id: number;
  type: "choice" | "multiple-choice";
  lecture: string;
  question: string;
  choices: Choice[];
  correctAnswer: string;
  correctAnswers?: string[];
  explanation: string;
}

function indexToKey(i: number): string {
  return String.fromCharCode(65 + i); // 0->A, 1->B, etc.
}

function makeLectureKey(moduleNum: number, title: string): string {
  const slug = title
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
  return `Module${moduleNum}-${slug}`;
}

function generateExplanation(q: SourceQuestion): string {
  const correctKeys = q.correct_indices.map((i) => indexToKey(i));
  const correctTexts = q.correct_indices.map((i) => q.choices[i]);

  if (correctKeys.length === 1) {
    return `คำตอบที่ถูกต้องคือ ${correctKeys[0]}: ${correctTexts[0]}`;
  }
  const pairs = correctKeys.map((k, i) => `${k}: ${correctTexts[i]}`);
  return `คำตอบที่ถูกต้องคือ ${pairs.join(", ")}`;
}

function transformModule(moduleNum: number): TransformedQuestion[] {
  const sourceFile = path.join(SOURCE_DIR, `module_${moduleNum}.json`);
  const raw: SourceQuestion[] = JSON.parse(fs.readFileSync(sourceFile, "utf-8"));

  return raw.map((q) => {
    const choices: Choice[] = q.choices.map((text, i) => ({
      key: indexToKey(i),
      text,
    }));

    const correctKeys = q.correct_indices.map((i) => indexToKey(i));
    const isMultiple = correctKeys.length > 1;

    const result: TransformedQuestion = {
      id: q.question_number,
      type: isMultiple ? "multiple-choice" : "choice",
      lecture: makeLectureKey(q.module, q.module_title),
      question: q.question_text,
      choices,
      correctAnswer: correctKeys.sort().join(","),
      explanation: generateExplanation(q),
    };

    if (isMultiple) {
      result.correctAnswers = correctKeys.sort();
    }

    return result;
  });
}

// Main
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

for (const moduleNum of INCLUDED_MODULES) {
  const questions = transformModule(moduleNum);
  const outFile = path.join(OUTPUT_DIR, `module-${moduleNum}.json`);
  fs.writeFileSync(outFile, JSON.stringify(questions, null, 2) + "\n", "utf-8");
  console.log(`Written ${outFile} (${questions.length} questions)`);
}

console.log(`\nDone! Transformed ${INCLUDED_MODULES.length} modules.`);
