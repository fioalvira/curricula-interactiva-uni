import React, { useState, useEffect } from 'react';
import { Check, Lock, BookOpen, Trash2, Moon, Sun } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PerformanceGraphs } from '@/components/PerformanceGraphs';

// Definición de tipos
interface Subject {
  id: string;
  name: string;
  area: 'programming' | 'math' | 'systems' | 'software' | 'data' | 'management' | 'elective';
  prerequisites: string[];
  semester: number | 5.5 | 7.5;
  isInitiallyUnlocked?: boolean;
}

// Configuración de colores usando la paleta PurpOr
const areaColors = {
  programming: 'bg-purple-900 hover:bg-purple-950 border-purple-800', // Púrpura más oscuro para programación
  math: 'bg-purple-700 hover:bg-purple-800 border-purple-600', // Púrpura medio para matemáticas
  systems: 'bg-purple-600 hover:bg-purple-700 border-purple-500', // Púrpura claro para sistemas
  software: 'bg-pink-600 hover:bg-pink-700 border-pink-500', // Rosa para software
  data: 'bg-pink-400 hover:bg-pink-500 border-pink-300', // Rosa claro para datos
  management: 'bg-pink-300 hover:bg-pink-400 border-pink-200', // Rosa muy claro para gestión
  elective: 'bg-purple-500 hover:bg-purple-600 border-purple-400' // Púrpura medio para electivas
};

// Configuración de materias por semestre con prerrequisitos corregidos
const subjects: Subject[] = [
  // SEMESTRE 1 - Solo estas 4 empiezan desbloqueadas
  { id: 'taller1', name: 'Taller de tecnologías 1', area: 'programming', prerequisites: [], semester: 1, isInitiallyUnlocked: true },
  { id: 'prog1', name: 'Programación 1', area: 'programming', prerequisites: [], semester: 1, isInitiallyUnlocked: true },
  { id: 'algebra', name: 'Álgebra lineal', area: 'math', prerequisites: [], semester: 1, isInitiallyUnlocked: true },
  { id: 'calculo', name: 'Cálculo en una variable', area: 'math', prerequisites: [], semester: 1, isInitiallyUnlocked: true },
  
  // SEMESTRE 2 - Prerrequisitos corregidos
  { id: 'fundcomp', name: 'Fundamentos de computación', area: 'programming', prerequisites: [], semester: 2 },
  { id: 'prog2', name: 'Programación 2', area: 'programming', prerequisites: ['prog1'], semester: 2 },
  { id: 'matdisc', name: 'Matemática discreta', area: 'math', prerequisites: [], semester: 2 },
  { id: 'fundsist', name: 'Fundamentos de sistemas ciberfísicos', area: 'systems', prerequisites: ['calculo'], semester: 2 },
  
  // SEMESTRE 3 - Prerrequisitos corregidos
  { id: 'logica', name: 'Lógica para computación', area: 'math', prerequisites: ['fundcomp'], semester: 3 },
  { id: 'algo1', name: 'Estructuras de datos y algoritmos 1', area: 'programming', prerequisites: ['prog2', 'fundcomp'], semester: 3 },
  { id: 'arquit', name: 'Arquitectura de sistemas', area: 'systems', prerequisites: [], semester: 3 },
  { id: 'probest', name: 'Probabilidad y estadística', area: 'math', prerequisites: ['algebra', 'calculo'], semester: 3 },
  
  // SEMESTRE 4
  { id: 'fundsoft', name: 'Fundamentos de ingeniería de software', area: 'software', prerequisites: ['prog2'], semester: 4 },
  { id: 'algo2', name: 'Estructuras de datos y algoritmos 2', area: 'programming', prerequisites: ['algo1', 'matdisc'], semester: 4 },
  { id: 'bd1', name: 'Bases de datos 1', area: 'data', prerequisites: ['prog2'], semester: 4 },
  { id: 'siso', name: 'Sistemas operativos', area: 'systems', prerequisites: ['arquit'], semester: 4 },
  { id: 'matmat', name: 'Materia de Matemática', area: 'math', prerequisites: ['algebra', 'calculo'], semester: 4 },
  
  // SEMESTRE 5
  { id: 'teoria', name: 'Teoría de la computación', area: 'math', prerequisites: ['algo1', 'logica'], semester: 5 },
  { id: 'app1', name: 'Diseño de aplicaciones 1', area: 'software', prerequisites: ['algo1', 'bd1', 'fundsoft'], semester: 5 },
  { id: 'bd2', name: 'Bases de datos 2', area: 'data', prerequisites: ['bd1', 'logica'], semester: 5 },
  { id: 'redes', name: 'Redes', area: 'systems', prerequisites: ['siso'], semester: 5 },
  { id: 'matsocial', name: 'Materia de Ciencias sociales', area: 'management', prerequisites: [], semester: 5 },
  
  // MINI SEMESTRE 5.5
  { id: 'comun1', name: 'Materia de Comunicación y negociación', area: 'management', prerequisites: [], semester: 5.5 },
  
  // SEMESTRE 6 - Prerrequisitos corregidos
  { id: 'agil1', name: 'Ingeniería de software ágil 1', area: 'software', prerequisites: ['app1', 'fundsoft'], semester: 6 },
  { id: 'app2', name: 'Diseño de aplicaciones 2', area: 'software', prerequisites: ['app1', 'fundsoft'], semester: 6 },
  { id: 'taller2', name: 'Taller de tecnologías 2', area: 'programming', prerequisites: ['algo2', 'bd1', 'redes', 'app1', 'fundsist', 'taller1'], semester: 6 },
  { id: 'progredes', name: 'Programación de redes', area: 'systems', prerequisites: ['app1', 'siso'], semester: 6 },
  { id: 'ml', name: 'Materia de Sistemas inteligentes (Machine learning)', area: 'data', prerequisites: ['algo1', 'probest'], semester: 6 },
  
  // SEMESTRE 7 - Prerrequisitos corregidos
  { id: 'agil2', name: 'Ingeniería de software ágil 2', area: 'software', prerequisites: ['app1', 'app2', 'progredes', 'agil1'], semester: 7 },
  { id: 'arquisoft', name: 'Arquitectura de software', area: 'software', prerequisites: ['algo2', 'bd2', 'app2', 'progredes'], semester: 7 },
  { id: 'bigdata', name: 'Materia de Gestión de la información (Big Data)', area: 'data', prerequisites: ['bd2', 'app1', 'siso'], semester: 7 },
  { id: 'seguridad', name: 'Materia de Seguridad informática', area: 'systems', prerequisites: [], semester: 7 },
  { id: 'ia', name: 'Inteligencia artificial', area: 'data', prerequisites: ['algo2', 'probest', 'logica'], semester: 7 },
  
  // MINI SEMESTRE 7.5
  { id: 'innovacion', name: 'Materia de Innovación y emprendedurismo', area: 'management', prerequisites: [], semester: 7.5 },
  
  // SEMESTRE 8 - Prerrequisitos corregidos
  { id: 'ingprod', name: 'Materia de Ingeniería de productos de software', area: 'software', prerequisites: [], semester: 8 },
  { id: 'arquipract', name: 'Arquitectura de software en la práctica', area: 'software', prerequisites: ['ml', 'arquisoft', 'progredes', 'agil2'], semester: 8 },
  { id: 'nuevastech', name: 'Materia de nuevas tecnologías y dominios de aplicación', area: 'programming', prerequisites: [], semester: 8 },
  { id: 'integrador', name: 'Trabajo integrador', area: 'software', prerequisites: ['bd2', 'app2', 'teoria', 'progredes', 'agil1'], semester: 8 },
  { id: 'estructuras', name: 'Materia de Algoritmos, Estructuras de datos y Lenguajes', area: 'programming', prerequisites: ['algo2'], semester: 8 },
  
  // SEMESTRE 9
  { id: 'comun2', name: 'Materia de Comunicación y negociación', area: 'management', prerequisites: [], semester: 9 },
  { id: 'elect1', name: 'Electiva 1', area: 'elective', prerequisites: [], semester: 9 },
  
  // SEMESTRE 10
  { id: 'elect2', name: 'Electiva 2', area: 'elective', prerequisites: [], semester: 10 },
  { id: 'elect3', name: 'Electiva 3', area: 'elective', prerequisites: [], semester: 10 },
  { id: 'proyectofinal', name: 'Proyecto final', area: 'software', prerequisites: ['bigdata', 'seguridad', 'innovacion', 'ml', 'integrador', 'arquisoft', 'ia', 'agil2', 'taller2'], semester: 10 }
];

const CurriculumMapper = () => {
  const [approvedSubjects, setApprovedSubjects] = useState<Set<string>>(new Set());
  const [unlockedSubjects, setUnlockedSubjects] = useState<Set<string>>(new Set());
  const [darkMode, setDarkMode] = useState(false);

  // Cargar estado desde localStorage al inicializar
  useEffect(() => {
    const savedApproved = localStorage.getItem('ort-curriculum-approved');
    const savedDarkMode = localStorage.getItem('ort-curriculum-dark-mode');
    
    if (savedApproved) {
      setApprovedSubjects(new Set(JSON.parse(savedApproved)));
    }
    
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Aplicar modo oscuro al body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ort-curriculum-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Calcular materias desbloqueadas basado en prerrequisitos
  useEffect(() => {
    const unlocked = new Set<string>();
    
    // Materias inicialmente desbloqueadas (solo las 4 del primer semestre)
    subjects.forEach(subject => {
      if (subject.isInitiallyUnlocked) {
        unlocked.add(subject.id);
      }
    });
    
    // Materias sin prerrequisitos (electivas y algunas materias especiales)
    subjects.forEach(subject => {
      if (subject.prerequisites.length === 0 && !subject.isInitiallyUnlocked) {
        // Solo desbloquear materias sin prerrequisitos que no sean del semestre 1
        if (subject.semester > 1) {
          unlocked.add(subject.id);
        }
      }
    });

    // Verificar materias que pueden desbloquearse por prerrequisitos cumplidos
    let changed = true;
    while (changed) {
      changed = false;
      subjects.forEach(subject => {
        if (!unlocked.has(subject.id) && subject.prerequisites.length > 0) {
          const hasAllPrereqs = subject.prerequisites.every(prereq => 
            approvedSubjects.has(prereq)
          );
          if (hasAllPrereqs) {
            unlocked.add(subject.id);
            changed = true;
          }
        }
      });
    }
    
    setUnlockedSubjects(unlocked);
  }, [approvedSubjects]);

  // Manejar aprobación/desaprobación de materias
  const toggleSubjectApproval = (subjectId: string) => {
    const newApproved = new Set(approvedSubjects);
    
    if (newApproved.has(subjectId)) {
      newApproved.delete(subjectId);
    } else {
      newApproved.add(subjectId);
    }
    
    setApprovedSubjects(newApproved);
    localStorage.setItem('ort-curriculum-approved', JSON.stringify([...newApproved]));
  };

  // Limpiar toda la currícula
  const clearCurriculum = () => {
    setApprovedSubjects(new Set());
    localStorage.removeItem('ort-curriculum-approved');
  };

  // Alternar modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Obtener el estado de una materia
  const getSubjectStatus = (subjectId: string) => {
    const isApproved = approvedSubjects.has(subjectId);
    const isUnlocked = unlockedSubjects.has(subjectId);
    return { isApproved, isUnlocked };
  };

  // Agrupar materias por semestre incluyendo mini-semestres
  const subjectsBySemester = () => {
    const grouped: { [key: string]: Subject[] } = {};
    subjects.forEach(subject => {
      const semesterKey = subject.semester.toString();
      if (!grouped[semesterKey]) {
        grouped[semesterKey] = [];
      }
      grouped[semesterKey].push(subject);
    });
    return grouped;
  };

  // Función para ordenar las claves de semestre correctamente
  const sortSemesterKeys = (keys: string[]) => {
    return keys.sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      return numA - numB;
    });
  };

  // Función para obtener el nombre del semestre
  const getSemesterDisplayName = (semester: string) => {
    if (semester === '5.5') return 'Mini Semestre 5.5';
    if (semester === '7.5') return 'Mini Semestre 7.5';
    return `Semestre ${semester}`;
  };

  const semesterGroups = subjectsBySemester();
  const totalSubjects = subjects.length;
  const approvedCount = approvedSubjects.size;
  const unlockedCount = unlockedSubjects.size - approvedCount;
  const lockedCount = totalSubjects - unlockedSubjects.size;

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Malla Curricular
          </h1>
          <h2 className="text-2xl font-semibold text-red-800 mb-4">
            Universidad ORT Uruguay
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Marca las materias como aprobadas para desbloquear automáticamente las siguientes materias en la secuencia curricular.
          </p>
        </div>

        {/* Botones de control */}
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            onClick={clearCurriculum}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar Currícula
          </Button>
          <Button 
            onClick={toggleDarkMode}
            variant="outline"
            className="flex items-center gap-2"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? 'Modo Claro' : 'Modo Nocturno'}
          </Button>
        </div>

        {/* Tabs para organizar contenido */}
        <Tabs defaultValue="curriculum" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="curriculum">Malla Curricular</TabsTrigger>
            <TabsTrigger value="performance">Gráficas de Rendimiento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="curriculum">
            {/* Leyenda de colores */}
            <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Áreas de conocimiento</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {Object.entries(areaColors).map(([area, colorClass]) => (
                  <div key={area} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${colorClass.split(' ')[0]}`}></div>
                    <span className="text-sm text-muted-foreground capitalize">
                      {area === 'programming' && 'Programación'}
                      {area === 'math' && 'Matemáticas'}
                      {area === 'systems' && 'Sistemas'}
                      {area === 'software' && 'Software'}
                      {area === 'data' && 'Datos'}
                      {area === 'management' && 'Gestión'}
                      {area === 'elective' && 'Electivas'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {approvedCount}
                </div>
                <div className="text-muted-foreground">Materias Aprobadas</div>
              </div>
              <div className="bg-card rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {unlockedCount}
                </div>
                <div className="text-muted-foreground">Disponibles</div>
              </div>
              <div className="bg-card rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-muted-foreground mb-2">
                  {lockedCount}
                </div>
                <div className="text-muted-foreground">Bloqueadas</div>
              </div>
            </div>

            {/* Malla curricular por semestres */}
            <div className="space-y-8">
              {sortSemesterKeys(Object.keys(semesterGroups)).map((semesterKey) => {
                const semesterSubjects = semesterGroups[semesterKey];
                const isMinSemester = semesterKey.includes('.');
                
                return (
                  <div key={semesterKey} className="bg-card rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`text-white px-4 py-2 rounded-lg font-bold ${isMinSemester ? 'bg-purple-600' : 'bg-red-800'}`}>
                        {getSemesterDisplayName(semesterKey)}
                      </div>
                      <div className="text-muted-foreground">
                        {semesterSubjects.filter(s => approvedSubjects.has(s.id)).length} / {semesterSubjects.length} completadas
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {semesterSubjects.map((subject) => {
                        const { isApproved, isUnlocked } = getSubjectStatus(subject.id);
                        
                        return (
                          <div
                            key={subject.id}
                            className={`
                              relative rounded-lg p-4 transition-all duration-200 cursor-pointer border-2
                              ${isUnlocked 
                                ? `${areaColors[subject.area]} text-white shadow-md transform hover:scale-105` 
                                : 'bg-muted text-muted-foreground cursor-not-allowed border-border'
                              }
                              ${isApproved ? 'ring-4 ring-green-400' : ''}
                            `}
                            onClick={() => isUnlocked && toggleSubjectApproval(subject.id)}
                          >
                            {/* Contenido de la tarjeta */}
                            <div className="relative z-10">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-sm leading-tight flex-1 pr-2">
                                  {subject.name}
                                </h4>
                                <div className="flex-shrink-0">
                                  {!isUnlocked && <Lock className="w-4 h-4" />}
                                  {isUnlocked && !isApproved && <BookOpen className="w-4 h-4" />}
                                  {isApproved && <Check className="w-5 h-5 text-green-300" />}
                                </div>
                              </div>
                              
                              {/* Prerrequisitos */}
                              {subject.prerequisites.length > 0 && (
                                <div className="text-xs opacity-90 mt-2">
                                  <div className="font-medium mb-1">Requiere:</div>
                                  <div className="space-y-0.5">
                                    {subject.prerequisites.map(prereqId => {
                                      const prereq = subjects.find(s => s.id === prereqId);
                                      const prereqApproved = approvedSubjects.has(prereqId);
                                      return (
                                        <div 
                                          key={prereqId}
                                          className={`text-xs ${prereqApproved ? 'line-through opacity-75' : ''}`}
                                        >
                                          • {prereq?.name}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              
                              {/* Indicador de estado */}
                              <div className="mt-3 text-xs font-medium">
                                {!isUnlocked && '🔒 Bloqueada'}
                                {isUnlocked && !isApproved && '📖 Disponible'}
                                {isApproved && '✅ Aprobada'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformanceGraphs 
              subjects={subjects}
              approvedSubjects={approvedSubjects}
              areaColors={areaColors}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 text-center text-muted-foreground text-sm">
        <p>Universidad ORT Uruguay - Malla Curricular Interactiva</p>
        <p className="mt-1">Haz clic en las materias disponibles para marcarlas como aprobadas</p>
      </div>
    </div>
  );
};

export default CurriculumMapper;
