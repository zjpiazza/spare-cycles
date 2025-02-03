import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy',
  baseURL: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
  defaultHeaders: {
    'CF-Access-Client-Id': process.env.CF_ACCESS_CLIENT_ID || 'dummy',
    'CF-Access-Client-Secret': process.env.CF_ACCESS_CLIENT_SECRET || 'dummy'
  }
});