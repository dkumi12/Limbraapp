// src/services/api.js
// Updated for StretchGPT V3 Integration

// ============================================
// API CONFIGURATION
// ============================================

const getOpenRouterAPIKey = () => {
  return localStorage.getItem('openrouter_api_key') || '';
}

const getYouTubeAPIKey = () => {
  return localStorage.getItem('youtube_api_key') || '';
}

const getHuggingFaceToken = () => {
  return localStorage.getItem('hf_access_token') || '';
}

const getSelectedModel = () => {
  return localStorage.getItem('selected_model') || 'anthropic/claude-3-haiku';
}

const getAIProvider = () => {
  return localStorage.getItem('ai_provider') || 'stretchgpt';
}

// API Endpoints
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
const HF_API_URL = 'https://api-inference.huggingface.co/models/dkumi12/stretchgptv2';

// Equipment types
export const EQUIPMENT_TYPES = {
  NONE: 'none',
  LACROSSE_BALL: 'lacrosse_ball',
  TENNIS_BALL: 'tennis_ball',
  FOAM_ROLLER: 'foam_roller',
  RESISTANCE_BAND: 'resistance_band',
  YOGA_BLOCK: 'yoga_block',
  YOGA_STRAP: 'yoga_strap',
  STICK: 'stick',
  KETTLEBELL: 'kettlebell',
  DUMBBELL: 'dumbbell',
  STABILITY_BALL: 'stability_ball',
  PULL_UP_BAR: 'pull_up_bar',
  WALL: 'wall',
  CHAIR: 'chair',
  MAT: 'mat'
};

// ============================================
// STRETCHGPT V3 INTEGRATION
// ============================================

export async function generateStretchGPTV3Routine(preferences) {
  const hfToken = getHuggingFaceToken();
  
  if (!hfToken) {
    throw new Error('HuggingFace token not configured. Please add your token in Settings.');
  }

  const { goals, bodyParts, difficulty } = preferences;
  
  // Build prompt matching V3 training format
  const goalText = goals.join(', ').replace(/_/g, ' ');
  const targetText = mapBodyPartsToV3Target(bodyParts);
  
  const prompt = `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\nGenerate a ${difficulty} stretching routine for ${goalText}.\n\nTargeting ${targetText}. No equipment.<|eot_id|><|start_header_id|>assistant<|end_header_id|>`;

  console.log('🚀 StretchGPT V3 Prompt:', prompt);

  try {
    // Call Vercel serverless function instead of HuggingFace directly
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        parameters: {
          max_new_tokens: 1500,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Serverless API Error:', response.status, errorData);
      throw new Error(`Serverless API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('✅ StretchGPT V3 Raw Response:', result);
    
    // Extract generated text
    let rawText;
    if (Array.isArray(result)) {
      rawText = result[0].generated_text;
    } else if (result.generated_text) {
      rawText = result.generated_text;
    } else if (result[0] && result[0].generated_text) {
      rawText = result[0].generated_text;
    } else {
      console.error('Unexpected response format:', result);
      throw new Error('Unexpected API response format');
    }

    console.log('📝 StretchGPT V3 Generated Text:', rawText);

    // Parse JSON from response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', rawText);
      throw new Error('No JSON found in model response');
    }
    
    const routineData = JSON.parse(jsonMatch[0]);
    console.log('✨ StretchGPT V3 Parsed Routine:', routineData);
    
    // Add videoSearchQuery to each exercise
    if (routineData.phases) {
      routineData.phases.forEach(phase => {
        phase.exercises.forEach(exercise => {
          exercise.videoSearchQuery = `${exercise.name} ${exercise.target || ''} stretch tutorial`.trim();
        });
      });
    }

    return routineData;
    
  } catch (error) {
    console.error('❌ StretchGPT V3 Error:', error);
    throw error;
  }
}

// Map Limbraapp body parts to V3 target areas
function mapBodyPartsToV3Target(bodyParts) {
  const mapping = {
    'neck': 'Neck/Shoulders',
    'shoulders': 'Neck/Shoulders',
    'upper_back': 'Posterior Chain',
    'lower_back': 'Posterior Chain',
    'chest': 'Anterior Chain',
    'arms': 'Anterior Chain',
    'hips': 'Lateral Chain',
    'legs': 'Posterior Chain',
    'calves': 'Posterior Chain',
    'full_body': 'Posterior Chain'
  };
  
  // Get unique V3 targets
  const targets = [...new Set(bodyParts.map(bp => mapping[bp] || 'Posterior Chain'))];
  return targets[0] || 'Posterior Chain'; // V3 expects single target
}

// ============================================
// FLATTEN V3 PHASES TO EXERCISE LIST
// ============================================

export function flattenV3Routine(v3Routine) {
  const exercises = [];
  
  if (v3Routine.phases) {
    v3Routine.phases.forEach(phase => {
      phase.exercises.forEach(ex => {
        exercises.push({
          name: ex.name,
          duration: ex.duration || 45,
          description: `${phase.phaseName} exercise: ${ex.type} stretch for ${ex.target}`,
          type: ex.type,
          targetMuscles: [ex.target],
          primary_muscle_groups: [ex.target],
          intensity: ex.intensity,
          phase: phase.phaseName,
          videoSearchQuery: ex.videoSearchQuery || `${ex.name} stretch tutorial`,
          reps: ex.reps || null,
          duration_seconds: ex.duration || 45
        });
      });
    });
  }
  
  const totalDuration = v3Routine.estimatedDuration 
    ? v3Routine.estimatedDuration * 60 
    : exercises.reduce((sum, ex) => sum + (ex.duration || 45), 0);
  
  return {
    routineName: v3Routine.routineName,
    exercises: exercises,
    totalDuration: totalDuration,
    difficulty: v3Routine.level,
    benefits: [
      `Targets ${v3Routine.targetArea}`, 
      'Improves flexibility', 
      'Reduces muscle tension',
      'Enhances mobility'
    ],
    warmupTips: [v3Routine.rationale],
    cooldownAdvice: 'Take deep breaths and slowly return to normal activity.',
    source: 'stretchgpt_v3',
    // Keep original V3 structure for future phase-aware UI
    _v3Data: v3Routine
  };
}

// ============================================
// MAIN AI ROUTINE GENERATOR
// ============================================

export async function generateAIRoutine(preferences) {
  console.log('🎯 generateAIRoutine called with:', preferences);
  
  const aiProvider = getAIProvider();
  console.log('🤖 AI Provider:', aiProvider);
  
  // Try StretchGPT V3 first if selected
  if (aiProvider === 'stretchgpt') {
    const hfToken = getHuggingFaceToken();
    console.log('🔑 HuggingFace token exists:', !!hfToken, hfToken ? `(${hfToken.substring(0, 10)}...)` : '(none)');
    
    if (hfToken) {
      try {
        console.log('🚀 Using StretchGPT V3...');
        const v3Routine = await generateStretchGPTV3Routine(preferences);
        const flattenedRoutine = flattenV3Routine(v3Routine);
        console.log('✅ StretchGPT V3 Success:', flattenedRoutine);
        return flattenedRoutine;
      } catch (error) {
        console.error('❌ StretchGPT V3 failed:', error);
        console.warn('⚠️ Falling back to OpenRouter:', error.message);
        // Fall through to OpenRouter
      }
    } else {
      console.warn('⚠️ No HuggingFace token, falling back to OpenRouter');
    }
  }
  
  console.log('🔄 Attempting OpenRouter...');
  return generateOpenRouterRoutine(preferences);
}

// ============================================
// OPENROUTER FALLBACK
// ============================================

async function generateOpenRouterRoutine(preferences) {
  const { duration, goals, bodyParts, equipment, difficulty, energyLevel, problems } = preferences;
  
  // Use V3-style prompt structure for better results
  const goalText = goals.join(', ').replace(/_/g, ' ');
  const bodyPartsText = bodyParts.join(', ').replace(/_/g, ' ');
  
  const prompt = `
Generate a personalized stretching routine with 4-phase structure (Preparation, Activation, Main, Integration).

Requirements:
- Duration: ${duration} seconds (${Math.round(duration / 60)} minutes)
- Goal: ${goalText}
- Target Areas: ${bodyPartsText}
- Difficulty: ${difficulty}
- Equipment: ${equipment.join(', ')}

Return JSON with this EXACT structure:
{
  "routineName": "Creative routine name",
  "exercises": [
    {
      "name": "Exercise Name",
      "duration": 45,
      "description": "Clear instructions",
      "type": "Dynamic or Static",
      "intensity": "Low, Medium, or High",
      "target": "Primary muscle group",
      "phase": "Preparation, Activation, Main, or Integration",
      "videoSearchQuery": "exercise name proper form tutorial"
    }
  ],
  "warmupTips": ["Tip 1", "Tip 2"],
  "cooldownAdvice": "Brief advice"
}

CRITICAL: 
- Progress from dynamic warm-ups to static stretches
- Balance opposing muscle groups
- Total exercise duration should match requested time
- Include 8-12 exercises
- Each exercise 20-60 seconds
`;

  try {
    const apiKey = getOpenRouterAPIKey();
    const selectedModel = getSelectedModel();

    if (!apiKey) {
      throw new Error('OpenRouter API key not configured. Please add your API key in Settings.');
    }
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Limbra App'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness and stretching expert. Generate safe, effective routines following the exact JSON format provided. Return only valid JSON.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const routineData = JSON.parse(data.choices[0].message.content);
    
    return routineData;
  } catch (error) {
    console.error('OpenRouter error:', error);
    throw error;
  }
}

// ============================================
// YOUTUBE VIDEO LOADING
// ============================================

export async function searchYouTubeVideos(query, maxResults = 5) {
  const apiKey = getYouTubeAPIKey();
  if (!apiKey) {
    console.warn('YouTube API key not configured');
    return [];
  }
  
  // Enhance query for better relevance
  let enhancedQuery = query;
  if (!query.toLowerCase().includes('stretch') && !query.toLowerCase().includes('exercise')) {
    enhancedQuery = `${query} stretch`;
  }
  console.log('YouTube Search Query:', enhancedQuery);

  const params = new URLSearchParams({
    part: 'snippet',
    q: enhancedQuery,
    type: 'video',
    maxResults: maxResults,
    videoEmbeddable: true,
    videoDuration: 'short',
    relevanceLanguage: 'en',
    safeSearch: 'strict',
    key: apiKey
  });

  try {
    const response = await fetch(`${YOUTUBE_API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return [];
  }
}

// Generate a routine based on a search query
export async function generateRoutineFromSearch(searchQuery, preferences) {
  const { duration, difficulty = 'intermediate' } = preferences;
  
  const prompt = `
I need a stretching routine focused on "${searchQuery}". Please create a personalized routine.

Duration: ${duration} seconds (${Math.round(duration / 60)} minutes)
Difficulty Level: ${difficulty}

Please provide a JSON response with exactly this structure:
{
  "routineName": "Name of the routine focused on ${searchQuery}",
  "exercises": [
    {
      "exercise_id": "search_001",
      "name": "Exercise name",
      "description": "Clear, concise instructions",
      "type": "Static or Dynamic",
      "primary_muscle_groups": ["Primary muscles"],
      "secondary_muscle_groups": ["Secondary muscles"],
      "purpose": ["Flexibility", "Warm-up", or other relevant purposes"],
      "equipment_needed": false,
      "equipment_details": [],
      "difficulty_level": "${difficulty}",
      "duration_seconds": 30,
      "repetitions": 1,
      "sets": 2,
      "cautions": "Important form or safety tip",
      "videoSearchQuery": "search query for YouTube"
    }
  ],
  "warmupTips": ["3-5 general tips related to ${searchQuery}"],
  "cooldownAdvice": "Brief cooldown advice"
}`;

  try {
    const apiKey = getOpenRouterAPIKey();
    const selectedModel = getSelectedModel();

    if (!apiKey) {
      throw new Error('OpenRouter API key not configured');
    }
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Limbra App'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness and stretching expert. Generate safe, effective routines following the exact format provided.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const routineData = JSON.parse(data.choices[0].message.content);
    
    return routineData;
  } catch (error) {
    console.error('Error generating routine from search:', error);
    throw error;
  }
}

// Load videos for exercises
export async function loadExerciseVideos(exercises) {
  const exercisesWithVideos = [];
  
  for (const exercise of exercises) {
    try {
      // Defensive Video Fetching: Always add exercise, only attempt video if API configured
      const youtubeApiKey = getYouTubeAPIKey();
      
      if (youtubeApiKey && (exercise.videoSearchQuery || exercise.name)) {
        try {
          const searchQuery = exercise.videoSearchQuery || `${exercise.name} stretch tutorial`;
          const videos = await searchYouTubeVideos(searchQuery, 3);
          
          if (videos.length > 0) {
            exercise.videoId = videos[0].id.videoId;
            exercise.videoTitle = videos[0].snippet.title;
            exercise.channelTitle = videos[0].snippet.channelTitle;
          }
        } catch (videoError) {
          // Catch video-specific errors but don't break the routine
          console.warn(`YouTube API failed for ${exercise.name}, using placeholder:`, videoError);
          exercise.videoId = null; // Explicitly set to null for placeholder
        }
      }
      
      exercisesWithVideos.push(exercise);
    } catch (error) {
      console.error(`Error processing exercise ${exercise.name}:`, error);
      // CRITICAL: Always push exercise even if processing fails
      exercisesWithVideos.push(exercise);
    }
  }
  
  return exercisesWithVideos;
}

// ============================================
// EQUIPMENT INFO
// ============================================

export const EQUIPMENT_INFO = {
  [EQUIPMENT_TYPES.NONE]: {
    name: 'No Equipment',
    description: 'Bodyweight only',
    icon: '🤸'
  },
  [EQUIPMENT_TYPES.LACROSSE_BALL]: {
    name: 'Lacrosse Ball',
    description: 'For deep tissue massage',
    icon: '/tennis-ball.svg'
  },
  [EQUIPMENT_TYPES.TENNIS_BALL]: {
    name: 'Tennis Ball',
    description: 'For trigger point release',
    icon: '🎾'
  },
  [EQUIPMENT_TYPES.FOAM_ROLLER]: {
    name: 'Foam Roller',
    description: 'For myofascial release',
    icon: '🟩'
  },
  [EQUIPMENT_TYPES.RESISTANCE_BAND]: {
    name: 'Resistance Band',
    description: 'For assisted stretching',
    icon: '🎗️'
  },
  [EQUIPMENT_TYPES.YOGA_BLOCK]: {
    name: 'Yoga Block',
    description: 'For support and alignment',
    icon: '🧱'
  },
  [EQUIPMENT_TYPES.YOGA_STRAP]: {
    name: 'Yoga Strap',
    description: 'For deeper stretches',
    icon: '🪢'
  },
  [EQUIPMENT_TYPES.STICK]: {
    name: 'Mobility Stick',
    description: 'For posture and mobility',
    icon: '/mobility-stick.svg'
  },
  [EQUIPMENT_TYPES.KETTLEBELL]: {
    name: 'Kettlebell',
    description: 'For weighted stretches',
    icon: '🔔'
  },
  [EQUIPMENT_TYPES.DUMBBELL]: {
    name: 'Dumbbell',
    description: 'For weighted mobility',
    icon: '💪'
  },
  [EQUIPMENT_TYPES.STABILITY_BALL]: {
    name: 'Stability Ball',
    description: 'For balance and core',
    icon: '⚪'
  },
  [EQUIPMENT_TYPES.PULL_UP_BAR]: {
    name: 'Pull-up Bar',
    description: 'For hanging stretches',
    icon: '🚪'
  },
  [EQUIPMENT_TYPES.WALL]: {
    name: 'Wall',
    description: 'For support',
    icon: '🏢'
  },
  [EQUIPMENT_TYPES.CHAIR]: {
    name: 'Chair',
    description: 'For seated stretches',
    icon: '🪑'
  },
  [EQUIPMENT_TYPES.MAT]: {
    name: 'Exercise Mat',
    description: 'For floor work',
    icon: '🏋️'
  }
};
