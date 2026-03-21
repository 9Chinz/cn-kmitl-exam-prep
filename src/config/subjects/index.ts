import { cnSubject } from "./cn";
import { oopSubject } from "./oop";
import { cloudArchitectureSubject } from "./cloud-architecture";
import type { SubjectId, SubjectConfig } from "@/types/subject";

export const subjects: Record<SubjectId, SubjectConfig> = {
  cn: cnSubject,
  oop: oopSubject,
  "cloud-architecture": cloudArchitectureSubject,
};

export const subjectList: SubjectConfig[] = Object.values(subjects);
