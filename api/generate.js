// Vercel Serverless Function - Proxy to HuggingFace
// This runs on the server, avoiding CORS issues

export default async function handler(req, res) {
  // Enable CORS for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, parameters } = req.body;
  
  // Get HuggingFace token from environment variable
  const HF_TOKEN = process.env.HF_WRITE_TOKEN;
  
  if (!HF_TOKEN) {
    console.error('HF_WRITE_TOKEN not configured in environment variables');
    return res.status(500).json({ 
      error: 'HuggingFace token not configured on server',
      hint: 'Add HF_WRITE_TOKEN to Vercel environment variables'
    });
  }

  try {
    console.log('Calling StretchGPT V3 with prompt:', prompt.substring(0, 100) + '...');
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/dkumi12/stretchgptv2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: parameters || {
            max_new_tokens: 1500,
            temperature: 0.1,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HuggingFace API Error Details:');
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      console.error('Response Body:', errorText);
      console.error('Request URL:', 'https://api-inference.huggingface.co/models/dkumi12/stretchgptv2');
      console.error('Token exists:', !!HF_TOKEN);
      
      return res.status(response.status).json({
        error: 'HuggingFace API error',
        status: response.status,
        statusText: response.statusText,
        details: errorText,
        hint: 'Check Vercel logs for full error details'
      });
    }

    const data = await response.json();
    console.log('StretchGPT V3 response received successfully');
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      error: 'Failed to reach StretchGPT V3',
      details: error.message
    });
  }
}
