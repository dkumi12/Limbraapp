// Enhanced routine generation system with AI integration
import { generateAIRoutine, loadExerciseVideos } from './services/api';

export const BODY_PARTS = {
  NECK: 'neck',
  SHOULDERS: 'shoulders', 
  UPPER_BACK: 'upper_back',
  LOWER_BACK: 'lower_back',
  CHEST: 'chest',
  ARMS: 'arms',
  HIPS: 'hips',
  LEGS: 'legs',
  CALVES: 'calves',
  FULL_BODY: 'full_body'
};

export const GOALS = {
  MORNING_WAKE_UP: 'morning_wake_up',
  PRE_WORKOUT: 'pre_workout',
  POST_WORKOUT: 'post_workout',
  DESK_BREAK: 'desk_break',
  STRESS_RELIEF: 'stress_relief',
  BEDTIME_RELAX: 'bedtime_relax',
  PAIN_RELIEF: 'pain_relief',
  FLEXIBILITY: 'flexibility'
};

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

// Fallback exercises for when AI is unavailable
const FALLBACK_EXERCISES = {
  neck_roll: {
    name: 'Neck Rolls',
    duration: 30,
    description: 'Gently roll your neck in circles',
    bodyParts: ['neck'],
    goals: ['desk_break', 'stress_relief'],
    equipment: ['none']
  },
  shoulder_shrug: {
    name: 'Shoulder Shrugs',
    duration: 30,
    description: 'Lift shoulders up to ears and release',
    bodyParts: ['shoulders'],
    goals: ['desk_break', 'stress_relief'],
    equipment: ['none']
  },
  arm_circles: {
    name: 'Arm Circles',
    duration: 40,
    description: 'Make circles with your arms',
    bodyParts: ['shoulders', 'arms'],
    goals: ['morning_wake_up', 'pre_workout'],
    equipment: ['none']
  },
  cat_cow: {
    name: 'Cat-Cow Stretch',
    duration: 45,
    description: 'Arch and round your back',
    bodyParts: ['upper_back', 'lower_back'],
    goals: ['morning_wake_up', 'flexibility'],
    equipment: ['mat']
  },
  forward_fold: {
    name: 'Forward Fold',
    duration: 45,
    description: 'Bend forward to touch toes',
    bodyParts: ['lower_back', 'legs'],
    goals: ['flexibility', 'bedtime_relax'],
    equipment: ['none']
  },
  chest_opener: {
    name: 'Chest Opener',
    duration: 30,
    description: 'Clasp hands behind back and lift',
    bodyParts: ['chest', 'shoulders'],
    goals: ['desk_break', 'post_workout'],
    equipment: ['none']
  },
  hip_circles: {
    name: 'Hip Circles',
    duration: 40,
    description: 'Circle hips in both directions',
    bodyParts: ['hips'],
    goals: ['pre_workout', 'flexibility'],
    equipment: ['none']
  },
  quad_stretch: {
    name: 'Standing Quad Stretch',
    duration: 60,
    description: 'Hold foot behind you, 30s each leg',
    bodyParts: ['legs'],
    goals: ['pre_workout', 'post_workout'],
    equipment: ['wall']
  },
  calf_stretch: {
    name: 'Calf Stretch',
    duration: 60,
    description: 'Push against wall, 30s each leg',
    bodyParts: ['calves'],
    goals: ['pre_workout', 'post_workout'],
    equipment: ['wall']
  },
  foam_roll_back: {
    name: 'Foam Roll Upper Back',
    duration: 60,
    description: 'Roll slowly from mid to upper back',
    bodyParts: ['upper_back'],
    goals: ['post_workout', 'pain_relief'],
    equipment: ['foam_roller']
  },
  lacrosse_shoulders: {
    name: 'Lacrosse Ball Shoulder Release',
    duration: 60,
    description: 'Roll ball on tight spots, 30s each side',
    bodyParts: ['shoulders'],
    goals: ['pain_relief', 'post_workout'],
    equipment: ['lacrosse_ball']
  },
  band_chest_stretch: {
    name: 'Band Chest Stretch',
    duration: 45,
    description: 'Hold band behind back, pull apart gently',
    bodyParts: ['chest', 'shoulders'],
    goals: ['flexibility', 'desk_break'],
    equipment: ['resistance_band']
  }
};

export class RoutineGenerator {
  constructor() {
    this.fallbackExercises = FALLBACK_EXERCISES;
  }
  
  async generateRoutine(preferences) {
    const { equipment = ['none'] } = preferences;
    
    // Ensure equipment is always an array
    const equipmentArray = Array.isArray(equipment) ? equipment : [equipment];
    
    // Update preferences with equipment array
    const updatedPreferences = {
      ...preferences,
      equipment: equipmentArray
    };
    
    try {
      const apiKey = localStorage.getItem('openrouter_api_key');
      if (apiKey) {
        // Try AI generation first
        const aiRoutine = await generateAIRoutine(updatedPreferences);
        
        // Load YouTube videos for exercises
        const exercisesWithVideos = await loadExerciseVideos(aiRoutine.exercises);
        
        return {
          name: aiRoutine.routineName,
          exercises: exercisesWithVideos,
          totalDuration: exercisesWithVideos.reduce((sum, ex) => sum + ex.duration, 0),
          difficulty: preferences.difficulty,
          benefits: this.extractBenefits(exercisesWithVideos),
          tips: aiRoutine.warmupTips || [],
          cooldownAdvice: aiRoutine.cooldownAdvice,
          isFallback: false // Not a fallback
        };
      }
    } catch (error) {
      console.error('AI generation failed, falling back to local exercises:', error);
      // Fallback to local exercises if AI generation fails
      const selectedExercises = Object.values(this.fallbackExercises).filter(ex => 
        preferences.bodyParts.some(part => ex.bodyParts.includes(part)) &&
        preferences.equipment.some(eq => ex.equipment.includes(eq))
      );

      // If no specific fallback exercises match, or not enough, broaden the selection
      if (selectedExercises.length < 3) { // Ensure at least 3 exercises
        const allFallbackExercises = Object.values(this.fallbackExercises);
        // Prioritize exercises matching body parts, then equipment, then general
        const bodyPartMatches = allFallbackExercises.filter(ex => preferences.bodyParts.some(part => ex.bodyParts.includes(part)));
        const equipmentMatches = allFallbackExercises.filter(ex => preferences.equipment.some(eq => ex.equipment.includes(eq)));

        let broadenedSelection = [...new Set([...bodyPartMatches, ...equipmentMatches, ...allFallbackExercises])];
        // Take a reasonable number of exercises, e.g., 5-7, or all if fewer
        selectedExercises.push(...broadenedSelection.slice(0, Math.max(5, preferences.duration / 60))); // Roughly 1 exercise per minute
        // Ensure no duplicates and shuffle for variety
        const uniqueExercises = Array.from(new Set(selectedExercises));
        for (let i = uniqueExercises.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [uniqueExercises[i], uniqueExercises[j]] = [uniqueExercises[j], uniqueExercises[i]];
        }
        selectedExercises.splice(0, selectedExercises.length, ...uniqueExercises.slice(0, Math.max(5, preferences.duration / 60)));
      }

      // Ensure at least one exercise if all else fails
      if (selectedExercises.length === 0) {
        selectedExercises.push(this.fallbackExercises.cat_cow); // A general, safe exercise
      }

      const routineName = this.generateRoutineName(preferences.goals);
      const tips = this.generateTips(preferences);
      const benefits = this.extractBenefits(selectedExercises);

      const exercisesWithVideos = await loadExerciseVideos(selectedExercises);

      return {
        name: routineName,
        exercises: exercisesWithVideos,
        totalDuration: exercisesWithVideos.reduce((sum, ex) => sum + ex.duration, 0),
        difficulty: preferences.difficulty,
        benefits: benefits,
        tips: tips,
        cooldownAdvice: "Perform light stretches and cool down for 5-10 minutes.",
        isFallback: true // This is a fallback routine
      };
    }
  }
  
  generateRoutineName(goals) {
    const goalNames = {
      morning_wake_up: 'Morning Energizer',
      pre_workout: 'Pre-Workout Prep',
      post_workout: 'Post-Workout Recovery',
      desk_break: 'Desk Break Relief',
      stress_relief: 'Stress Relief Flow',
      bedtime_relax: 'Bedtime Wind Down',
      pain_relief: 'Pain Relief Routine',
      flexibility: 'Flexibility Flow'
    };
    
    return goalNames[goals[0]] || 'Custom Stretch Routine';
  }
  
  extractBenefits(exercises) {
    const benefitsSet = new Set();
    exercises.forEach(ex => {
      if (ex.benefits) {
        ex.benefits.forEach(benefit => benefitsSet.add(benefit));
      }
    });
    
    // Add default benefits if none from AI
    if (benefitsSet.size === 0) {
      benefitsSet.add('Improved flexibility');
      benefitsSet.add('Reduced muscle tension');
      benefitsSet.add('Better posture');
      benefitsSet.add('Increased blood flow');
    }
    
    return Array.from(benefitsSet).slice(0, 5);
  }
  
  generateTips(preferences) {
    const tips = [];
    
    if (preferences.timeOfDay === 'morning') {
      tips.push('Start gently - your body may be stiff from sleep');
    }
    
    if (preferences.goals.includes('pre_workout')) {
      tips.push('Focus on dynamic movements to warm up muscles');
    }
    
    if (preferences.goals.includes('post_workout')) {
      tips.push('Hold stretches longer for better recovery');
    }
    
    if (preferences.difficulty === 'beginner') {
      tips.push('Listen to your body and don\'t push too hard');
    }
    
    tips.push('Breathe deeply throughout each stretch');
    tips.push('Move slowly and with control');
    
    return tips.slice(0, 5);
  }
}

// Create singleton instance
export const routineGenerator = new RoutineGenerator();

// Helper function to get YouTube embed URL
export const getYouTubeEmbedUrl = (videoId) => {
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1`;
};

// Helper function to validate routine generation
export const validateRoutinePreferences = (preferences) => {
  const errors = [];
  
  if (!preferences.duration || preferences.duration < 60) {
    errors.push('Duration must be at least 1 minute');
  }
  
  if (!preferences.goals || preferences.goals.length === 0) {
    errors.push('At least one goal must be selected');
  }
  
  if (!preferences.bodyParts || preferences.bodyParts.length === 0) {
    errors.push('At least one body part must be selected');
  }
  
  return {
    isValid: errors.length === 0,
    error: errors.join('. ')
  };
};