/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EducationalLevel = 'Primaria' | 'Secundaria' | 'Preparatoria';

export interface Teacher {
  id: string;
  name: string;
  level: EducationalLevel;
  grade: string; // e.g. "1º", "2º", "5º", "10º (1º Preparatoria)"
  subject: string; // e.g. "Matemáticas", "Español", "Física"
  avatar: string; // Color preset or character emoji/avatar
  email?: string;
}

export type RubricCategory = 'planeacion' | 'pedagogia' | 'controlGrupo' | 'evaluacion' | 'profesionalismo';

export interface RubricDetail {
  category: RubricCategory;
  title: string;
  description: string;
  levels: {
    1: { label: string; desc: string };
    2: { label: string; desc: string };
    3: { label: string; desc: string };
    4: { label: string; desc: string };
    5: { label: string; desc: string };
  };
}

export interface Evaluation {
  id: string;
  teacherId: string;
  date: string;
  evaluatorName: string;
  role: 'Coordinador' | 'Director' | 'Autoevaluación' | 'Colega';
  scores: Record<RubricCategory, number>;
  comments: string;
  level: EducationalLevel;
  grade: string;
  subject: string;
  academicYear: string; // e.g. "2024", "2025", "2026"
}

export interface StudentComment {
  id: string;
  teacherId: string;
  date: string;
  comment: string;
  rating: number; // 1 to 5
  level: EducationalLevel;
  grade: string;
  subject: string;
  sentiment?: 'positivo' | 'neutro' | 'critico';
}

export interface SheetsConfig {
  webAppUrl: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}
