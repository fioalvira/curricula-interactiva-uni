
import { CurriculumTemplate, Subject } from '@/types/curriculum';

export const createDefaultTemplate = (userId: string): CurriculumTemplate => {
  const defaultSubjects: Subject[] = [
    // SEMESTRE 1
    { id: 'taller1', name: 'Taller de tecnologías 1', category: 'programming', prerequisites: [], semester: 1 },
    { id: 'prog1', name: 'Programación 1', category: 'programming', prerequisites: [], semester: 1 },
    { id: 'algebra', name: 'Álgebra lineal', category: 'math', prerequisites: [], semester: 1 },
    { id: 'calculo', name: 'Cálculo en una variable', category: 'math', prerequisites: [], semester: 1 },
    
    // SEMESTRE 2
    { id: 'fundcomp', name: 'Fundamentos de computación', category: 'programming', prerequisites: [], semester: 2 },
    { id: 'prog2', name: 'Programación 2', category: 'programming', prerequisites: ['prog1'], semester: 2 },
    { id: 'matdisc', name: 'Matemática discreta', category: 'math', prerequisites: [], semester: 2 },
    { id: 'fundsist', name: 'Fundamentos de sistemas ciberfísicos', category: 'systems', prerequisites: ['calculo'], semester: 2 },
    
    // SEMESTRE 3
    { id: 'logica', name: 'Lógica para computación', category: 'math', prerequisites: ['fundcomp'], semester: 3 },
    { id: 'algo1', name: 'Estructuras de datos y algoritmos 1', category: 'programming', prerequisites: ['prog2', 'fundcomp'], semester: 3 },
    { id: 'arquit', name: 'Arquitectura de sistemas', category: 'systems', prerequisites: [], semester: 3 },
    { id: 'probest', name: 'Probabilidad y estadística', category: 'math', prerequisites: ['algebra', 'calculo'], semester: 3 },
    
    // SEMESTRE 4
    { id: 'fundsoft', name: 'Fundamentos de ingeniería de software', category: 'software', prerequisites: ['prog2'], semester: 4 },
    { id: 'algo2', name: 'Estructuras de datos y algoritmos 2', category: 'programming', prerequisites: ['algo1', 'matdisc'], semester: 4 },
    { id: 'bd1', name: 'Bases de datos 1', category: 'data', prerequisites: ['prog2'], semester: 4 },
    { id: 'siso', name: 'Sistemas operativos', category: 'systems', prerequisites: ['arquit'], semester: 4 },
    { id: 'matmat', name: 'Materia de Matemática', category: 'math', prerequisites: ['algebra', 'calculo'], semester: 4 },
    
    // SEMESTRE 5
    { id: 'teoria', name: 'Teoría de la computación', category: 'math', prerequisites: ['algo1', 'logica'], semester: 5 },
    { id: 'app1', name: 'Diseño de aplicaciones 1', category: 'software', prerequisites: ['algo1', 'bd1', 'fundsoft'], semester: 5 },
    { id: 'bd2', name: 'Bases de datos 2', category: 'data', prerequisites: ['bd1', 'logica'], semester: 5 },
    { id: 'redes', name: 'Redes', category: 'systems', prerequisites: ['siso'], semester: 5 },
    { id: 'matsocial', name: 'Materia de Ciencias sociales', category: 'management', prerequisites: [], semester: 5 },
    
    // MINI SEMESTRE 5.5
    { id: 'comun1', name: 'Materia de Comunicación y negociación', category: 'management', prerequisites: [], semester: '5.5' },
    
    // SEMESTRE 6
    { id: 'agil1', name: 'Ingeniería de software ágil 1', category: 'software', prerequisites: ['app1', 'fundsoft'], semester: 6 },
    { id: 'app2', name: 'Diseño de aplicaciones 2', category: 'software', prerequisites: ['app1', 'fundsoft'], semester: 6 },
    { id: 'taller2', name: 'Taller de tecnologías 2', category: 'programming', prerequisites: ['algo2', 'bd1', 'redes', 'app1', 'fundsist', 'taller1'], semester: 6 },
    { id: 'progredes', name: 'Programación de redes', category: 'systems', prerequisites: ['app1', 'siso'], semester: 6 },
    { id: 'ml', name: 'Materia de Sistemas inteligentes (Machine learning)', category: 'data', prerequisites: ['algo1', 'probest'], semester: 6 },
    
    // SEMESTRE 7
    { id: 'agil2', name: 'Ingeniería de software ágil 2', category: 'software', prerequisites: ['app1', 'app2', 'progredes', 'agil1'], semester: 7 },
    { id: 'arquisoft', name: 'Arquitectura de software', category: 'software', prerequisites: ['algo2', 'bd2', 'app2', 'progredes'], semester: 7 },
    { id: 'bigdata', name: 'Materia de Gestión de la información (Big Data)', category: 'data', prerequisites: ['bd2', 'app1', 'siso'], semester: 7 },
    { id: 'seguridad', name: 'Materia de Seguridad informática', category: 'systems', prerequisites: [], semester: 7 },
    { id: 'ia', name: 'Inteligencia artificial', category: 'data', prerequisites: ['algo2', 'probest', 'logica'], semester: 7 },
    
    // MINI SEMESTRE 7.5
    { id: 'innovacion', name: 'Materia de Innovación y emprendedurismo', category: 'management', prerequisites: [], semester: '7.5' },
    
    // SEMESTRE 8
    { id: 'ingprod', name: 'Materia de Ingeniería de productos de software', category: 'software', prerequisites: [], semester: 8 },
    { id: 'arquipract', name: 'Arquitectura de software en la práctica', category: 'software', prerequisites: ['ml', 'arquisoft', 'progredes', 'agil2'], semester: 8 },
    { id: 'nuevastech', name: 'Materia de nuevas tecnologías y dominios de aplicación', category: 'programming', prerequisites: [], semester: 8 },
    { id: 'integrador', name: 'Trabajo integrador', category: 'software', prerequisites: ['bd2', 'app2', 'teoria', 'progredes', 'agil1'], semester: 8 },
    { id: 'estructuras', name: 'Materia de Algoritmos, Estructuras de datos y Lenguajes', category: 'programming', prerequisites: ['algo2'], semester: 8 },
    
    // SEMESTRE 9
    { id: 'comun2', name: 'Materia de Comunicación y negociación', category: 'management', prerequisites: [], semester: 9 },
    { id: 'elect1', name: 'Electiva 1', category: 'elective', prerequisites: [], semester: 9 },
    
    // SEMESTRE 10
    { id: 'elect2', name: 'Electiva 2', category: 'elective', prerequisites: [], semester: 10 },
    { id: 'elect3', name: 'Electiva 3', category: 'elective', prerequisites: [], semester: 10 },
    { id: 'proyectofinal', name: 'Proyecto final', category: 'software', prerequisites: ['bigdata', 'seguridad', 'innovacion', 'ml', 'integrador', 'arquisoft', 'ia', 'agil2', 'taller2'], semester: 10 }
  ];

  return {
    id: `default-${userId}-${Date.now()}`,
    userId: userId,
    facultyName: 'Universidad ORT Uruguay',
    careerName: 'Ingeniería en Sistemas',
    country: 'Uruguay',
    totalSemesters: 10,
    miniSemesters: ['5.5', '7.5'],
    subjects: defaultSubjects,
    categories: ['programming', 'math', 'systems', 'software', 'data', 'management', 'elective'],
    colorPalette: 'purpor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
