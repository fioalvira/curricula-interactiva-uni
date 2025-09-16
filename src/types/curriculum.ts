
export interface Subject {
  id: string;
  name: string;
  category: string;
  prerequisites: string[];
  semester: number | string; // Can be number or string like "5.5" for mini-semesters
}

export interface CurriculumTemplate {
  id: string;
  userId: string;
  facultyName: string;
  careerName: string;
  country: string;
  totalSemesters: number;
  miniSemesters: string[]; // Array of mini-semester identifiers like ["5.5", "7.5"]
  subjects: Subject[];
  categories: string[];
  colorPalette: string;
  createdAt: string;
  updatedAt: string;
}

export interface ColorPalette {
  name: string;
  colors: { [key: string]: string };
}
