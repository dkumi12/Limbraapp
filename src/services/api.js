// OpenRouter API configuration and service
const getOpenRouterAPIKey = () => {
  return localStorage.getItem('openrouter_api_key') || '';
}

const getYouTubeAPIKey = () => {
  return localStorage.getItem('youtube_api_key') || '';
}

const getSelectedModel = () => {
  return localStorage.getItem('selected_model') || 'anthropic/claude-3-haiku'; // Default to claude-3-haiku if not set
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// YouTube API configuration
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

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

// Generate routine using AI
export async function generateAIRoutine(preferences) {
  const { duration, goals, bodyParts, equipment, difficulty, energyLevel, problems } = preferences;  
  const prompt = `
Generate a personalized stretching and warm-up routine with the following requirements:

Duration: ${duration} seconds (${Math.round(duration / 60)} minutes)
Goals: ${goals.join(', ')}
Body Parts: ${bodyParts.join(', ')}
Equipment Available: ${equipment.join(', ')}
Difficulty Level: ${difficulty}
Energy Level: ${energyLevel}
Specific Problems: ${problems.join(', ')}

Please provide a JSON response with exactly this structure:
{
  "routineName": "Name of the routine",
  "exercises": [
    {
      "name": "Exercise name",
      "duration": 30,
      "description": "Clear, concise instructions",
      "equipment": ["equipment needed"],
      "targetMuscles": ["muscles targeted"],
      "benefits": ["key benefits"],
      "tips": "Important form or safety tip",
      "videoSearchQuery": "search query for YouTube"
    }
  ],
  "warmupTips": ["3-5 general tips"],
  "cooldownAdvice": "Brief cooldown advice"
}

Requirements:
- Each exercise should be 20-60 seconds
- Include variety of movements
- Progress from gentle to more intensive
- Include equipment-specific exercises when equipment is available
- Ensure total duration matches requested time
- Make exercises appropriate for the difficulty level
`;

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
        'X-Title': 'Stretch Easy App'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness and stretching expert. Generate safe, effective routines.'
          },
          {
            role: 'user',
            content: prompt
          }
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
    console.error('Error generating AI routine:', error);
    throw error;
  }
}
// Search YouTube for exercise videos
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
    videoDuration: 'short', // Under 4 minutes
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

// Load videos for exercises
export async function loadExerciseVideos(exercises) {
  const exercisesWithVideos = [];
  
  for (const exercise of exercises) {
    try {
      if (exercise.videoSearchQuery || exercise.name) {
        const videos = await searchYouTubeVideos(exercise.videoSearchQuery || exercise.name, 3);
        
        if (videos.length > 0) {
          exercise.videoId = videos[0].id.videoId;
          exercise.videoTitle = videos[0].snippet.title;
          exercise.channelTitle = videos[0].snippet.channelTitle;
        }
      }
      exercisesWithVideos.push(exercise);
    } catch (error) {
      console.error(`Error loading video for ${exercise.name}:`, error);
      exercisesWithVideos.push(exercise);
    }
  }
  
  return exercisesWithVideos;
}
// Equipment descriptions
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