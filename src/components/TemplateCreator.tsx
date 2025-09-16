import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CurriculumTemplate } from '@/types/curriculum';

interface TemplateCreatorProps {
  onTemplateCreated: (template: CurriculumTemplate) => void;
  onBack: () => void;
}

export const TemplateCreator = ({ onTemplateCreated, onBack }: TemplateCreatorProps) => {
  const { user } = useAuth();
  const [facultyName, setFacultyName] = useState('');
  const [careerName, setCareerName] = useState('');
  const [country, setCountry] = useState('');
  const [totalSemesters, setTotalSemesters] = useState(8);
  const [miniSemesters, setMiniSemesters] = useState('');
  const [colorPalette, setColorPalette] = useState('purpor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const miniSemesterArray = miniSemesters
      .split(',')
      .map(s => s.trim())
      .filter(s => s);

    const newTemplate: CurriculumTemplate = {
      id: Date.now().toString(),
      userId: user.id,
      facultyName,
      careerName,
      country,
      totalSemesters,
      miniSemesters: miniSemesterArray,
      subjects: [],
      categories: [],
      colorPalette,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to localStorage
    const templates = JSON.parse(localStorage.getItem('curriculum-templates') || '[]');
    templates.push(newTemplate);
    localStorage.setItem('curriculum-templates', JSON.stringify(templates));

    onTemplateCreated(newTemplate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold">Crear Plantilla de Malla Curricular</CardTitle>
          <CardDescription>
            Define los parámetros básicos de tu malla curricular
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty">Nombre de la Facultad</Label>
                <Input
                  id="faculty"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  placeholder="Ej: Facultad de Ingeniería"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="career">Nombre de la Carrera</Label>
                <Input
                  id="career"
                  value={careerName}
                  onChange={(e) => setCareerName(e.target.value)}
                  placeholder="Ej: Ingeniería en Sistemas"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Ej: Uruguay"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semesters">Cantidad de Semestres</Label>
                <Input
                  id="semesters"
                  type="number"
                  min="1"
                  max="20"
                  value={totalSemesters}
                  onChange={(e) => setTotalSemesters(parseInt(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mini-semesters">Mini Semestres (opcional)</Label>
              <Input
                id="mini-semesters"
                value={miniSemesters}
                onChange={(e) => setMiniSemesters(e.target.value)}
                placeholder="Ej: 5.5, 7.5 (separados por coma)"
              />
              <p className="text-sm text-muted-foreground">
                Ingresa los números de mini semestres separados por coma (ej: 5.5, 7.5)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color-palette">Paleta de Colores</Label>
              <Select value={colorPalette} onValueChange={setColorPalette}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purpor">PurpOr (Púrpura/Naranja)</SelectItem>
                  <SelectItem value="blues">Azules</SelectItem>
                  <SelectItem value="greens">Verdes</SelectItem>
                  <SelectItem value="warm">Cálidos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Crear Plantilla
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
