import { useSubjectStore } from "@/store/subjectStore";

export function getLectureName(key: string): string {
  const config = useSubjectStore.getState().getConfig();
  if (config) return config.lectureNames[key] || key;
  return key;
}

export function getLectureOrder(): string[] {
  const config = useSubjectStore.getState().getConfig();
  return config?.lectureOrder ?? [];
}

export function getLectureNames(): Record<string, string> {
  const config = useSubjectStore.getState().getConfig();
  return config?.lectureNames ?? {};
}
