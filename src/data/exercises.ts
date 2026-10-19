export type ExerciseType = 'weighted' | 'bodyweight' | 'timed' | 'cardio';
export type MuscleGroup =
  | 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Legs' | 'Glutes' | 'Core' | 'Cardio';
export type Equipment =
  | 'barbell' | 'dumbbell' | 'kettlebell' | 'cable' | 'machine' | 'bodyweight';

export interface Exercise {
  id: string;
  name: string;
  group: MuscleGroup;
  equipment: Equipment;
  type: ExerciseType;
  /** folder name in free-exercise-db, used only by scripts/fetch-images.ts */
  slug: string;
}

export const GROUPS: MuscleGroup[] = [
  'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Glutes', 'Core', 'Cardio',
];

// My Exercises starts empty — the user picks their own from the Library
export const DEFAULT_SELECTED: string[] = [];

export const EXERCISES: Exercise[] = [
  { id: 'bb_bench', name: 'Barbell Bench Press', group: 'Chest', equipment: 'barbell', type: 'weighted', slug: 'Barbell_Bench_Press_-_Medium_Grip' },
  { id: 'bench', name: 'Dumbbell Bench Press', group: 'Chest', equipment: 'dumbbell', type: 'weighted', slug: 'Dumbbell_Bench_Press' },
  { id: 'incline_db', name: 'Incline Dumbbell Press', group: 'Chest', equipment: 'dumbbell', type: 'weighted', slug: 'Incline_Dumbbell_Press' },
  { id: 'incline_bb', name: 'Incline Barbell Press', group: 'Chest', equipment: 'barbell', type: 'weighted', slug: 'Barbell_Incline_Bench_Press_-_Medium_Grip' },
  { id: 'db_fly', name: 'Dumbbell Fly', group: 'Chest', equipment: 'dumbbell', type: 'weighted', slug: 'Dumbbell_Flyes' },
  { id: 'chest_press_m', name: 'Machine Chest Press', group: 'Chest', equipment: 'machine', type: 'weighted', slug: 'Leverage_Chest_Press' },
  { id: 'pec_deck', name: 'Pec Deck', group: 'Chest', equipment: 'machine', type: 'weighted', slug: 'Butterfly' },
  { id: 'cable_fly', name: 'Cable Crossover', group: 'Chest', equipment: 'cable', type: 'weighted', slug: 'Cable_Crossover' },
  { id: 'pushup', name: 'Push-up', group: 'Chest', equipment: 'bodyweight', type: 'bodyweight', slug: 'Pushups' },
  { id: 'chest_dip', name: 'Chest Dip', group: 'Chest', equipment: 'bodyweight', type: 'bodyweight', slug: 'Dips_-_Chest_Version' },
  { id: 'pulldown', name: 'Lat Pulldown', group: 'Back', equipment: 'cable', type: 'weighted', slug: 'Wide-Grip_Lat_Pulldown' },
  { id: 'row', name: 'Seated Cable Row', group: 'Back', equipment: 'cable', type: 'weighted', slug: 'Seated_Cable_Rows' },
  { id: 'pullup', name: 'Pull-up', group: 'Back', equipment: 'bodyweight', type: 'bodyweight', slug: 'Pullups' },
  { id: 'chinup', name: 'Chin-up', group: 'Back', equipment: 'bodyweight', type: 'bodyweight', slug: 'Chin-Up' },
  { id: 'assisted_pullup', name: 'Band-assisted Pull-up', group: 'Back', equipment: 'bodyweight', type: 'bodyweight', slug: 'Band_Assisted_Pull-Up' },
  { id: 'bb_row', name: 'Barbell Bent-over Row', group: 'Back', equipment: 'barbell', type: 'weighted', slug: 'Bent_Over_Barbell_Row' },
  { id: 'db_row', name: 'One-arm Dumbbell Row', group: 'Back', equipment: 'dumbbell', type: 'weighted', slug: 'One-Arm_Dumbbell_Row' },
  { id: 'tbar', name: 'T-Bar Row', group: 'Back', equipment: 'barbell', type: 'weighted', slug: 'T-Bar_Row_with_Handle' },
  { id: 'machine_row', name: 'Machine Row', group: 'Back', equipment: 'machine', type: 'weighted', slug: 'Leverage_Iso_Row' },
  { id: 'deadlift', name: 'Deadlift', group: 'Back', equipment: 'barbell', type: 'weighted', slug: 'Barbell_Deadlift' },
  { id: 'straight_pulldown', name: 'Straight-arm Pulldown', group: 'Back', equipment: 'cable', type: 'weighted', slug: 'Straight-Arm_Pulldown' },
  { id: 'back_ext', name: 'Back Extension', group: 'Back', equipment: 'bodyweight', type: 'bodyweight', slug: 'Hyperextensions_Back_Extensions' },
  { id: 'shrug', name: 'Dumbbell Shrug', group: 'Back', equipment: 'dumbbell', type: 'weighted', slug: 'Dumbbell_Shrug' },
  { id: 'ohp', name: 'Seated Dumbbell Shoulder Press', group: 'Shoulders', equipment: 'dumbbell', type: 'weighted', slug: 'Seated_Dumbbell_Press' },
  { id: 'bb_ohp', name: 'Barbell Overhead Press', group: 'Shoulders', equipment: 'barbell', type: 'weighted', slug: 'Standing_Military_Press' },
  { id: 'arnold', name: 'Arnold Press', group: 'Shoulders', equipment: 'dumbbell', type: 'weighted', slug: 'Arnold_Dumbbell_Press' },
  { id: 'shoulder_press_m', name: 'Machine Shoulder Press', group: 'Shoulders', equipment: 'machine', type: 'weighted', slug: 'Leverage_Shoulder_Press' },
  { id: 'lat_raise', name: 'Dumbbell Lateral Raise', group: 'Shoulders', equipment: 'dumbbell', type: 'weighted', slug: 'Side_Lateral_Raise' },
  { id: 'cable_lat_raise', name: 'Cable Lateral Raise', group: 'Shoulders', equipment: 'cable', type: 'weighted', slug: 'Cable_Seated_Lateral_Raise' },
  { id: 'front_raise', name: 'Front Raise', group: 'Shoulders', equipment: 'dumbbell', type: 'weighted', slug: 'Front_Dumbbell_Raise' },
  { id: 'rear_fly', name: 'Rear Delt Fly', group: 'Shoulders', equipment: 'dumbbell', type: 'weighted', slug: 'Reverse_Flyes' },
  { id: 'face_pull', name: 'Face Pull', group: 'Shoulders', equipment: 'cable', type: 'weighted', slug: 'Face_Pull' },
  { id: 'upright_row', name: 'Upright Row', group: 'Shoulders', equipment: 'barbell', type: 'weighted', slug: 'Upright_Barbell_Row' },
  { id: 'db_curl', name: 'Dumbbell Curl', group: 'Arms', equipment: 'dumbbell', type: 'weighted', slug: 'Dumbbell_Bicep_Curl' },
  { id: 'bb_curl', name: 'Barbell Curl', group: 'Arms', equipment: 'barbell', type: 'weighted', slug: 'Barbell_Curl' },
  { id: 'hammer', name: 'Hammer Curl', group: 'Arms', equipment: 'dumbbell', type: 'weighted', slug: 'Hammer_Curls' },
  { id: 'preacher', name: 'Preacher Curl', group: 'Arms', equipment: 'barbell', type: 'weighted', slug: 'Preacher_Curl' },
  { id: 'cable_curl', name: 'Cable Curl', group: 'Arms', equipment: 'cable', type: 'weighted', slug: 'Standing_Biceps_Cable_Curl' },
  { id: 'pushdown', name: 'Triceps Pushdown', group: 'Arms', equipment: 'cable', type: 'weighted', slug: 'Triceps_Pushdown' },
  { id: 'skull', name: 'Skull Crusher', group: 'Arms', equipment: 'barbell', type: 'weighted', slug: 'EZ-Bar_Skullcrusher' },
  { id: 'oh_ext', name: 'Overhead Triceps Extension', group: 'Arms', equipment: 'dumbbell', type: 'weighted', slug: 'Overhead_Triceps' },
  { id: 'close_bench', name: 'Close-grip Bench Press', group: 'Arms', equipment: 'barbell', type: 'weighted', slug: 'Close-Grip_Barbell_Bench_Press' },
  { id: 'bench_dip', name: 'Bench Dip', group: 'Arms', equipment: 'bodyweight', type: 'bodyweight', slug: 'Bench_Dips' },
  { id: 'squat', name: 'Barbell Squat', group: 'Legs', equipment: 'barbell', type: 'weighted', slug: 'Barbell_Squat' },
  { id: 'front_squat', name: 'Front Squat', group: 'Legs', equipment: 'barbell', type: 'weighted', slug: 'Front_Barbell_Squat' },
  { id: 'goblet', name: 'Goblet Squat', group: 'Legs', equipment: 'dumbbell', type: 'weighted', slug: 'Goblet_Squat' },
  { id: 'hack', name: 'Hack Squat', group: 'Legs', equipment: 'machine', type: 'weighted', slug: 'Hack_Squat' },
  { id: 'smith_squat', name: 'Smith Machine Squat', group: 'Legs', equipment: 'barbell', type: 'weighted', slug: 'Smith_Machine_Squat' },
  { id: 'leg_press', name: 'Leg Press', group: 'Legs', equipment: 'machine', type: 'weighted', slug: 'Leg_Press' },
  { id: 'lunge', name: 'Walking Lunge', group: 'Legs', equipment: 'dumbbell', type: 'weighted', slug: 'Dumbbell_Lunges' },
  { id: 'bulgarian', name: 'Bulgarian Split Squat', group: 'Legs', equipment: 'dumbbell', type: 'weighted', slug: 'Split_Squat_with_Dumbbells' },
  { id: 'step_up', name: 'Step-up', group: 'Legs', equipment: 'dumbbell', type: 'weighted', slug: 'Dumbbell_Step_Ups' },
  { id: 'leg_ext', name: 'Leg Extension', group: 'Legs', equipment: 'machine', type: 'weighted', slug: 'Leg_Extensions' },
  { id: 'leg_curl', name: 'Lying Leg Curl', group: 'Legs', equipment: 'machine', type: 'weighted', slug: 'Lying_Leg_Curls' },
  { id: 'rdl', name: 'Romanian Deadlift', group: 'Legs', equipment: 'barbell', type: 'weighted', slug: 'Romanian_Deadlift' },
  { id: 'calf', name: 'Standing Calf Raise', group: 'Legs', equipment: 'dumbbell', type: 'weighted', slug: 'Standing_Dumbbell_Calf_Raise' },
  { id: 'bw_squat', name: 'Bodyweight Squat', group: 'Legs', equipment: 'bodyweight', type: 'bodyweight', slug: 'Bodyweight_Squat' },
  { id: 'hip_thrust', name: 'Barbell Hip Thrust', group: 'Glutes', equipment: 'barbell', type: 'weighted', slug: 'Barbell_Hip_Thrust' },
  { id: 'glute_bridge', name: 'Glute Bridge', group: 'Glutes', equipment: 'bodyweight', type: 'bodyweight', slug: 'Butt_Lift_Bridge' },
  { id: 'kickback', name: 'Cable Glute Kickback', group: 'Glutes', equipment: 'cable', type: 'weighted', slug: 'One-Legged_Cable_Kickback' },
  { id: 'abductor', name: 'Hip Abduction Machine', group: 'Glutes', equipment: 'machine', type: 'weighted', slug: 'Thigh_Abductor' },
  { id: 'kb_swing', name: 'Kettlebell Swing', group: 'Glutes', equipment: 'kettlebell', type: 'weighted', slug: 'One-Arm_Kettlebell_Swings' },
  { id: 'plank', name: 'Plank', group: 'Core', equipment: 'bodyweight', type: 'timed', slug: 'Plank' },
  { id: 'crunch', name: 'Crunch', group: 'Core', equipment: 'bodyweight', type: 'bodyweight', slug: 'Crunches' },
  { id: 'leg_raise', name: 'Lying Leg Raise', group: 'Core', equipment: 'bodyweight', type: 'bodyweight', slug: 'Flat_Bench_Lying_Leg_Raise' },
  { id: 'hanging_raise', name: 'Hanging Leg Raise', group: 'Core', equipment: 'bodyweight', type: 'bodyweight', slug: 'Hanging_Leg_Raise' },
  { id: 'russian', name: 'Russian Twist', group: 'Core', equipment: 'bodyweight', type: 'bodyweight', slug: 'Russian_Twist' },
  { id: 'cable_crunch', name: 'Cable Crunch', group: 'Core', equipment: 'cable', type: 'weighted', slug: 'Cable_Crunch' },
  { id: 'ab_wheel', name: 'Ab Wheel Rollout', group: 'Core', equipment: 'bodyweight', type: 'bodyweight', slug: 'Ab_Roller' },
  { id: 'mountain', name: 'Mountain Climbers', group: 'Core', equipment: 'bodyweight', type: 'timed', slug: 'Mountain_Climbers' },
  { id: 'jump_rope', name: 'Jump Rope', group: 'Cardio', equipment: 'bodyweight', type: 'cardio', slug: 'Rope_Jumping' },
  { id: 'treadmill', name: 'Treadmill Run', group: 'Cardio', equipment: 'machine', type: 'cardio', slug: 'Running_Treadmill' },
  { id: 'bike', name: 'Stationary Bike', group: 'Cardio', equipment: 'machine', type: 'cardio', slug: 'Bicycling_Stationary' },
  { id: 'rower', name: 'Rowing Machine', group: 'Cardio', equipment: 'machine', type: 'cardio', slug: 'Rowing_Stationary' },
];

export const exerciseById = new Map(EXERCISES.map((e) => [e.id, e]));
