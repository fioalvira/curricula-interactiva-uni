
import { useState, useEffect } from 'react';
import { Check, Lock, BookOpen, Trash2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurriculumTemplate, Subject } from '@/types/curriculum';

interface CurriculumViewerProps {
  template: CurriculumTemplate;
  onViewPerformance?: () => void;
}

// Color palettes
const colorPalettes = {
  purpor: {
    programming: 'bg-purple-900 hover:bg-purple-950 border-purple-800',
    math: 'bg-purple-700 hover:bg-purple-800 border-purple-600',
    systems: 'bg-purple-600 hover:bg-purple-700 border-purple-500',
    software: 'bg-pink-600 hover:bg-pink-700 border-pink-500',
    data: 'bg-pink-400 hover:bg-pink-500 border-pink-300',
    management: 'bg-pink-300 hover:bg-pink-400 border-pink-200',
    default: 'bg-purple-500 hover:bg-purple-600 border-purple-400'
  },
  blues: {
    programming: 'bg-blue-900 hover:bg-blue-950 border-blue-800',
    math: 'bg-blue-700 hover:bg-blue-800 border-blue-600',
    systems: 'bg-blue-600 hover:bg-blue-700 border-blue-500',
    software: 'bg-cyan-600 hover:bg-cyan-700 border-cyan-500',
    data: 'bg-cyan-400 hover:bg-cyan-500 border-cyan-300',
    management: 'bg-cyan-300 hover:bg-cyan-400 border-cyan-200',
    default: 'bg-blue-500 hover:bg-blue-600 border-blue-400'
  },
  greens: {
    programming: 'bg-green-900 hover:bg-green-950 border-green-800',
    math: 'bg-green-700 hover:bg-green-800 border-green-600',
    systems: 'bg-green-600 hover:bg-green-700 border-green-500',
    software: 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500',
    data: 'bg-emerald-400 hover:bg-emerald-500 border-emerald-300',
    management: 'bg-emerald-300 hover:bg-emerald-400 border-emerald-200',
    default: 'bg-green-500 hover:bg-green-600 border-green-400'
  },
  warm: {
    programming: 'bg-red-900 hover:bg-red-950 border-red-800',
    math: 'bg-red-700 hover:bg-red-800 border-red-600',
    systems: 'bg-orange-600 hover:bg-orange-700 border-orange-500',
    software: 'bg-orange-500 hover:bg-orange-600 border-orange-400',
    data: 'bg-yellow-500 hover:bg-yellow-600 border-yellow-400',
    management: 'bg-yellow-400 hover:bg-yellow-500 border-yellow-300',
    default: 'bg-orange-500 hover:bg-orange-600 border-orange-400'
  }
};

export const CurriculumViewer = ({ template, onViewPerformance }: CurriculumViewerProps) => {
  const [approvedSubjects, setApprovedSubjects] = useState<Set<string>>(new Set());
  const [unlockedSubjects, setUnlockedSubjects] = useState<Set<string>>(new Set());

  const palette = colorPalettes[template.colorPalette as keyof typeof colorPalettes] || colorPalettes.purpor;

  // Load approved subjects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`approved-${template.id}`);
    if (saved) {
      setApprovedSubjects(new Set(JSON.parse(saved)));
    }
  }, [template.id]);

  // Calculate unlocked subjects
  useEffect(() => {
    const unlocked = new Set<string>();
    
    // Add subjects without prerequisites
    template.subjects.forEach(subject => {
      if (subject.prerequisites.length === 0) {
        unlocked.add(subject.id);
      }
    });

    // Add subjects whose prerequisites are approved
    let changed = true;
    while (changed) {
      changed = false;
      template.subjects.forEach(subject => {
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
  }, [approvedSubjects, template.subjects]);

  const toggleSubjectApproval = (subjectId: string) => {
    const newApproved = new Set(approvedSubjects);
    
    if (newApproved.has(subjectId)) {
      newApproved.delete(subjectId);
    } else {
      newApproved.add(subjectId);
    }
    
    setApprovedSubjects(newApproved);
    localStorage.setItem(`approved-${template.id}`, JSON.stringify([...newApproved]));
  };

  const clearCurriculum = () => {
    setApprovedSubjects(new Set());
    localStorage.removeItem(`approved-${template.id}`);
  };

  const getSubjectColor = (category: string) => {
    const normalizedCategory = category.toLowerCase();
    return palette[normalizedCategory as keyof typeof palette] || palette.default;
  };

  const getSemesterName = (semester: string | number) => {
    const semesterStr = semester.toString();
    if (semesterStr.includes('.')) {
      return `Mini Semestre ${semesterStr}`;
    }
    return `Semestre ${semesterStr}`;
  };

  // Group subjects by semester
  const subjectsBySemester = () => {
    const grouped: { [key: string]: Subject[] } = {};
    template.subjects.forEach(subject => {
      const semesterKey = subject.semester.toString();
      if (!grouped[semesterKey]) {
        grouped[semesterKey] = [];
      }
      grouped[semesterKey].push(subject);
    });
    return grouped;
  };

  const semesterGroups = subjectsBySemester();
  const sortedSemesters = Object.keys(semesterGroups).sort((a, b) => parseFloat(a) - parseFloat(b));

  const totalSubjects = template.subjects.length;
  const approvedCount = approvedSubjects.size;
  const unlockedCount = unlockedSubjects.size - approvedCount;
  const lockedCount = totalSubjects - unlockedSubjects.size;

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {template.careerName}
          </h1>
          <h2 className="text-2xl font-semibold text-red-800 mb-4">
            {template.facultyName} - {template.country}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Marca las materias como aprobadas para desbloquear automáticamente las siguientes materias en la secuencia curricular.
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            onClick={clearCurriculum}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar Currícula
          </Button>
          {onViewPerformance && (
            <Button 
              onClick={onViewPerformance}
              variant="outline"
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Rendimiento
            </Button>
          )}
        </div>

        {/* Statistics */}
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

        {/* Curriculum by semesters */}
        <div className="space-y-8">
          {sortedSemesters.map((semesterKey) => {
            const semesterSubjects = semesterGroups[semesterKey];
            const isMinSemester = semesterKey.includes('.');
            
            return (
              <div key={semesterKey} className="bg-card rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`text-white px-4 py-2 rounded-lg font-bold ${isMinSemester ? 'bg-purple-600' : 'bg-red-800'}`}>
                    {getSemesterName(semesterKey)}
                  </div>
                  <div className="text-muted-foreground">
                    {semesterSubjects.filter(s => approvedSubjects.has(s.id)).length} / {semesterSubjects.length} completadas
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {semesterSubjects.map((subject) => {
                    const isApproved = approvedSubjects.has(subject.id);
                    const isUnlocked = unlockedSubjects.has(subject.id);
                    
                    return (
                      <div
                        key={subject.id}
                        className={`
                          relative rounded-lg p-4 transition-all duration-200 cursor-pointer border-2
                          ${isUnlocked 
                            ? `${getSubjectColor(subject.category)} text-white shadow-md transform hover:scale-105` 
                            : 'bg-muted text-muted-foreground cursor-not-allowed border-border'
                          }
                          ${isApproved ? 'ring-4 ring-green-400' : ''}
                        `}
                        onClick={() => isUnlocked && toggleSubjectApproval(subject.id)}
                      >
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
                          
                          <div className="text-xs opacity-90 mb-2">
                            Categoría: {subject.category}
                          </div>
                          
                          {subject.prerequisites.length > 0 && (
                            <div className="text-xs opacity-90 mt-2">
                              <div className="font-medium mb-1">Requiere:</div>
                              <div className="space-y-0.5">
                                {subject.prerequisites.map(prereqId => {
                                  const prereq = template.subjects.find(s => s.id === prereqId);
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
      </div>
    </div>
  );
};
