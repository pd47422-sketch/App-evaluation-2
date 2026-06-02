/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Teacher, Evaluation, StudentComment, RubricDetail } from '../types';

export const RUBRICS: Record<string, RubricDetail> = {
  planeacion: {
    category: 'planeacion',
    title: 'Planeación Didáctica',
    description: 'Capacidad para diseñar planes de clase alineados con el currículum, con objetivos claros y actividades secuenciadas que fomentan el aprendizaje.',
    levels: {
      1: {
        label: 'Deficiente (1)',
        desc: 'No planea clases o usa planes obsoletos sin alineación al programa escolar; las actividades carecen de estructura y sentido educativo.'
      },
      2: {
        label: 'Aceptable (2)',
        desc: 'Improvisa con frecuencia o depende demasiado del libro de texto sin adaptaciones; sus objetivos de aprendizaje son vagos.'
      },
      3: {
        label: 'Bueno (3)',
        desc: 'Sigue un plan estructurado y alineado al plan de estudios, definiendo objetivos claros y proporcionando una secuencia con principio, desarrollo y cierre.'
      },
      4: {
        label: 'Muy Bueno (4)',
        desc: 'Diseña planeaciones ajustadas al ritmo del grupo, integrando de forma activa recursos creativos, tecnología y adaptaciones pedagógicas contextuales.'
      },
      5: {
        label: 'Excelente (5)',
        desc: 'Planeaciones sobresalientes que integran proyectos interdisciplinarios, metodologías activas (ABP) y adaptaciones específicas para la diversidad del aula.'
      }
    }
  },
  pedagogia: {
    category: 'pedagogia',
    title: 'Práctica y Didáctica',
    description: 'Uso de técnicas de enseñanza que facilitan la comprensión, promueven el pensamiento crítico y atienden los diversos ritmos y estilos de aprendizaje.',
    levels: {
      1: {
        label: 'Deficiente (1)',
        desc: 'La cátedra es puramente expositiva y repetitiva; ignora el desinterés de los alumnos y no responde a dudas.'
      },
      2: {
        label: 'Aceptable (2)',
        desc: 'Explica temas de manera básica pero interactúa poco; solo los alumnos más avanzados participan activamente.'
      },
      3: {
        label: 'Bueno (3)',
        desc: 'Usa explicaciones claras, fomenta la participación con preguntas y diversifica ocasionalmente los materiales de apoyo.'
      },
      4: {
        label: 'Muy Bueno (4)',
        desc: 'Promueve el debate, utiliza analogías efectivas, interactúa dinámicamente y se asegura de que la mayoría asimile los conceptos.'
      },
      5: {
        label: 'Excelente (5)',
        desc: 'Domina metodologías activas de aprendizaje; convierte la clase en un entorno de indagación y pensamiento crítico de alto nivel.'
      }
    }
  },
  controlGrupo: {
    category: 'controlGrupo',
    title: 'Liderazgo y Gestión del Aula',
    description: 'Gestión eficiente del tiempo y del orden en el salón de clases, creando un ambiente seguro, de respeto mutuo y enfocado en el aprendizaje continuo.',
    levels: {
      1: {
        label: 'Deficiente (1)',
        desc: 'El desorden impera; las interrupciones constantes impiden dar la clase y el docente responde con gritos o frustración.'
      },
      2: {
        label: 'Aceptable (2)',
        desc: 'Establece pocas normas claras; el control es inconsistente y pierde valiosos minutos de clase intentando capturar la atención.'
      },
      3: {
        label: 'Bueno (3)',
        desc: 'Mantiene un ambiente de respeto y dinámico; la mayor parte del grupo sigue las reglas y las transiciones entre actividades son fluidas.'
      },
      4: {
        label: 'Muy Bueno (4)',
        desc: 'Usa comunicación asertiva y refuerzo positivo con alta efectividad; los alumnos muestran asimilación conductual autónoma.'
      },
      5: {
        label: 'Excelente (5)',
        desc: 'Atmósfera ejemplar de colaboración y confianza. Resuelve conflictos de manera formativa e inductiva; el tiempo de aprendizaje es maximizado.'
      }
    }
  },
  evaluacion: {
    category: 'evaluacion',
    title: 'Evaluación y Retroalimentación',
    description: 'Uso consistente de procesos de evaluación formativa y sumativa, y provisión de comentarios útiles que ayudan a los alumnos a mejorar de manera continua.',
    levels: {
      1: {
        label: 'Deficiente (1)',
        desc: 'Evalúa de forma puramente punitiva con un solo examen a final de periodo; no da explicaciones de las calificaciones.'
      },
      2: {
        label: 'Aceptable (2)',
        desc: 'Entrega calificaciones finales pero apenas provee retroalimentación formativa constructiva; califica basándose en cumple/no cumple.'
      },
      3: {
        label: 'Bueno (3)',
        desc: 'Utiliza diversas herramientas (tareas, participación, exámenes) y devuelve observaciones escritas relevantes que aclaran áreas de mejora.'
      },
      4: {
        label: 'Muy Bueno (4)',
        desc: 'Integra autoevaluación y coevaluación regularmente, proporcionando rúbricas explícitas antes de iniciar los trabajos clave.'
      },
      5: {
        label: 'Excelente (5)',
        desc: 'La evaluación es un motor de aprendizaje continuo; retroalimenta de forma personalizada e inmediata y utiliza el análisis para reorientar su didáctica.'
      }
    }
  },
  profesionalismo: {
    category: 'profesionalismo',
    title: 'Profesionalismo y Ética, Colaboración',
    description: 'Cumplimiento administrativo (asistencias, entregas), participación activa en la comunidad colegiada, ética y empatía con la comunidad escolar.',
    levels: {
      1: {
        label: 'Deficiente (1)',
        desc: 'Es impuntual, falta con frecuencia y entrega reportes administrativos fuera de tiempo o incompletos. No colabora.'
      },
      2: {
        label: 'Aceptable (2)',
        desc: 'Cumple apenas con lo administrativo y asiste de manera pasiva a juntas escolares; muestra distanciamiento ético o empático.'
      },
      3: {
        label: 'Bueno (3)',
        desc: 'Puntual en asistencia y entregas; colabora con agrado en los comités de grado académico y mantiene excelente trato con padres.'
      },
      4: {
        label: 'Muy Bueno (4)',
        desc: 'Participa proactivamente en colegiados de mejora continua, propone talleres escolares e impulsa proyectos institucionales de valor.'
      },
      5: {
        label: 'Excelente (5)',
        desc: 'Líder indiscutible e inspirador en la comunidad; mentor de pares académicos y un ejemplo intachable de ética, empatía y vocación.'
      }
    }
  }
};

export const INITIAL_TEACHERS: Teacher[] = [
  // Primaria
  { id: 'doc-001', name: 'Profra. Amanda Morales', level: 'Primaria', grade: '3º', subject: 'Español e Historia', avatar: '👩‍🏫', email: 'amanda.morales@colegio.edu.mx' },
  { id: 'doc-002', name: 'Profr. Carlos Gutiérrez', level: 'Primaria', grade: '5º', subject: 'Matemáticas y Ciencias', avatar: '👨‍🏫', email: 'carlos.gutierrez@colegio.edu.mx' },
  { id: 'doc-003', name: 'Profra. Sofía Mendoza', level: 'Primaria', grade: '2º', subject: 'Artes y Lectura', avatar: '👩‍🎨', email: 'sofia.mendoza@colegio.edu.mx' },

  // Secundaria
  { id: 'doc-004', name: 'Profr. Miguel Ángel Rojas', level: 'Secundaria', grade: '1º', subject: 'Biología', avatar: '🔬', email: 'miguel.rojas@colegio.edu.mx' },
  { id: 'doc-005', name: 'Profra. Elena Vázquez', level: 'Secundaria', grade: '2º', subject: 'Historia y Geografía', avatar: '🗺️', email: 'elena.vazquez@colegio.edu.mx' },
  { id: 'doc-006', name: 'Profr. Ricardo Santos', level: 'Secundaria', grade: '3º', subject: 'Álgebra y Física', avatar: '📐', email: 'ricardo.santos@colegio.edu.mx' },

  // Preparatoria
  { id: 'doc-007', name: 'Dra. Beatriz Arriola', level: 'Preparatoria', grade: '6º Semestre', subject: 'Química Orgánica', avatar: '🧪', email: 'beatriz.arriola@colegio.edu.mx' },
  { id: 'doc-008', name: 'Mtro. Héctor Almazán', level: 'Preparatoria', grade: '4º Semestre', subject: 'Cálculo Diferencial', avatar: '📊', email: 'hector.almazan@colegio.edu.mx' },
  { id: 'doc-009', name: 'Lic. Fernanda Solís', level: 'Preparatoria', grade: '2º Semestre', subject: 'Literatura Universal', avatar: '📚', email: 'fernanda.solis@colegio.edu.mx' }
];

export const INITIAL_EVALUATIONS: Evaluation[] = [
  // Amanda Morales (Primaria)
  {
    id: 'eval-001',
    teacherId: 'doc-001',
    date: '2024-11-15T10:00:00Z',
    evaluatorName: 'Mtra. Martha Ortiz',
    role: 'Coordinador',
    scores: { planeacion: 3, pedagogia: 4, controlGrupo: 3, evaluacion: 4, profesionalismo: 4 },
    comments: 'La maestra Amanda demuestra un gran afecto por los alumnos, y sus clases de fomento a la lectura son excelentes. Debe seguir mejorando en el control del aula en momentos de alta dispersión.',
    level: 'Primaria',
    grade: '3º',
    subject: 'Español e Historia',
    academicYear: '2024'
  },
  {
    id: 'eval-002',
    teacherId: 'doc-001',
    date: '2025-11-20T10:00:00Z',
    evaluatorName: 'Mtra. Martha Ortiz',
    role: 'Coordinador',
    scores: { planeacion: 4, pedagogia: 4, controlGrupo: 4, evaluacion: 4, profesionalismo: 5 },
    comments: 'Se observa una gran mejora en la secuenciación del aula y la planeación. Ha implementado rincones de lectura lúdicos con excelente respuesta del grupo.',
    level: 'Primaria',
    grade: '3º',
    subject: 'Español e Historia',
    academicYear: '2025'
  },
  {
    id: 'eval-003',
    teacherId: 'doc-001',
    date: '2026-05-25T11:30:00Z',
    evaluatorName: 'Dr. Alejandro Peña',
    role: 'Director',
    scores: { planeacion: 4, pedagogia: 5, controlGrupo: 4, evaluacion: 5, profesionalismo: 5 },
    comments: 'Excelente desempeño este periodo. Ha sabido coordinar proyectos de lectura digitales muy provechosos. Su comunicación con familias es ejemplar.',
    level: 'Primaria',
    grade: '3º',
    subject: 'Español e Historia',
    academicYear: '2026'
  },

  // Carlos Gutiérrez (Primaria)
  {
    id: 'eval-004',
    teacherId: 'doc-002',
    date: '2024-11-10T09:00:00Z',
    evaluatorName: 'Mtra. Martha Ortiz',
    role: 'Coordinador',
    scores: { planeacion: 4, pedagogia: 3, controlGrupo: 5, evaluacion: 3, profesionalismo: 4 },
    comments: 'Carlos mantiene un salón extremadamente ordenado y respetuoso. El aprendizaje es fluido, aunque podría dinamizar su didáctica de matemáticas incorporando más juegos educativos.',
    level: 'Primaria',
    grade: '5º',
    subject: 'Matemáticas y Ciencias',
    academicYear: '2024'
  },
  {
    id: 'eval-005',
    teacherId: 'doc-002',
    date: '2025-11-12T09:00:00Z',
    evaluatorName: 'Mtra. Martha Ortiz',
    role: 'Coordinador',
    scores: { planeacion: 4, pedagogia: 4, controlGrupo: 5, evaluacion: 4, profesionalismo: 4 },
    comments: 'Incorporó exitosamente tabletas y simuladores lúdicos. Las calificaciones del grupo en ciencias subieron notablemente.',
    level: 'Primaria',
    grade: '5º',
    subject: 'Matemáticas y Ciencias',
    academicYear: '2025'
  },
  {
    id: 'eval-006',
    teacherId: 'doc-002',
    date: '2026-05-18T09:30:00Z',
    evaluatorName: 'Mtra. Martha Ortiz',
    role: 'Coordinador',
    scores: { planeacion: 5, pedagogia: 4, controlGrupo: 5, evaluacion: 5, profesionalismo: 5 },
    comments: 'Destacada labor en la planeación y la inclusión en el aula. Diseñó rúbricas claras de proyectos de ciencias que se compartieron con toda la primaria.',
    level: 'Primaria',
    grade: '5º',
    subject: 'Matemáticas y Ciencias',
    academicYear: '2026'
  },

  // Ricardo Santos (Secundaria - Física/Matemáticas)
  {
    id: 'eval-007',
    teacherId: 'doc-006',
    date: '2024-11-20T12:00:00Z',
    evaluatorName: 'Ing. Laura Ruiz',
    role: 'Coordinador',
    scores: { planeacion: 3, pedagogia: 3, controlGrupo: 2, evaluacion: 3, profesionalismo: 4 },
    comments: 'Su dominio de la materia es claro, pero presenta problemas reiterados para controlar el ruido y la disciplina en segundo y tercer grado de secundaria. Debe implementar normas más firmes.',
    level: 'Secundaria',
    grade: '3º',
    subject: 'Álgebra y Física',
    academicYear: '2024'
  },
  {
    id: 'eval-008',
    teacherId: 'doc-006',
    date: '2025-11-25T12:00:00Z',
    evaluatorName: 'Ing. Laura Ruiz',
    role: 'Coordinador',
    scores: { planeacion: 4, pedagogia: 4, controlGrupo: 3, evaluacion: 4, profesionalismo: 4 },
    comments: 'Participó activamente en el curso de comunicación asertiva docente. Ha mejorado mucho la contención y manejo del aula con límites claros.',
    level: 'Secundaria',
    grade: '3º',
    subject: 'Álgebra y Física',
    academicYear: '2025'
  },
  {
    id: 'eval-009',
    teacherId: 'doc-006',
    date: '2026-05-24T12:30:00Z',
    evaluatorName: 'Mtro. Héctor Almazán',
    role: 'Colega',
    scores: { planeacion: 4, pedagogia: 4, controlGrupo: 4, evaluacion: 4, profesionalismo: 4 },
    comments: 'Trabajo colegiado excelente. Hemos unificado criterios de evaluación entre secundaria y preparatoria para facilitar la transición de los alumnos.',
    level: 'Secundaria',
    grade: '3º',
    subject: 'Álgebra y Física',
    academicYear: '2026'
  },

  // Dra. Beatriz Arriola (Preparatoria)
  {
    id: 'eval-010',
    teacherId: 'doc-007',
    date: '2024-11-18T10:30:00Z',
    evaluatorName: 'Dr. Alejandro Peña',
    role: 'Director',
    scores: { planeacion: 5, pedagogia: 4, controlGrupo: 4, evaluacion: 4, profesionalismo: 5 },
    comments: 'Clase con alto rigor académico, nivel metodológico de preparatoria que emula nivel universitario. Es de gran valor para la escuela. Sugiero mayor retroalimentación progresiva a alumnos rezagados.',
    level: 'Preparatoria',
    grade: '6º Semestre',
    subject: 'Química Orgánica',
    academicYear: '2024'
  },
  {
    id: 'eval-011',
    teacherId: 'doc-007',
    date: '2025-11-22T11:00:00Z',
    evaluatorName: 'Dr. Alejandro Peña',
    role: 'Director',
    scores: { planeacion: 5, pedagogia: 5, controlGrupo: 4, evaluacion: 5, profesionalismo: 5 },
    comments: 'Excelente implementación de proyectos en laboratorio y rúbricas súper detalladas en línea. Los chicos entienden perfectamente lo que se espera de ellos.',
    level: 'Preparatoria',
    grade: '6º Semestre',
    subject: 'Química Orgánica',
    academicYear: '2025'
  },
  {
    id: 'eval-012',
    teacherId: 'doc-007',
    date: '2026-05-28T10:00:00Z',
    evaluatorName: 'Dra. Beatriz Arriola',
    role: 'Autoevaluación',
    scores: { planeacion: 5, pedagogia: 5, controlGrupo: 5, evaluacion: 5, profesionalismo: 5 },
    comments: 'He logrado consolidar la acreditación nacional del plan de estudios de química. Siento enorme satisfacción con la actitud investigativa que muestran los alumnos este año.',
    level: 'Preparatoria',
    grade: '6º Semestre',
    subject: 'Química Orgánica',
    academicYear: '2026'
  }
];

export const INITIAL_STUDENT_COMMENTS: StudentComment[] = [
  // Amanda Morales
  { id: 'com-001', teacherId: 'doc-001', date: '2026-05-10T14:22:00Z', comment: 'La maestra Amanda explica súper bonito y tiene un rincón de libros muy padre. Me gusta mucho su clase de Español.', rating: 5, level: 'Primaria', grade: '3º', subject: 'Español e Historia', sentiment: 'positivo' },
  { id: 'com-002', teacherId: 'doc-001', date: '2026-05-22T18:41:00Z', comment: 'Las clases de historia son divertidas porque nos disfraza o jugamos en el patio, pero a veces algunos compañeros gritan mucho y no se oye.', rating: 4, level: 'Primaria', grade: '3º', subject: 'Español e Historia', sentiment: 'neutro' },

  // Carlos Gutiérrez
  { id: 'com-003', teacherId: 'doc-002', date: '2026-05-15T15:30:00Z', comment: 'Al principio le tenía miedo a matemáticas pero el Profe Carlos nos enseña con la tablet y juegos de naves y ahora ya me salen las divisiones.', rating: 5, level: 'Primaria', grade: '5º', subject: 'Matemáticas y Ciencias', sentiment: 'positivo' },
  { id: 'com-004', teacherId: 'doc-002', date: '2026-05-28T16:05:00Z', comment: 'Es un profesor muy justo. Si haces la tarea y participas te va excelente. Es un poco estricto con llegar a tiempo.', rating: 4, level: 'Primaria', grade: '5º', subject: 'Matemáticas y Ciencias', sentiment: 'positivo' },

  // Ricardo Santos
  { id: 'com-005', teacherId: 'doc-006', date: '2026-05-12T11:45:00Z', comment: 'Explica física con ejemplos chidos del fútbol y videojuegos, pero a veces se desespera cuando el salón empieza a echar relajo y empieza a gritar.', rating: 3, level: 'Secundaria', grade: '3º', subject: 'Álgebra y Física', sentiment: 'neutro' },
  { id: 'com-006', teacherId: 'doc-006', date: '2026-05-20T13:12:00Z', comment: 'Es muy buena onda y sus laboratorios son chidos, pero califica demasiado estricto un solo examen final. Si repruebas ese ya valió el trimestre.', rating: 3, level: 'Secundaria', grade: '3º', subject: 'Álgebra y Física', sentiment: 'critico' },

  // Dra. Beatriz Arriola
  { id: 'com-007', teacherId: 'doc-007', date: '2026-05-19T10:15:00Z', comment: 'La doctora Arriola es de las mejores maestras que he tenido en toda la prepa. Sabe un montón y te inspira para estudiar medicina o ingeniería química.', rating: 5, level: 'Preparatoria', grade: '6º Semestre', subject: 'Química Orgánica', sentiment: 'positivo' },
  { id: 'com-008', teacherId: 'doc-007', date: '2026-05-21T11:00:00Z', comment: 'Excelente nivel académico. Eso sí, prepárate para no dormir porque deja muchísimos experimentos y reportes con formatos estrictos.', rating: 4, level: 'Preparatoria', grade: '6º Semestre', subject: 'Química Orgánica', sentiment: 'neutro' }
];
