
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Target } from 'lucide-react';
import { Subject } from '@/types/curriculum';

interface PerformanceGraphsProps {
  subjects: Subject[];
  approvedSubjects: Set<string>;
  areaColors: { [key: string]: string };
}

const COLORS = {
  programming: '#581c87',
  math: '#7c3aed',
  systems: '#9333ea',
  software: '#db2777',
  data: '#f472b6',
  management: '#fbbf24',
  elective: '#8b5cf6'
};

export const PerformanceGraphs: React.FC<PerformanceGraphsProps> = ({ 
  subjects, 
  approvedSubjects, 
  areaColors 
}) => {
  console.log('PerformanceGraphs - subjects:', subjects);
  console.log('PerformanceGraphs - approvedSubjects:', Array.from(approvedSubjects));
  
  // Calcular estadísticas por categoría
  const areaStats = React.useMemo(() => {
    const stats: { [key: string]: { total: number; approved: number; name: string } } = {};
    
    subjects.forEach(subject => {
      // Si no tiene categoría, usar 'general' como default
      const category = subject.category || 'general';
      if (!stats[category]) {
        stats[category] = { total: 0, approved: 0, name: category };
      }
      stats[category].total++;
      if (approvedSubjects.has(subject.id)) {
        stats[category].approved++;
      }
    });

    console.log('Area stats:', stats);

    return Object.entries(stats).map(([area, data]) => ({
      area,
      name: data.name,
      total: data.total,
      approved: data.approved,
      percentage: data.total > 0 ? Math.round((data.approved / data.total) * 100) : 0,
      color: COLORS[area as keyof typeof COLORS] || '#8b5cf6'
    }));
  }, [subjects, approvedSubjects]);

  // Calcular progreso por semestre
  const semesterProgress = React.useMemo(() => {
    const progress: { [key: string]: { total: number; approved: number } } = {};
    
    subjects.forEach(subject => {
      const semesterKey = subject.semester.toString();
      if (!progress[semesterKey]) {
        progress[semesterKey] = { total: 0, approved: 0 };
      }
      progress[semesterKey].total++;
      if (approvedSubjects.has(subject.id)) {
        progress[semesterKey].approved++;
      }
    });

    return Object.entries(progress)
      .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
      .map(([semester, data]) => ({
        semester: semester.includes('.') ? `Mini ${semester}` : `Sem ${semester}`,
        total: data.total,
        approved: data.approved,
        percentage: data.total > 0 ? Math.round((data.approved / data.total) * 100) : 0
      }));
  }, [subjects, approvedSubjects]);

  const totalSubjects = subjects.length;
  const totalApproved = approvedSubjects.size;
  const overallProgress = totalSubjects > 0 ? Math.round((totalApproved / totalSubjects) * 100) : 0;

  console.log('Total subjects:', totalSubjects);
  console.log('Total approved:', totalApproved);
  console.log('Overall progress:', overallProgress);

  return (
    <div className="space-y-8">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow-sm p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-8 h-8 text-yellow-500" />
            <span className="text-lg font-semibold text-card-foreground">Progreso General</span>
          </div>
          <div className="text-4xl font-bold text-primary mb-2">
            {overallProgress}%
          </div>
          <div className="text-muted-foreground">
            {totalApproved} de {totalSubjects} materias
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <span className="text-lg font-semibold text-card-foreground">Mejor Área</span>
          </div>
          <div className="text-2xl font-bold text-primary mb-2">
            {areaStats.length > 0 ? areaStats.reduce((prev, current) => (prev.percentage > current.percentage) ? prev : current).name : 'N/A'}
          </div>
          <div className="text-muted-foreground">
            {areaStats.length > 0 ? areaStats.reduce((prev, current) => (prev.percentage > current.percentage) ? prev : current).percentage : 0}% completado
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-8 h-8 text-blue-500" />
            <span className="text-lg font-semibold text-card-foreground">Próximo Objetivo</span>
          </div>
          <div className="text-2xl font-bold text-primary mb-2">
            {totalSubjects > 0 && Math.ceil(totalSubjects * 0.5) - totalApproved > 0 
              ? `${Math.ceil(totalSubjects * 0.5) - totalApproved} materias`
              : totalSubjects > 0 ? '¡Objetivo 50% alcanzado!' : 'Sin materias'}
          </div>
          <div className="text-muted-foreground">
            Para completar el 50%
          </div>
        </div>
      </div>

      {/* Mostrar mensaje si no hay datos */}
      {totalApproved === 0 && (
        <div className="bg-card rounded-lg shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-card-foreground mb-2">No hay materias aprobadas</h3>
          <p className="text-muted-foreground">
            Marca algunas materias como aprobadas en la vista de la malla curricular para ver tus estadísticas de rendimiento.
          </p>
        </div>
      )}

      {/* Gráfico de barras por área - solo mostrar si hay datos */}
      {areaStats.length > 0 && (
        <div className="bg-card rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-card-foreground mb-6">Progreso por Área de Conocimiento</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                  formatter={(value, name) => [
                    name === 'approved' ? `${value} aprobadas` : `${value} total`,
                    name === 'approved' ? 'Aprobadas' : 'Total'
                  ]}
                />
                <Bar dataKey="total" fill="hsl(var(--muted))" name="total" />
                <Bar dataKey="approved" fill="hsl(var(--primary))" name="approved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Gráfico de pastel y progreso por semestre - solo mostrar si hay datos */}
      {totalApproved > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-card-foreground mb-6">Distribución por Área</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={areaStats.filter(area => area.approved > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, approved }) => `${name}: ${approved}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="approved"
                  >
                    {areaStats.filter(area => area.approved > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--card-foreground))'
                    }}
                    formatter={(value) => [`${value} materias`, 'Aprobadas']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progreso por semestre */}
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-card-foreground mb-6">Progreso por Semestre</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={semesterProgress} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="semester" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--card-foreground))'
                    }}
                    formatter={(value, name) => [
                      `${value} materias`,
                      name === 'approved' ? 'Aprobadas' : 'Total'
                    ]}
                  />
                  <Bar dataKey="total" fill="hsl(var(--muted))" name="total" />
                  <Bar dataKey="approved" fill="hsl(var(--primary))" name="approved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Lista detallada por área - solo mostrar si hay datos */}
      {areaStats.length > 0 && (
        <div className="bg-card rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-card-foreground mb-6">Detalle por Área</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {areaStats.map((area) => (
              <div key={area.area} className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: area.color }}
                  ></div>
                  <h4 className="font-semibold text-card-foreground">{area.name}</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Aprobadas:</span>
                    <span className="font-medium">{area.approved}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">{area.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progreso:</span>
                    <span className="font-medium text-primary">{area.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${area.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
