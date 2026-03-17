// Vercel Serverless Function - Proxy to HuggingFace & AWS Bedrock
// This runs on the server, avoiding CORS issues and securing credentials

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

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

  const { provider, prompt, parameters, modelId } = req.body;

  console.log(`🤖 Proxy request - Provider: ${provider || 'default (hf)'}, Model: ${modelId || 'n/a'}`);

  // --- AWS BEDROCK PROXY ---
  if (provider === 'bedrock') {
    const accessKeyId =
      process.env.AWS_ACCESS_KEY_ID || process.env.VITE_AWS_ACCESS_KEY;
    const secretAccessKey =
      process.env.AWS_SECRET_ACCESS_KEY || process.env.VITE_AWS_SECRET_KEY;
    const region =
      process.env.AWS_REGION || process.env.VITE_AWS_REGION || 'us-east-1';

    console.log(`🔑 Bedrock config: Region=${region}, AccessKey=${accessKeyId ? 'EXISTS (' + accessKeyId.substring(0, 5) + '...)' : 'MISSING'}, SecretKey=${secretAccessKey ? 'EXISTS' : 'MISSING'}`);

    if (!accessKeyId || !secretAccessKey) {
      console.error('❌ AWS credentials missing from environment');
      return res
        .status(500)
        .json({ error: 'AWS credentials not configured on server' });
    }

    try {
      const client = new BedrockRuntimeClient({
        region: region,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        },
      });

      let payload = {};
      if (modelId.includes('claude-3')) {
        payload = {
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 2000,
          temperature: 0.7,
          messages: [
            { role: 'user', content: [{ type: 'text', text: prompt }] },
          ],
        };
      } else if (modelId.includes('mistral')) {
        payload = {
          prompt: `<s>[INST] ${prompt} [/INST]`,
          max_tokens: 2000,
          temperature: 0.7,
        };
      } else if (modelId.includes('llama3') || modelId.includes('meta')) {
        payload = {
          prompt: `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\n${prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
          temperature: 0.7,
          top_p: 0.9,
          max_gen_len: 2000,
        };
      } else {
        payload = {
          prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
          max_tokens_to_sample: 2000,
          temperature: 0.7,
        };
      }

      const command = new InvokeModelCommand({
        modelId: modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(payload),
      });

      const response = await client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      let responseText = '';
      if (modelId.includes('claude-3')) {
        responseText = responseBody.content[0].text;
      } else if (modelId.includes('mistral')) {
        responseText = responseBody.outputs[0].text;
      } else if (modelId.includes('llama3') || modelId.includes('meta')) {
        responseText = responseBody.generation;
      } else {
        responseText = responseBody.completion;
      }

      return res.status(200).json({ responseText });
    } catch (error) {
      console.error('Bedrock serverless error:', error);
      return res.status(500).json({
        error: 'Failed to generate from Bedrock',
        details: error.message,
      });
    }
  }

  // --- HUGGINGFACE STRETCHGPT PROXY ---
  const HF_TOKEN =
    process.env.HF_WRITE_TOKEN || process.env.VITE_HF_WRITE_TOKEN;

  if (!HF_TOKEN) {
    console.error('HF_WRITE_TOKEN not configured in environment variables');
    return res.status(500).json({
      error: 'HuggingFace token not configured on server',
      hint: 'Add HF_WRITE_TOKEN to Vercel environment variables',
    });
  }

  try {
    console.log(
      'Calling StretchGPT V3 with prompt:',
      prompt.substring(0, 100) + '...'
    );

    const response = await fetch(
      'https://api-inference.huggingface.co/models/dkumi12/stretchgptv2',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: parameters || {
            max_new_tokens: 1500,
            temperature: 0.1,
            do_sample: true,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HuggingFace API Error Details:');
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      console.error('Response Body:', errorText);
      console.error(
        'Request URL:',
        'https://api-inference.huggingface.co/models/dkumi12/stretchgptv2'
      );
      console.error('Token exists:', !!HF_TOKEN);

      return res.status(response.status).json({
        error: 'HuggingFace API error',
        status: response.status,
        statusText: response.statusText,
        details: errorText,
        hint: 'Check Vercel logs for full error details',
      });
    }

    const data = await response.json();
    console.log('StretchGPT V3 response received successfully');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      error: 'Failed to reach StretchGPT V3',
      details: error.message,
    });
  }
}
