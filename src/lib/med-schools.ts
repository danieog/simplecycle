export interface MedSchoolReference {
  name: string;
  city: string | null;
  state: string | null;
  mcatMedian: number | null;
  gpaMedian: number | null;
  inStateCost: number | null;
  outStateCost: number | null;
  comboDegrees: string[];
  firstYearClassSize: number | null;
}

// Sourced from src/data/med_school_data.csv. Only 31 rows, so kept inline
// rather than parsed at runtime.
export const MED_SCHOOLS: MedSchoolReference[] = [
  { name: "Meharry Medical College", city: "Nashville", state: "TN", mcatMedian: 506, gpaMedian: 3.64, inStateCost: 59250, outStateCost: 59250, comboDegrees: ["md/phd", "md/mph"], firstYearClassSize: 115 },
  { name: "Howard University", city: "Washington", state: "DC", mcatMedian: 507, gpaMedian: 3.73, inStateCost: 60924, outStateCost: 60924, comboDegrees: ["bs/md", "md/phd", "md/mba"], firstYearClassSize: 128 },
  { name: "Morehouse School of Medicine", city: "Atlanta", state: "GA", mcatMedian: 508, gpaMedian: 3.77, inStateCost: 57238, outStateCost: 57238, comboDegrees: ["md/mba", "md/phd", "md/mph"], firstYearClassSize: 110 },
  { name: "Rush Medical College of Rush Univeristy Medical Center", city: "Chicago", state: "IL", mcatMedian: 510, gpaMedian: 3.8, inStateCost: 59222, outStateCost: 59222, comboDegrees: [], firstYearClassSize: 144 },
  { name: "Wake Forest University School of Medicine", city: null, state: "NC", mcatMedian: 512, gpaMedian: 3.87, inStateCost: 66895, outStateCost: 66895, comboDegrees: [], firstYearClassSize: 194 },
  { name: "State University of New York Upstate Medical University - Alan Norton College of Medicine", city: "Syracuse", state: "NY", mcatMedian: 512, gpaMedian: 3.84, inStateCost: 48071, outStateCost: 72791, comboDegrees: ["md/mph", "md/mba", "md/phd", "bs/md", "three_yr_md"], firstYearClassSize: 182 },
  { name: "Drexel University - College of Medicine", city: "Philadelphia", state: "PA", mcatMedian: 512, gpaMedian: 3.84, inStateCost: 76245, outStateCost: 76245, comboDegrees: ["md/mba", "md/mph", "bs/md", "md/phd"], firstYearClassSize: 305 },
  { name: "Belmont University - Thomas F. Frist Jr. College of Medicine", city: "Nashville", state: "TN", mcatMedian: 512, gpaMedian: 3.84, inStateCost: 69602, outStateCost: 69602, comboDegrees: [], firstYearClassSize: 54 },
  { name: "Loyola University Chicago - Stritch School of Medicine", city: "Maywood", state: "IL", mcatMedian: 513, gpaMedian: 3.87, inStateCost: 72844, outStateCost: 72844, comboDegrees: ["md/mph"], firstYearClassSize: 175 },
  { name: "Albany Medical College", city: "Albany", state: "NY", mcatMedian: 513, gpaMedian: 3.87, inStateCost: 60051, outStateCost: 60051, comboDegrees: ["md/phd", "bs/md", "md/mph", "md/mba"], firstYearClassSize: 141 },
  { name: "Penn State University - College of Medicine", city: "Hershey", state: "PA", mcatMedian: 513, gpaMedian: 3.88, inStateCost: 61354, outStateCost: 68558, comboDegrees: ["md/mba", "md/phd", "md/mph", "three_yr_md"], firstYearClassSize: 150 },
  { name: "Texas Christian University - Anne Burnett Marion School of Medicine", city: "Fort Worth", state: "TX", mcatMedian: 513, gpaMedian: 3.88, inStateCost: 72270, outStateCost: 72270, comboDegrees: ["md/phd", "md/mph"], firstYearClassSize: 60 },
  { name: "Old Dominion University - Macon & Joan Brock Virginia Health Sciences Eastern Virginia Medical School", city: "Norfolk", state: "VA", mcatMedian: 513, gpaMedian: 3.82, inStateCost: 40302, outStateCost: 62628, comboDegrees: ["three_yr_md"], firstYearClassSize: 151 },
  { name: "Virgnia Tech - Carilion School of Medicine", city: "Roanoke", state: "VA", mcatMedian: 513, gpaMedian: 3.82, inStateCost: 63779, outStateCost: 63779, comboDegrees: ["md/mph", "md/mba", "md/phd"], firstYearClassSize: 55 },
  { name: "University of Vermont - Robert Larner, M.D., College of Medicine", city: "Burlington", state: "VT", mcatMedian: 513, gpaMedian: 3.8, inStateCost: 41736, outStateCost: 72402, comboDegrees: [], firstYearClassSize: 122 },
  { name: "University of Maryland, Baltimore - School of Medicine", city: "Baltimore", state: "MD", mcatMedian: 514, gpaMedian: 3.9, inStateCost: 46015, outStateCost: 78339, comboDegrees: ["bs/md", "md/mba", "md/mpp", "md/mph", "md/mphd"], firstYearClassSize: 171 },
  { name: "Rutgers New Jersey Medical School", city: null, state: "NJ", mcatMedian: 514, gpaMedian: 3.89, inStateCost: 49708, outStateCost: 78184, comboDegrees: ["md/mph", "md/mba", "bs/md", "md/phd", "three_yr_md"], firstYearClassSize: 174 },
  { name: "Thomas Jefferson University - Sidney Kimmel Medical College", city: "Philadelphia", state: "PA", mcatMedian: 514, gpaMedian: 3.89, inStateCost: 70292, outStateCost: 70292, comboDegrees: ["md/phd", "md/mph", "bs/md"], firstYearClassSize: null },
  { name: "Virginia Commonwealth University - School of Medicine", city: "Richmond", state: "VA", mcatMedian: 514, gpaMedian: 3.9, inStateCost: 41660, outStateCost: 67318, comboDegrees: ["md/mph", "bs/md", "md/phd"], firstYearClassSize: 184 },
  { name: "University of California, San Francisco (UCSF) - School of Medicine", city: "San Francisco", state: "CA", mcatMedian: 517, gpaMedian: 3.93, inStateCost: 42540, outStateCost: 54785, comboDegrees: ["bs/md", "md/phd"], firstYearClassSize: 177 },
  { name: "Albert Einstein College of Medicine", city: "Bronx", state: "NY", mcatMedian: 519, gpaMedian: 3.93, inStateCost: 77232, outStateCost: 77232, comboDegrees: ["md/phd", "md/mph"], firstYearClassSize: 148 },
  { name: "Stanford University - School of Medicine", city: "Stanford", state: "CA", mcatMedian: 520, gpaMedian: 3.96, inStateCost: 70915, outStateCost: 70915, comboDegrees: ["md/jd", "md/mph", "md/mba", "md/phd"], firstYearClassSize: 90 },
  { name: "Duke University - School of Medicine", city: "Durham", state: "NC", mcatMedian: 520, gpaMedian: 3.95, inStateCost: 74690, outStateCost: 74690, comboDegrees: ["md/mba", "md/mpp", "md/phd", "md/jd", "md/mph"], firstYearClassSize: 123 },
  { name: "Harvard Medical School", city: "Boston", state: "MA", mcatMedian: 521, gpaMedian: 3.98, inStateCost: 76421, outStateCost: 76421, comboDegrees: ["md/mpp", "md/mba", "md/mphd", "md/mph"], firstYearClassSize: 165 },
  { name: "Washington University in St. Louis - School of Medicine", city: "Saint Louis", state: "MO", mcatMedian: 521, gpaMedian: 3.96, inStateCost: 69468, outStateCost: 69468, comboDegrees: ["md/phd", "md/mph", "md/mba"], firstYearClassSize: 123 },
  { name: "Johns Hopkins University - School of Medicine", city: "Baltimore", state: "MD", mcatMedian: 522, gpaMedian: 3.97, inStateCost: 68878, outStateCost: 68878, comboDegrees: ["md/mba", "md/phd"], firstYearClassSize: 118 },
  { name: "Columbia University - Vagelos College of Physicians and Surgeons", city: "New York", state: "NY", mcatMedian: 522, gpaMedian: 3.97, inStateCost: 77585, outStateCost: 77585, comboDegrees: ["md/mph", "three_yr_md"], firstYearClassSize: 138 },
  { name: "University of Pennsylvania - Perelman School of Medicine", city: "Philadelphia", state: "PA", mcatMedian: 522, gpaMedian: 3.98, inStateCost: 77491, outStateCost: 77491, comboDegrees: ["md/mba", "md/jd", "md/mph", "md/phd"], firstYearClassSize: 153 },
  { name: "Vanderbilt University - School of Medicine", city: "Nashville", state: "TN", mcatMedian: 522, gpaMedian: 3.97, inStateCost: 72803, outStateCost: 72803, comboDegrees: ["md/phd", "md/mph", "md/mba", "md/jd"], firstYearClassSize: 95 },
  { name: "New York University (NYU) - Grossman School of Medicine", city: "New York", state: "NY", mcatMedian: 523, gpaMedian: 3.99, inStateCost: 4350, outStateCost: 4350, comboDegrees: ["md/mba", "md/mph", "three_yr_md"], firstYearClassSize: 99 },
];

/**
 * Composite selectivity score: higher MCAT/GPA medians and smaller class
 * sizes both indicate a more competitive school. Normalized 0-1 per factor
 * and averaged so no single stat dominates the ranking.
 */
function selectivityScore(school: MedSchoolReference): number | null {
  if (school.mcatMedian == null || school.gpaMedian == null) return null;

  const mcatValues = MED_SCHOOLS.map((s) => s.mcatMedian).filter((v): v is number => v != null);
  const gpaValues = MED_SCHOOLS.map((s) => s.gpaMedian).filter((v): v is number => v != null);
  const classSizes = MED_SCHOOLS.map((s) => s.firstYearClassSize).filter(
    (v): v is number => v != null
  );

  const normalize = (value: number, values: number[]) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return max === min ? 0.5 : (value - min) / (max - min);
  };

  const mcatScore = normalize(school.mcatMedian, mcatValues);
  const gpaScore = normalize(school.gpaMedian, gpaValues);

  let classScore = 0.5;
  if (school.firstYearClassSize != null && classSizes.length > 0) {
    // Invert: smaller class size => higher selectivity score.
    classScore = 1 - normalize(school.firstYearClassSize, classSizes);
  }

  return (mcatScore + gpaScore + classScore) / 3;
}

/**
 * Ranks every school in the dataset by selectivity (1 = most competitive)
 * using MCAT/GPA medians and class size. Schools lacking MCAT or GPA data
 * are excluded and left for the caller to backfill from other sources.
 */
export function rankMedSchoolsBySelectivity(): Map<string, number> {
  const scored = MED_SCHOOLS.map((school) => ({
    name: school.name,
    score: selectivityScore(school),
  })).filter((s): s is { name: string; score: number } => s.score != null);

  scored.sort((a, b) => b.score - a.score);

  const ranks = new Map<string, number>();
  scored.forEach((s, i) => ranks.set(s.name, i + 1));
  return ranks;
}

// Common abbreviations/nicknames mapped to their exact MED_SCHOOLS name, so
// search matches shorthand a user is likely to type instead of the full
// official name.
const SCHOOL_ALIASES: Record<string, string> = {
  ucsf: "University of California, San Francisco (UCSF) - School of Medicine",
  nyu: "New York University (NYU) - Grossman School of Medicine",
  penn: "University of Pennsylvania - Perelman School of Medicine",
  upenn: "University of Pennsylvania - Perelman School of Medicine",
  perelman: "University of Pennsylvania - Perelman School of Medicine",
  hopkins: "Johns Hopkins University - School of Medicine",
  jhu: "Johns Hopkins University - School of Medicine",
  wustl: "Washington University in St. Louis - School of Medicine",
  "wash u": "Washington University in St. Louis - School of Medicine",
  vandy: "Vanderbilt University - School of Medicine",
  vanderbilt: "Vanderbilt University - School of Medicine",
  columbia: "Columbia University - Vagelos College of Physicians and Surgeons",
  vagelos: "Columbia University - Vagelos College of Physicians and Surgeons",
  einstein: "Albert Einstein College of Medicine",
  drexel: "Drexel University - College of Medicine",
  jefferson: "Thomas Jefferson University - Sidney Kimmel Medical College",
  "sidney kimmel": "Thomas Jefferson University - Sidney Kimmel Medical College",
  rutgers: "Rutgers New Jersey Medical School",
  njms: "Rutgers New Jersey Medical School",
  vcu: "Virginia Commonwealth University - School of Medicine",
  evms: "Old Dominion University - Macon & Joan Brock Virginia Health Sciences Eastern Virginia Medical School",
  vtc: "Virgnia Tech - Carilion School of Medicine",
  "virginia tech": "Virgnia Tech - Carilion School of Medicine",
  upstate: "State University of New York Upstate Medical University - Alan Norton College of Medicine",
  "suny upstate": "State University of New York Upstate Medical University - Alan Norton College of Medicine",
  stritch: "Loyola University Chicago - Stritch School of Medicine",
  loyola: "Loyola University Chicago - Stritch School of Medicine",
  "penn state": "Penn State University - College of Medicine",
  hershey: "Penn State University - College of Medicine",
  tcu: "Texas Christian University - Anne Burnett Marion School of Medicine",
  rush: "Rush Medical College of Rush Univeristy Medical Center",
  meharry: "Meharry Medical College",
  howard: "Howard University",
  morehouse: "Morehouse School of Medicine",
  belmont: "Belmont University - Thomas F. Frist Jr. College of Medicine",
  frist: "Belmont University - Thomas F. Frist Jr. College of Medicine",
  albany: "Albany Medical College",
  uvm: "University of Vermont - Robert Larner, M.D., College of Medicine",
  larner: "University of Vermont - Robert Larner, M.D., College of Medicine",
  umd: "University of Maryland, Baltimore - School of Medicine",
  maryland: "University of Maryland, Baltimore - School of Medicine",
  stanford: "Stanford University - School of Medicine",
  duke: "Duke University - School of Medicine",
  harvard: "Harvard Medical School",
  hms: "Harvard Medical School",
};

export function findMedSchool(name: string): MedSchoolReference | undefined {
  const normalized = name.trim().toLowerCase();
  const aliasTarget = SCHOOL_ALIASES[normalized];
  if (aliasTarget) {
    return MED_SCHOOLS.find((s) => s.name === aliasTarget);
  }
  return MED_SCHOOLS.find((s) => s.name.toLowerCase() === normalized);
}

export function searchMedSchools(query: string, limit = 8): MedSchoolReference[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const matches: MedSchoolReference[] = [];
  const seen = new Set<string>();

  const addMatch = (school: MedSchoolReference | undefined) => {
    if (school && !seen.has(school.name)) {
      seen.add(school.name);
      matches.push(school);
    }
  };

  for (const [alias, targetName] of Object.entries(SCHOOL_ALIASES)) {
    if (alias.includes(normalized)) {
      addMatch(MED_SCHOOLS.find((s) => s.name === targetName));
    }
  }

  for (const school of MED_SCHOOLS) {
    if (school.name.toLowerCase().includes(normalized)) {
      addMatch(school);
    }
  }

  return matches.slice(0, limit);
}
