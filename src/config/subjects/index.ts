import { cnSubject } from "./cn";
import { oopSubject } from "./oop";
import type { SubjectId, SubjectConfig } from "@/types/subject";

export const subjects: Record<SubjectId, SubjectConfig> = {
  cn: cnSubject,
  oop: oopSubject,
};

export const subjectList: SubjectConfig[] = Object.values(subjects);
