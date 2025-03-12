import axios from 'axios';

export interface StoryParams {
  mainCharacter: string;
  setting: string;
  theme: string;
  ageGroup: string;
}

export interface GeneratedStory {
  title: string;
  content: string;
  summary: string;
  createdAt: Date;
}

export class OpenAIService {
  private static apiKey = process.env.OPENAI_API_KEY;
  private static baseUrl = 'https://api.openai.com/v1/chat/completions';

  static async generateStory(params: StoryParams): Promise<GeneratedStory> {
    try {
      const prompt = this.createPrompt(params);
      const response = await axios.post(
        this.baseUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a creative storyteller who creates engaging stories for different age groups.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return this.parseResponse(response.data);
    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error('Failed to generate story');
    }
  }

  private static createPrompt(params: StoryParams): string {
    return `Create a story with the following parameters:
      - Main character: ${params.mainCharacter}
      - Setting: ${params.setting}
      - Theme: ${params.theme}
      - Age group: ${params.ageGroup}
      
      Format your response as JSON with the following structure:
      {
        "title": "Story title",
        "content": "Full story content with paragraphs",
        "summary": "A brief summary of the story"
      }`;
  }

  private static parseResponse(data: any): GeneratedStory {
    const content = data.choices[0].message.content;
    try {
      const parsedContent = JSON.parse(content);
      return {
        title: parsedContent.title,
        content: parsedContent.content,
        summary: parsedContent.summary,
        createdAt: new Date(),
      };
    } catch (e) {
      // Fallback if response is not valid JSON
      return {
        title: 'Generated Story',
        content: content,
        summary: 'A story was generated based on your parameters.',
        createdAt: new Date(),
      };
    }
  }
}
