# Currícula universitaria interactiva

Web app para planificar estudios: tildás materias completadas y se desbloquean automáticamente las correlativas/prerrequisitos. Funciona como **plantilla flexible**: podés definir cualquier carrera, país, facultad, cantidad de semestres y materias; elegir gamas de colores; y cargar previas.


## Stack
- Next.js / React
- (Opcional) Supabase para persistencia en la nube
- TailwindCSS

## Funcionalidades
- Tildar materias y desbloqueo dinámico de correlativas
- Configuración de **carrera/plan** (semestres, materias, previas)
- Tema de color personalizable
- Persistencia local (localStorage); opcional en Supabase

## Ejecución local
bash
npm install
npm run dev
# abrir http://localhost:3000
