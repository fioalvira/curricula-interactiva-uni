
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import { CurriculumTemplate, Subject } from '@/types/curriculum';

interface SubjectManagerProps {
  template: CurriculumTemplate;
  onTemplateUpdate: (template: CurriculumTemplate) => void;
}

export const SubjectManager = ({ template, onTemplateUpdate }: SubjectManagerProps) => {
  const [subjectName, setSubjectName] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [selectedPrerequisites, setSelectedPrerequisites] = useState<string[]>([]);

  const availableSemesters = [
    ...Array.from({ length: template.totalSemesters }, (_, i) => (i + 1).toString()),
    ...template.miniSemesters
  ].sort((a, b) => parseFloat(a) - parseFloat(b));

  const handleAddSubject = () => {
    if (!subjectName || !selectedSemester) return;

    const category = newCategory || selectedCategory;
    if (!category) return;

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: subjectName,
      category,
      semester: selectedSemester,
      prerequisites: selectedPrerequisites,
    };

    const updatedTemplate = {
      ...template,
      subjects: [...template.subjects, newSubject],
      categories: template.categories.includes(category) 
        ? template.categories 
        : [...template.categories, category],
      updatedAt: new Date().toISOString(),
    };

    onTemplateUpdate(updatedTemplate);

    // Reset form
    setSubjectName('');
    setSelectedSemester('');
    setSelectedCategory('');
    setNewCategory('');
    setSelectedPrerequisites([]);
  };

  const handleDeleteSubject = (subjectId: string) => {
    const updatedTemplate = {
      ...template,
      subjects: template.subjects.filter(s => s.id !== subjectId),
      updatedAt: new Date().toISOString(),
    };

    onTemplateUpdate(updatedTemplate);
  };

  const togglePrerequisite = (prereqId: string) => {
    setSelectedPrerequisites(prev =>
      prev.includes(prereqId)
        ? prev.filter(id => id !== prereqId)
        : [...prev, prereqId]
    );
  };

  const getSemesterName = (semester: string | number) => {
    const semesterStr = semester.toString();
    if (semesterStr.includes('.')) {
      return `Mini Semestre ${semesterStr}`;
    }
    return `Semestre ${semesterStr}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Subject Form */}
        <Card>
          <CardHeader>
            <CardTitle>Agregar Materia</CardTitle>
            <CardDescription>
              Completa la información de la nueva materia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject-name">Nombre de la Materia</Label>
              <Input
                id="subject-name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Ej: Programación 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semestre</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un semestre" />
                </SelectTrigger>
                <SelectContent>
                  {availableSemesters.map(semester => (
                    <SelectItem key={semester} value={semester}>
                      {getSemesterName(semester)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoría</Label>
              {template.categories.length > 0 && (
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría existente" />
                  </SelectTrigger>
                  <SelectContent>
                    {template.categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div className="flex items-center space-x-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="O crea una nueva categoría"
                />
              </div>
            </div>

            {template.subjects.length > 0 && (
              <div className="space-y-2">
                <Label>Materias Previas</Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {template.subjects.map(subject => (
                    <div key={subject.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`prereq-${subject.id}`}
                        checked={selectedPrerequisites.includes(subject.id)}
                        onChange={() => togglePrerequisite(subject.id)}
                        className="h-4 w-4"
                      />
                      <label htmlFor={`prereq-${subject.id}`} className="text-sm">
                        {subject.name} ({getSemesterName(subject.semester)})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={handleAddSubject}
              className="w-full"
              disabled={!subjectName || !selectedSemester || (!selectedCategory && !newCategory)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Materia
            </Button>
          </CardContent>
        </Card>

        {/* Subjects List */}
        <Card>
          <CardHeader>
            <CardTitle>Materias Agregadas ({template.subjects.length})</CardTitle>
            <CardDescription>
              Lista de todas las materias en tu malla curricular
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {template.subjects.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No hay materias agregadas aún
                </p>
              ) : (
                template.subjects.map(subject => (
                  <div key={subject.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{subject.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {getSemesterName(subject.semester)}
                      </Badge>
                      <Badge variant="outline">
                        {subject.category}
                      </Badge>
                    </div>
                    {subject.prerequisites.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Previas: </span>
                        {subject.prerequisites.map(prereqId => {
                          const prereq = template.subjects.find(s => s.id === prereqId);
                          return prereq?.name;
                        }).join(', ')}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
