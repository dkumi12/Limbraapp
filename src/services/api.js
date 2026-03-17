// src/services/api.js
// Updated for StretchGPT V3 & Secure Bedrock Integration

// ============================================
// API CONFIGURATION
// ============================================

const getOpenRouterAPIKey = () => {
  return import.meta.env.VITE_OPENROUTER_API_KEY || '';
};

const getYouTubeAPIKey = () => {
  return import.meta.env.VITE_YOUTUBE_API_KEY || '';
};

const getHuggingFaceToken = () => {
  return import.meta.env.VITE_HF_WRITE_TOKEN || '';
};

const getSelectedModel = () => {
  return import.meta.env.VITE_SELECTED_MODEL || 'anthropic/claude-3-haiku';
};

const getAIProvider = () => {
  return import.meta.env.VITE_AI_PROVIDER || 'stretchgpt';
};

const getAwsModelId = () =>
  import.meta.env.VITE_AWS_MODEL_ID || 'mistral.mistral-small-2402-v1:0';

// API Endpoints
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
const HF_API_URL =
  'https://api-inference.huggingface.co/models/dkumi12/stretchgptv2';

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
  MAT: 'mat',
};

// ============================================
// STRETCHGPT V3 INTEGRATION
// ============================================

export async function generateStretchGPTV3Routine(preferences) {
  const hfToken = getHuggingFaceToken();

  if (!hfToken) {
    throw new Error(
      'HuggingFace token not configured. Please add your token in Settings.'
    );
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        parameters: {
          max_new_tokens: 1500,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Serverless API Error:', response.status, errorData);
      throw new Error(
        `Serverless API error: ${response.status} - ${errorData.error || 'Unknown error'}`
      );
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
          exercise.videoSearchQuery =
            `${exercise.name} ${exercise.target || ''} stretch tutorial`.trim();
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
    neck: 'Neck/Shoulders',
    shoulders: 'Neck/Shoulders',
    upper_back: 'Posterior Chain',
    lower_back: 'Posterior Chain',
    chest: 'Anterior Chain',
    arms: 'Anterior Chain',
    hips: 'Lateral Chain',
    legs: 'Posterior Chain',
    calves: 'Posterior Chain',
    full_body: 'Posterior Chain',
  };

  // Get unique V3 targets
  const targets = [
    ...new Set(bodyParts.map(bp => mapping[bp] || 'Posterior Chain')),
  ];
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
          videoSearchQuery:
            ex.videoSearchQuery || `${ex.name} stretch tutorial`,
          reps: ex.reps || null,
          duration_seconds: ex.duration || 45,
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
      'Enhances mobility',
    ],
    warmupTips: [v3Routine.rationale],
    cooldownAdvice: 'Take deep breaths and slowly return to normal activity.',
    source: 'stretchgpt_v3',
    // Keep original V3 structure for future phase-aware UI
    _v3Data: v3Routine,
  };
}

// ============================================
// AWS BEDROCK INTEGRATION
// ============================================

async function generateBedrockRoutine(preferences) {
  const modelId = getAwsModelId();

  const { duration, goals, bodyParts, equipment, difficulty } = preferences;
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
Return ONLY valid JSON.
`;

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'bedrock',
        prompt: prompt,
        modelId: modelId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Serverless API error: ${response.status} - ${errorData.error || 'Unknown error'}`
      );
    }

    const data = await response.json();
    let responseText = data.responseText;

    const jsonMatch = responseText.match(/[\{\[][\s\S]*[\}\]]/);
    if (!jsonMatch) {
      throw new Error('No JSON found in model response');
    }

    let parsedData = JSON.parse(jsonMatch[0]);

    // Normalize response to always have valid structure and number durations
    if (Array.isArray(parsedData)) {
      parsedData = {
        routineName:
          preferences.goals[0]?.replace(/_/g, ' ') || 'Custom Routine',
        exercises: parsedData,
        warmupTips: ['Move slowly', 'Breathe deeply'],
        cooldownAdvice: 'Rest for a few minutes after finishing.',
      };
    }

    // Ensure all exercises have proper formatting
    if (parsedData.exercises && Array.isArray(parsedData.exercises)) {
      parsedData.exercises = parsedData.exercises.map(ex => ({
        ...ex,
        name: ex.name || ex.exercise_name || 'Stretching Exercise',
        duration: parseInt(ex.duration) || 45,
        description:
          ex.description ||
          ex.instructions ||
          'Follow the video instructions carefully.',
        videoSearchQuery:
          ex.videoSearchQuery || `${ex.name || 'stretching'} stretch tutorial`,
      }));
    }

    return parsedData;
  } catch (error) {
    console.error('Bedrock error:', error);
    throw error;
  }
}

// ============================================
// MAIN AI ROUTINE GENERATOR
// ============================================

export async function generateAIRoutine(preferences) {
  console.log('🎯 generateAIRoutine called with:', preferences);

  const aiProvider = getAIProvider();
  console.log('🤖 Active AI Provider:', aiProvider);

  // 1. Try AWS Bedrock if selected
  if (aiProvider === 'bedrock') {
    try {
      console.log('🚀 Attempting AWS Bedrock generation...');
      const bedrockRoutine = await generateBedrockRoutine(preferences);
      if (bedrockRoutine && bedrockRoutine.exercises && bedrockRoutine.exercises.length > 0) {
        console.log('✅ AWS Bedrock Success:', bedrockRoutine);
        return bedrockRoutine;
      }
      throw new Error('Bedrock returned an empty or invalid routine structure');
    } catch (error) {
      console.error('❌ AWS Bedrock failed:', error);
      console.warn('⚠️ Falling back from Bedrock due to error:', error.message);
      // If Bedrock was explicitly chosen and failed, we should know why
    }
  }

  // 2. Try StretchGPT V3 (HuggingFace) if selected or as fallback
  if (aiProvider === 'stretchgpt' || aiProvider === 'bedrock') {
    const hfToken = getHuggingFaceToken();
    
    if (hfToken) {
      try {
        console.log('🚀 Attempting StretchGPT V3 (HuggingFace) generation...');
        const v3Routine = await generateStretchGPTV3Routine(preferences);
        const flattenedRoutine = flattenV3Routine(v3Routine);
        if (flattenedRoutine && flattenedRoutine.exercises && flattenedRoutine.exercises.length > 0) {
          console.log('✅ StretchGPT V3 Success:', flattenedRoutine);
          return flattenedRoutine;
        }
        throw new Error('StretchGPT returned an empty or invalid routine');
      } catch (error) {
        console.error('❌ StretchGPT V3 failed:', error);
        console.warn('⚠️ Falling back from StretchGPT:', error.message);
      }
    } else {
      console.log('ℹ️ Skipping StretchGPT: No HuggingFace token configured');
    }
  }

  // 3. Final AI Fallback: OpenRouter
  console.log('🔄 Attempting OpenRouter as final AI fallback...');
  try {
    const openRouterRoutine = await generateOpenRouterRoutine(preferences);
    if (openRouterRoutine && openRouterRoutine.exercises && openRouterRoutine.exercises.length > 0) {
      console.log('✅ OpenRouter Success:', openRouterRoutine);
      return openRouterRoutine;
    }
    throw new Error('OpenRouter returned an empty or invalid routine');
  } catch (error) {
    console.error('❌ All AI providers failed. Error:', error.message);
    throw new Error(`AI Generation failed: ${error.message}. The app will use a high-quality local routine instead.`);
  }
}

// ============================================
// OPENROUTER FALLBACK
// ============================================

async function generateOpenRouterRoutine(preferences) {
  const {
    duration,
    goals,
    bodyParts,
    equipment,
    difficulty,
    energyLevel,
    problems,
  } = preferences;

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
      throw new Error(
        'OpenRouter API key not configured. Please add your API key in Settings.'
      );
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Limbra App',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content:
              'You are a professional fitness and stretching expert. Generate safe, effective routines following the exact JSON format provided. Return only valid JSON.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
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

  // Enhance query for better relevance and remove special characters
  let enhancedQuery = query.replace(/[()\[\]{}]/g, '').trim();

  const lowerQuery = enhancedQuery.toLowerCase();
  if (
    !lowerQuery.includes('stretch') &&
    !lowerQuery.includes('exercise') &&
    !lowerQuery.includes('tutorial')
  ) {
    enhancedQuery = `${enhancedQuery} stretch tutorial`;
  } else if (
    !lowerQuery.includes('tutorial') &&
    !lowerQuery.includes('demonstration')
  ) {
    // If it has "stretch" but not "tutorial", add tutorial to get better instructional videos
    enhancedQuery = `${enhancedQuery} tutorial`;
  }

  console.log('YouTube Search Query:', enhancedQuery);

  const fetchWithParams = async durationConstraint => {
    const params = new URLSearchParams({
      part: 'snippet',
      q: enhancedQuery,
      type: 'video',
      maxResults: maxResults,
      videoEmbeddable: true,
      ...(durationConstraint ? { videoDuration: durationConstraint } : {}),
      relevanceLanguage: 'en',
      safeSearch: 'strict',
      key: apiKey,
    });

    const response = await fetch(`${YOUTUBE_API_URL}?${params}`);
    if (!response.ok) throw new Error(`YouTube API error: ${response.status}`);
    return await response.json();
  };

  try {
    // Try short videos first
    let data = await fetchWithParams('short');

    // If no short videos are found, fall back to any duration
    if (!data.items || data.items.length === 0) {
      console.log(
        `No short videos found for "${enhancedQuery}", retrying without duration constraint...`
      );
      data = await fetchWithParams(null);
    }

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
      "purpose": ["Flexibility", "Warm-up", "or other relevant purposes"],
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
    const aiProvider = getAIProvider();
    let responseText = '';

    if (aiProvider === 'bedrock') {
      const modelId = getAwsModelId();

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'bedrock',
          prompt: prompt,
          modelId: modelId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Serverless API error: ${response.status} - ${errorData.error || 'Unknown error'}`
        );
      }

      const data = await response.json();
      responseText = data.responseText;
    } else {
      const apiKey = getOpenRouterAPIKey();
      const selectedModel = getSelectedModel();

      if (!apiKey) {
        throw new Error('OpenRouter API key not configured');
      }

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Limbra App',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content:
                'You are a professional fitness and stretching expert. Generate safe, effective routines following the exact format provided.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      responseText = data.choices[0].message.content;
    }

    const jsonMatch = responseText.match(/[\{\[][\s\S]*[\}\]]/);
    if (!jsonMatch) {
      throw new Error('No JSON found in model response');
    }

    const routineData = JSON.parse(jsonMatch[0]);
    return routineData;
  } catch (error) {
    console.error('Error generating routine from search:', error);
    throw error;
  }
}

// Load videos for exercises
export async function loadExerciseVideos(exercises) {
  if (!exercises || !Array.isArray(exercises)) return [];

  const youtubeApiKey = getYouTubeAPIKey();

  // Run all YouTube search requests in parallel
  const fetchVideoPromises = exercises.map(async exercise => {
    // Create a copy so we don't mutate original during parallel processing
    const ex = { ...exercise };

    try {
      if (youtubeApiKey && (ex.videoSearchQuery || ex.name)) {
        try {
          const searchQuery =
            ex.videoSearchQuery ||
            `${ex.name || 'stretching'} stretch tutorial`;
          const videos = await searchYouTubeVideos(searchQuery, 3);

          if (videos && videos.length > 0) {
            ex.videoId = videos[0].id.videoId;
            ex.videoTitle = videos[0].snippet.title;
            ex.channelTitle = videos[0].snippet.channelTitle;
          } else {
            ex.videoId = null;
          }
        } catch (videoError) {
          console.warn(
            `YouTube API failed for ${ex.name}, using placeholder:`,
            videoError
          );
          ex.videoId = null;
        }
      } else {
        ex.videoId = null;
      }
    } catch (error) {
      console.error(`Error processing exercise ${ex.name}:`, error);
      ex.videoId = null;
    }

    return ex;
  });

  return Promise.all(fetchVideoPromises);
}

// ============================================
// EQUIPMENT INFO
// ============================================

export const EQUIPMENT_INFO = {
  [EQUIPMENT_TYPES.NONE]: {
    name: 'No Equipment',
    description: 'Bodyweight only',
    icon: '🤸',
  },
  [EQUIPMENT_TYPES.LACROSSE_BALL]: {
    name: 'Lacrosse Ball',
    description: 'For deep tissue massage',
    icon: '/tennis-ball.svg',
  },
  [EQUIPMENT_TYPES.TENNIS_BALL]: {
    name: 'Tennis Ball',
    description: 'For trigger point release',
    icon: '🎾',
  },
  [EQUIPMENT_TYPES.FOAM_ROLLER]: {
    name: 'Foam Roller',
    description: 'For myofascial release',
    icon: '🟩',
  },
  [EQUIPMENT_TYPES.RESISTANCE_BAND]: {
    name: 'Resistance Band',
    description: 'For assisted stretching',
    icon: '🎗️',
  },
  [EQUIPMENT_TYPES.YOGA_BLOCK]: {
    name: 'Yoga Block',
    description: 'For support and alignment',
    icon: '🧱',
  },
  [EQUIPMENT_TYPES.YOGA_STRAP]: {
    name: 'Yoga Strap',
    description: 'For deeper stretches',
    icon: '🪢',
  },
  [EQUIPMENT_TYPES.STICK]: {
    name: 'Mobility Stick',
    description: 'For posture and mobility',
    icon: '/mobility-stick.svg',
  },
  [EQUIPMENT_TYPES.KETTLEBELL]: {
    name: 'Kettlebell',
    description: 'For weighted stretches',
    icon: '🔔',
  },
  [EQUIPMENT_TYPES.DUMBBELL]: {
    name: 'Dumbbell',
    description: 'For weighted mobility',
    icon: '💪',
  },
  [EQUIPMENT_TYPES.STABILITY_BALL]: {
    name: 'Stability Ball',
    description: 'For balance and core',
    icon: '⚪',
  },
  [EQUIPMENT_TYPES.PULL_UP_BAR]: {
    name: 'Pull-up Bar',
    description: 'For hanging stretches',
    icon: '🚪',
  },
  [EQUIPMENT_TYPES.WALL]: {
    name: 'Wall',
    description: 'For support',
    icon: '🏢',
  },
  [EQUIPMENT_TYPES.CHAIR]: {
    name: 'Chair',
    description: 'For seated stretches',
    icon: '🪑',
  },
  [EQUIPMENT_TYPES.MAT]: {
    name: 'Exercise Mat',
    description: 'For floor work',
    icon: '🏋️',
  },
};
