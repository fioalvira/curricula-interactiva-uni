import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Plus, Edit, Eye, TrendingUp, BarChart3, GraduationCap, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CurriculumTemplate } from '@/types/curriculum';
import { TemplateCreator } from '@/components/TemplateCreator';
import { SubjectManager } from '@/components/SubjectManager';
import { CurriculumViewer } from '@/components/CurriculumViewer';
import { PerformanceGraphs } from '@/components/PerformanceGraphs';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [templates, setTemplates] = useState<CurriculumTemplate[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'view' | 'performance'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<CurriculumTemplate | null>(null);
  const [approvedSubjects, setApprovedSubjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadUserTemplates();
      loadApprovedSubjects();
    }
  }, [user]);

  useEffect(() => {
    // Reload approved subjects when template changes or when viewing performance
    if (user && selectedTemplate && (currentView === 'performance' || currentView === 'view')) {
      loadApprovedSubjects();
    }
  }, [user, selectedTemplate, currentView]);

  const loadUserTemplates = () => {
    const allTemplates = JSON.parse(localStorage.getItem('curriculum-templates') || '[]');
    const userTemplates = allTemplates.filter((t: CurriculumTemplate) => t.userId === user?.id);
    setTemplates(userTemplates);
  };

  const loadApprovedSubjects = () => {
    if (!selectedTemplate) return;
    
    const approved = JSON.parse(localStorage.getItem(`approved-${selectedTemplate.id}`) || '[]');
    console.log('Loading approved subjects:', approved);
    setApprovedSubjects(new Set(approved));
  };

  const handleTemplateCreated = (template: CurriculumTemplate) => {
    setTemplates([...templates, template]);
    setSelectedTemplate(template);
    setCurrentView('edit');
  };

  const handleTemplateUpdate = (updatedTemplate: CurriculumTemplate) => {
    // Update in localStorage
    const allTemplates = JSON.parse(localStorage.getItem('curriculum-templates') || '[]');
    const updatedTemplates = allTemplates.map((t: CurriculumTemplate) =>
      t.id === updatedTemplate.id ? updatedTemplate : t
    );
    localStorage.setItem('curriculum-templates', JSON.stringify(updatedTemplates));

    // Update local state
    setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    setSelectedTemplate(updatedTemplate);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta plantilla? Esta acción no se puede deshacer.')) {
      const allTemplates = JSON.parse(localStorage.getItem('curriculum-templates') || '[]');
      const updatedTemplates = allTemplates.filter((t: CurriculumTemplate) => t.id !== templateId);
      localStorage.setItem('curriculum-templates', JSON.stringify(updatedTemplates));
      
      // Also remove approved subjects for this template
      localStorage.removeItem(`approved-${templateId}`);
      
      setTemplates(templates.filter(t => t.id !== templateId));
      
      // If we're currently viewing the deleted template, go back to list
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null);
        setCurrentView('list');
      }
    }
  };

  const handleViewPerformance = () => {
    // Force reload approved subjects before switching to performance view
    loadApprovedSubjects();
    setCurrentView('performance');
  };

  const areaColors = {
    programming: '#8B5CF6',
    math: '#3B82F6', 
    systems: '#10B981',
    software: '#F59E0B',
    data: '#EF4444',
    management: '#8B5CF6',
    elective: '#6B7280'
  };

  if (currentView === 'create') {
    return (
      <TemplateCreator 
        onTemplateCreated={handleTemplateCreated} 
        onBack={() => setCurrentView('list')}
      />
    );
  }

  if (currentView === 'edit' && selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="border-b bg-white/80 dark:bg-card/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {selectedTemplate.careerName}
                </h1>
                <p className="text-muted-foreground">{selectedTemplate.facultyName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('view')}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Malla
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('list')}
                  className="transition-all duration-200 hover:scale-105"
                >
                  Volver
                </Button>
              </div>
            </div>
          </div>
        </div>
        <SubjectManager
          template={selectedTemplate}
          onTemplateUpdate={handleTemplateUpdate}
        />
      </div>
    );
  }

  if (currentView === 'view' && selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="border-b bg-white/80 dark:bg-card/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {selectedTemplate.careerName}
                </h1>
                <p className="text-muted-foreground">{selectedTemplate.facultyName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('edit')}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('list')}
                  className="transition-all duration-200 hover:scale-105"
                >
                  Volver
                </Button>
              </div>
            </div>
          </div>
        </div>
        <CurriculumViewer 
          template={selectedTemplate} 
          onViewPerformance={handleViewPerformance}
        />
      </div>
    );
  }

  if (currentView === 'performance' && selectedTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="border-b bg-white/80 dark:bg-card/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Análisis de Rendimiento
                </h1>
                <p className="text-muted-foreground">{selectedTemplate.careerName}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentView('view')}
                className="transition-all duration-200 hover:scale-105"
              >
                Volver a Malla
              </Button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-6">
          <PerformanceGraphs
            subjects={selectedTemplate.subjects}
            approvedSubjects={approvedSubjects}
            areaColors={areaColors}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Mis Mallas Curriculares
                  </h1>
                  <p className="text-muted-foreground">Bienvenido, {user?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button 
                onClick={logout} 
                variant="outline"
                className="transition-all duration-200 hover:scale-105"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {templates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full flex items-center justify-center">
              <GraduationCap className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              ¡Comienza tu viaje académico!
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Crea tu primera plantilla de malla curricular personalizada y organiza tu carrera de manera inteligente
            </p>
            <Button 
              onClick={() => setCurrentView('create')}
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Primera Malla
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Tus Plantillas</h2>
                <p className="text-muted-foreground">
                  Tienes {templates.length} {templates.length === 1 ? 'plantilla' : 'plantillas'} creadas
                </p>
              </div>
              <Button 
                onClick={() => setCurrentView('create')}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Malla
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <Card 
                  key={template.id} 
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-card/80 backdrop-blur-sm hover:scale-105 overflow-hidden"
                >
                  <div className="h-2 bg-gradient-to-r from-primary to-purple-600"></div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {template.careerName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{template.facultyName}</span>
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        {template.country}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{template.totalSemesters}</div>
                        <div className="text-xs text-muted-foreground">Semestres</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{template.subjects.length}</div>
                        <div className="text-xs text-muted-foreground">Materias</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{template.categories.length}</div>
                        <div className="text-xs text-muted-foreground">Categorías</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setCurrentView('view');
                        }}
                        className="flex-1 transition-all duration-200 hover:scale-105"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setCurrentView('edit');
                        }}
                        className="flex-1 transition-all duration-200 hover:scale-105"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
