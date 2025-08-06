// Browser-compatible stretching database API

class StretchingDatabase {
    constructor() {
        // We'll import the data directly
        this.data = {
            "stretching_exercises": [
                {
                    "exercise_id": "52a8744f-dd92-4af1-af69-a8a3fe78ca2e",
                    "name": "Standing Hamstring Stretch",
                    "description": "Stand tall with one heel on a slightly elevated surface (like a step or low bench). Keep your leg straight but not locked. Hinge forward at your hips, keeping your back straight, until you feel a stretch in the back of your thigh. Hold for the recommended duration.",
                    "type": "Static",
                    "primary_muscle_groups": [
                        "Hamstrings"
                    ],
                    "secondary_muscle_groups": [
                        "Glutes",
                        "Calves"
                    ],
                    "purpose": [
                        "Flexibility",
                        "Cool-down"
                    ],
                    "equipment_needed": true,
                    "equipment_details": [
                        "Elevated Surface (step, low bench)"
                    ],
                    "difficulty_level": "Beginner",
                    "duration_seconds": 30,
                    "repetitions": 1,
                    "sets": 2,
                    "video_url": null,
                    "image_urls": [],
                    "cautions": "Avoid rounding your back. Do not lock your knee."
                },
                {
                    "exercise_id": "8f70f4ad-7e1c-4a64-9742-07b1ffe2adab",
                    "name": "Quad Stretch (Standing)",
                    "description": "Stand tall and hold onto a wall or chair for balance if needed. Grab your right ankle with your right hand and gently pull your heel towards your glutes. Keep your knees close together and your torso upright. Feel the stretch in the front of your thigh. Hold for the recommended duration, then switch legs.",
                    "type": "Static",
                    "primary_muscle_groups": [
                        "Quadriceps"
                    ],
                    "secondary_muscle_groups": [
                        "Hip Flexors"
                    ],
                    "purpose": [
                        "Flexibility",
                        "Cool-down"
                    ],
                    "equipment_needed": false,
                    "difficulty_level": "Beginner",
                    "duration_seconds": 30,
                    "repetitions": 1,
                    "sets": 2,
                    "video_url": null,
                    "image_urls": [],
                    "cautions": "Do not arch your back excessively. Keep knees aligned."
                },
                {
                    "exercise_id": "fd15a883-314f-4c86-aa43-3088c1a2744c",
                    "name": "Calf Stretch (Wall)",
                    "description": "Stand facing a wall, about arm's length away. Place your hands on the wall at shoulder height. Step one foot back, keeping both heels on the ground and your back leg straight. Lean into the wall, feeling the stretch in your calf. Hold for the recommended duration, then switch legs.",
                    "type": "Static",
                    "primary_muscle_groups": [
                        "Calves"
                    ],
                    "secondary_muscle_groups": [],
                    "purpose": [
                        "Flexibility",
                        "Cool-down"
                    ],
                    "equipment_needed": true,
                    "equipment_details": [
                        "Wall"
                    ],
                    "difficulty_level": "Beginner",
                    "duration_seconds": 30,
                    "repetitions": 1,
                    "sets": 2,
                    "video_url": null,
                    "image_urls": [],
                    "cautions": "Keep your back heel on the ground throughout the stretch."
                },
                {
                    "exercise_id": "a4c6d7f9-8f38-470b-95da-eb648a9013aa",
                    "name": "Triceps Stretch (Overhead)",
                    "description": "Stand or sit tall. Raise one arm overhead, then bend your elbow, letting your hand drop behind your head towards your opposite shoulder blade. Use your other hand to gently push down on the elbow of the stretching arm, deepening the stretch. Hold for the recommended duration, then switch arms.",
                    "type": "Static",
                    "primary_muscle_groups": [
                        "Triceps"
                    ],
                    "secondary_muscle_groups": [
                        "Shoulders"
                    ],
                    "purpose": [
                        "Flexibility",
                        "Cool-down"
                    ],
                    "equipment_needed": false,
                    "difficulty_level": "Beginner",
                    "duration_seconds": 30,
                    "repetitions": 1,
                    "sets": 2,
                    "video_url": null,
                    "image_urls": [],
                    "cautions": "Avoid pulling too hard on your elbow. Keep your neck relaxed."
                },
                {
                    "exercise_id": "7fa1ae59-4b5c-4d2d-b810-73add9a688fc",
                    "name": "Shoulder Rolls (Dynamic)",
                    "description": "Stand tall with arms relaxed at your sides. Slowly roll your shoulders forward in a circular motion for several repetitions, then reverse the direction and roll them backward. Focus on smooth, controlled movements.",
                    "type": "Dynamic",
                    "primary_muscle_groups": [
                        "Shoulders"
                    ],
                    "secondary_muscle_groups": [
                        "Upper Back"
                    ],
                    "purpose": [
                        "Warm-up"
                    ],
                    "equipment_needed": false,
                    "difficulty_level": "Beginner",
                    "duration_seconds": null,
                    "repetitions": 10,
                    "sets": 1,
                    "video_url": null,
                    "image_urls": [],
                    "cautions": "Perform slowly and controlled, avoid jerky movements."
                },
                {
                    "exercise_id": "7cdad1e2-695e-4818-88dc-f47c410be568",
                    "name": "Leg Swings (Forward/Backward)",
                    "description": "Stand tall, holding onto a wall or sturdy object for balance. Swing one leg forward and backward in a controlled motion, gradually increasing the height of the swing. Keep your core engaged and avoid arching your back. Perform for recommended repetitions, then switch legs.",
                    "type": "Dynamic",
                    "primary_muscle_groups": [
                        "Hamstrings",
                        "Quadriceps",
                        "Hip Flexors"
                    ],
                    "secondary_muscle_groups": [
                        "Glutes"
                    ],
                    "purpose": [
                        "Warm-up"
                    ],
                    "equipment_needed": false,
                    "difficulty_level": "Intermediate",
                    "duration_seconds": null,
                    "repetitions": 10,
                    "sets": 1,
                    "video_url": null,
                    "image_urls": [],
                    "cautions": "Maintain control throughout the movement. Do not force the range of motion."
                },
                {
                    "exercise_id": "bf563c7b-950f-4337-a5c6-6a5f701142fd",
                    "name": "Cat-Cow Stretch",
                    "description": "Start on your hands and knees in a tabletop position. Inhale as you drop your belly towards the mat, lifting your chin and chest to look up (Cow). Exhale as you round your spine towards the ceiling, tucking your chin to your chest (Cat). Repeat for the recommended repetitions.",
                    "type": "Dynamic",
                    "primary_muscle_groups": [
                        "Spine",
                        "Core"
                    ],
                    "secondary_muscle_groups": [
                        "Neck",
                        "Shoulders"
                    ],
                    "purpose": [
                        "Warm-up",
                        "Flexibility"
                    ],
                    "equipment_needed": false,
                    "difficulty_level": "Beginner",
                    "duration_seconds": null,
                    "repetitions": 10,
                    "sets": 1,
                    "video_url": null,
                    "image_urls": [],
                    "cautions": "Move with your breath and avoid forcing the range of motion."
                },
                {
                    "exercise_id": "df1bcc7a-0a42-4f07-8661-632931ec8b1d",
                    "name": "Child's Pose",
                    "description": "Kneel on the floor, sit back on your heels, and then fold forward, resting your forehead on the floor. Your arms can be stretched out in front of you or resting alongside your body. Breathe deeply and relax.",
                    "type": "Static",
                    "primary_muscle_groups": [
                        "Lower Back",
                        "Hips"
                    ],
                    "secondary_muscle_groups": [
                        "Shoulders"
                    ],
                    "purpose": [
                        "Flexibility",
                        "Cool-down",
                        "Rehabilitation"
                    ],
                    "equipment_needed": false,
                    "difficulty_level": "Beginner",
                    "duration_seconds": 60,
                    "repetitions": 1,
                    "sets": 1,
                    "video_url": null,
                    "image_urls": [],
                    "cautions": "If you have knee issues, place a blanket under your knees for support."
                },
                {
                    "exercise_id": "9e335631-074d-4bc6-a49e-84fadd7ff46d",
                    "name": "Butterfly Stretch",
                    "description": "Sit on the floor with the soles of your feet together and your knees bent out to the sides. Hold onto your ankles or feet, and gently press your knees towards the floor. Keep your back straight.",
                    "type": "Static",
                    "primary_muscle_groups": [
                        "Inner Thighs",
                        "Hips"
                    ],
                    "secondary_muscle_groups": [
                        "Groin"
                    ],
                    "purpose": [
                        "Flexibility"
                    ],
                    "equipment_needed": false,
                    "difficulty_level": "Beginner",
                    "duration_seconds": 30,
                    "repetitions": 1,
                    "sets": 2,
                    "video_url": null,
                    "image_urls": [],
                    "cautions": "Avoid bouncing your knees. Apply gentle pressure."
                },
                {
                    "exercise_id": "06312eb3-0483-425f-abdd-2e4f14aeca6c",
                    "name": "Lying Knee-to-Chest Stretch",
                    "description": "Lie on your back with your knees bent and feet flat on the floor. Bring one knee to your chest, holding it with both hands. Gently pull the knee closer to your chest. Hold, then switch legs.",
                    "type": "Static",
                    "primary_muscle_groups": [
                        "Lower Back",
                        "Glutes"
                    ],
                    "secondary_muscle_groups": [
                        "Hamstrings"
                    ],
                    "purpose": [
                        "Flexibility",
                        "Cool-down"
                    ],
                    "equipment_needed": false,
                    "difficulty_level": "Beginner",
                    "duration_seconds": 30,
                    "repetitions": 1,
                    "sets": 2,
                    "video_url": null,
                    "image_urls": [],
                    "cautions": "Keep your head and shoulders on the floor."
                }
            ],
            "stretching_routines": [
                {
                    "routine_id": "54faee04-2a5a-43c9-93dd-d62eac6959e5",
                    "name": "Morning Full Body Wake-Up",
                    "description": "A gentle routine to wake up your muscles and improve circulation, perfect for starting your day.",
                    "purpose": [
                        "Daily Flexibility",
                        "Warm-up"
                    ],
                    "estimated_duration_minutes": 10,
                    "difficulty_level": "Beginner",
                    "exercises": [
                        {
                            "exercise_id": "52a8744f-dd92-4af1-af69-a8a3fe78ca2e",
                            "order": 1,
                            "duration_seconds": 20
                        },
                        {
                            "exercise_id": "8f70f4ad-7e1c-4a64-9742-07b1ffe2adab",
                            "order": 2,
                            "duration_seconds": 20
                        },
                        {
                            "exercise_id": "fd15a883-314f-4c86-aa43-3088c1a2744c",
                            "order": 3,
                            "duration_seconds": 20
                        },
                        {
                            "exercise_id": "a4c6d7f9-8f38-470b-95da-eb648a9013aa",
                            "order": 4,
                            "duration_seconds": 20
                        },
                        {
                            "exercise_id": "7fa1ae59-4b5c-4d2d-b810-73add9a688fc",
                            "order": 5,
                            "repetitions": 15
                        }
                    ],
                    "tags": [
                        "Morning",
                        "Full Body",
                        "Gentle"
                    ]
                },
                {
                    "routine_id": "19ba84af-a3e6-4d78-943d-ea85fcaf04df",
                    "name": "Post-Run Cool-down",
                    "description": "A routine focused on static stretches to aid recovery and improve flexibility after a run.",
                    "purpose": [
                        "Cool-down",
                        "Flexibility",
                        "Sport-Specific"
                    ],
                    "estimated_duration_minutes": 15,
                    "difficulty_level": "Intermediate",
                    "exercises": [
                        {
                            "exercise_id": "52a8744f-dd92-4af1-af69-a8a3fe78ca2e",
                            "order": 1,
                            "duration_seconds": 30
                        },
                        {
                            "exercise_id": "8f70f4ad-7e1c-4a64-9742-07b1ffe2adab",
                            "order": 2,
                            "duration_seconds": 30
                        },
                        {
                            "exercise_id": "fd15a883-314f-4c86-aa43-3088c1a2744c",
                            "order": 3,
                            "duration_seconds": 30
                        },
                        {
                            "exercise_id": "7cdad1e2-695e-4818-88dc-f47c410be568",
                            "order": 4,
                            "repetitions": 8
                        }
                    ],
                    "tags": [
                        "Running",
                        "Recovery",
                        "Legs"
                    ]
                },
                {
                    "routine_id": "cb73c37a-c059-4362-b237-bd82671891ec",
                    "name": "Office Desk Relief",
                    "description": "A short routine to combat the effects of sitting at a desk all day.",
                    "purpose": [
                        "Flexibility",
                        "Rehabilitation"
                    ],
                    "estimated_duration_minutes": 5,
                    "difficulty_level": "Beginner",
                    "exercises": [
                        {
                            "exercise_id": "a4c6d7f9-8f38-470b-95da-eb648a9013aa",
                            "order": 1,
                            "duration_seconds": 20
                        },
                        {
                            "exercise_id": "7fa1ae59-4b5c-4d2d-b810-73add9a688fc",
                            "order": 2,
                            "repetitions": 10
                        },
                        {
                            "exercise_id": "bf563c7b-950f-4337-a5c6-6a5f701142fd",
                            "order": 3,
                            "repetitions": 5
                        },
                        {
                            "exercise_id": "df1bcc7a-0a42-4f07-8661-632931ec8b1d",
                            "order": 4,
                            "duration_seconds": 30
                        }
                    ],
                    "tags": [
                        "Office",
                        "Desk Job",
                        "Posture"
                    ]
                },
                {
                    "routine_id": "7325029d-da47-4bd7-8da8-7f1196d63954",
                    "name": "Pre-Workout Dynamic Warm-up",
                    "description": "A dynamic warm-up to prepare your body for a workout.",
                    "purpose": [
                        "Warm-up"
                    ],
                    "estimated_duration_minutes": 10,
                    "difficulty_level": "Intermediate",
                    "exercises": [
                        {
                            "exercise_id": "7fa1ae59-4b5c-4d2d-b810-73add9a688fc",
                            "order": 1,
                            "repetitions": 15
                        },
                        {
                            "exercise_id": "7cdad1e2-695e-4818-88dc-f47c410be568",
                            "order": 2,
                            "repetitions": 10
                        },
                        {
                            "exercise_id": "bf563c7b-950f-4337-a5c6-6a5f701142fd",
                            "order": 3,
                            "repetitions": 10
                        }
                    ],
                    "tags": [
                        "Workout",
                        "Dynamic",
                        "Warm-up"
                    ]
                },
                {
                    "routine_id": "ee5181e1-0231-4f79-ae3c-d8acf33929af",
                    "name": "Advanced Flexibility Flow",
                    "description": "A challenging routine for those looking to improve their flexibility significantly.",
                    "purpose": [
                        "Flexibility"
                    ],
                    "estimated_duration_minutes": 20,
                    "difficulty_level": "Advanced",
                    "exercises": [
                        {
                            "exercise_id": "9e335631-074d-4bc6-a49e-84fadd7ff46d",
                            "order": 1,
                            "duration_seconds": 60
                        },
                        {
                            "exercise_id": "52a8744f-dd92-4af1-af69-a8a3fe78ca2e",
                            "order": 2,
                            "duration_seconds": 45
                        },
                        {
                            "exercise_id": "7fa1ae59-4b5c-4d2d-b810-73add9a688fc",
                            "order": 3,
                            "repetitions": 15
                        }
                    ],
                    "tags": [
                        "Advanced",
                        "Flexibility",
                        "Yoga"
                    ]
                }
            ]
        };
    }

    // Get all exercises
    getAllExercises(filters = {}) {
        const { type, difficulty, muscleGroup, purpose, equipment, search } = filters;
        
        return this.data.stretching_exercises.filter(exercise => {
            // Filter by type if specified
            if (type && exercise.type !== type) return false;
            
            // Filter by difficulty if specified
            if (difficulty && exercise.difficulty_level !== difficulty) return false;
            
            // Filter by muscle group if specified
            if (muscleGroup && 
                !exercise.primary_muscle_groups.includes(muscleGroup) && 
                !exercise.secondary_muscle_groups.some(muscle => muscle === muscleGroup)) {
                return false;
            }
            
            // Filter by purpose if specified
            if (purpose && !exercise.purpose.includes(purpose)) return false;
            
            // Filter by equipment availability if specified
            if (equipment === false && exercise.equipment_needed) return false;
            if (equipment === true && !exercise.equipment_needed) return false;
            
            // Filter by search term if specified
            if (search) {
                const lowerSearch = search.toLowerCase();
                const nameMatch = exercise.name.toLowerCase().includes(lowerSearch);
                const descMatch = exercise.description.toLowerCase().includes(lowerSearch);
                if (!nameMatch && !descMatch) return false;
            }
            
            return true;
        });
    }

    // Get exercise by ID
    getExerciseById(exerciseId) {
        return this.data.stretching_exercises.find(exercise => exercise.exercise_id === exerciseId);
    }

    // Get exercises by type (Static, Dynamic, PNF, etc.)
    getExercisesByType(type) {
        return this.data.stretching_exercises.filter(exercise => exercise.type === type);
    }

    // Get exercises by muscle group
    getExercisesByMuscleGroup(muscleGroup) {
        return this.data.stretching_exercises.filter(exercise => 
            exercise.primary_muscle_groups.includes(muscleGroup) ||
            (exercise.secondary_muscle_groups && 
             exercise.secondary_muscle_groups.includes(muscleGroup))
        );
    }

    // Get exercises by purpose
    getExercisesByPurpose(purpose) {
        return this.data.stretching_exercises.filter(exercise => 
            exercise.purpose.includes(purpose)
        );
    }

    // Get exercises by difficulty level
    getExercisesByDifficulty(difficultyLevel) {
        return this.data.stretching_exercises.filter(exercise => 
            exercise.difficulty_level === difficultyLevel
        );
    }

    // Get exercises that don't require equipment
    getExercisesWithoutEquipment() {
        return this.data.stretching_exercises.filter(exercise => !exercise.equipment_needed);
    }

    // Get all routines
    getAllRoutines(filters = {}) {
        const { difficulty, purpose, duration, search } = filters;
        
        return this.data.stretching_routines.filter(routine => {
            // Filter by difficulty if specified
            if (difficulty && routine.difficulty_level !== difficulty) return false;
            
            // Filter by purpose if specified
            if (purpose && !routine.purpose.includes(purpose)) return false;
            
            // Filter by duration if specified
            if (duration && routine.estimated_duration_minutes > duration) return false;
            
            // Filter by search term if specified
            if (search) {
                const lowerSearch = search.toLowerCase();
                const nameMatch = routine.name.toLowerCase().includes(lowerSearch);
                const descMatch = routine.description.toLowerCase().includes(lowerSearch);
                const tagMatch = routine.tags && routine.tags.some(tag => 
                    tag.toLowerCase().includes(lowerSearch)
                );
                if (!nameMatch && !descMatch && !tagMatch) return false;
            }
            
            return true;
        });
    }

    // Get routine by ID
    getRoutineById(routineId) {
        return this.data.stretching_routines.find(routine => routine.routine_id === routineId);
    }

    // Get routines by purpose
    getRoutinesByPurpose(purpose) {
        return this.data.stretching_routines.filter(routine => 
            routine.purpose.includes(purpose)
        );
    }

    // Get routines by difficulty level
    getRoutinesByDifficulty(difficultyLevel) {
        return this.data.stretching_routines.filter(routine => 
            routine.difficulty_level === difficultyLevel
        );
    }

    // Get routines by estimated duration (in minutes)
    getRoutinesByDuration(maxDuration) {
        return this.data.stretching_routines.filter(routine => 
            routine.estimated_duration_minutes <= maxDuration
        );
    }

    // Get detailed routine with exercise information
    getDetailedRoutine(routineId) {
        const routine = this.getRoutineById(routineId);
        if (!routine) return null;

        const detailedExercises = routine.exercises.map(exerciseRef => {
            const exercise = this.getExerciseById(exerciseRef.exercise_id);
            if (!exercise) return null;
            
            return {
                ...exercise,
                order: exerciseRef.order,
                // Override with routine-specific values if provided
                duration_seconds: exerciseRef.duration_seconds || exercise.duration_seconds,
                repetitions: exerciseRef.repetitions || exercise.repetitions,
                sets: exerciseRef.sets || exercise.sets
            };
        })
        .filter(exercise => exercise !== null)
        .sort((a, b) => a.order - b.order);

        return {
            ...routine,
            exercises: detailedExercises
        };
    }

    // Search exercises by name or description
    searchExercises(query) {
        const lowerQuery = query.toLowerCase();
        return this.data.stretching_exercises.filter(exercise => 
            exercise.name.toLowerCase().includes(lowerQuery) ||
            exercise.description.toLowerCase().includes(lowerQuery)
        );
    }

    // Search routines by name, description, or tags
    searchRoutines(query) {
        const lowerQuery = query.toLowerCase();
        return this.data.stretching_routines.filter(routine => 
            routine.name.toLowerCase().includes(lowerQuery) ||
            routine.description.toLowerCase().includes(lowerQuery) ||
            (routine.tags && routine.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        );
    }

    // Create a personalized routine based on criteria
    createPersonalizedRoutine(criteria) {
        const {
            purpose = 'Flexibility',
            difficulty = 'Beginner',
            duration = 15, // minutes
            muscleGroups = [],
            equipmentAvailable = true
        } = criteria;

        let availableExercises = this.data.stretching_exercises.filter(exercise => {
            // Filter by purpose
            if (!exercise.purpose.includes(purpose)) return false;
            
            // Filter by difficulty
            if (exercise.difficulty_level !== difficulty) return false;
            
            // Filter by equipment availability
            if (!equipmentAvailable && exercise.equipment_needed) return false;
            
            // Filter by muscle groups if specified
            if (muscleGroups.length > 0) {
                const hasTargetMuscle = muscleGroups.some(muscle => 
                    exercise.primary_muscle_groups.includes(muscle) ||
                    (exercise.secondary_muscle_groups && 
                     exercise.secondary_muscle_groups.includes(muscle))
                );
                if (!hasTargetMuscle) return false;
            }
            
            return true;
        });

        // Estimate time per exercise (including transitions)
        const avgTimePerExercise = 1.5; // minutes
        const maxExercises = Math.floor(duration / avgTimePerExercise);
        
        // Select exercises (simple random selection for demo)
        const selectedExercises = availableExercises
            .sort(() => 0.5 - Math.random())
            .slice(0, maxExercises)
            .map((exercise, index) => ({
                exercise_id: exercise.exercise_id,
                order: index + 1
            }));

        return {
            routine_id: `custom_${Date.now()}`,
            name: `Personalized ${purpose} Routine`,
            description: `A custom routine tailored to your preferences`,
            purpose: [purpose],
            estimated_duration_minutes: duration,
            difficulty_level: difficulty,
            exercises: selectedExercises,
            tags: ['Custom', 'Personalized']
        };
    }
}

// Create singleton instance
export const stretchingDatabase = new StretchingDatabase();

export default stretchingDatabase;