import { supabase } from '@/integrations/supabase/client';

export class N8nService {
  private static instance: N8nService;
  private webhookUrl: string | null = null;

  private constructor() {
    this.webhookUrl = localStorage.getItem('n8n_webhook_url');
  }

  static getInstance(): N8nService {
    if (!N8nService.instance) {
      N8nService.instance = new N8nService();
    }
    return N8nService.instance;
  }

  setWebhookUrl(url: string): void {
    this.webhookUrl = url;
    localStorage.setItem('n8n_webhook_url', url);
  }

  getWebhookUrl(): string | null {
    return this.webhookUrl;
  }

  async sendQuestionToN8n(question: string): Promise<string> {
    if (!this.webhookUrl) {
      throw new Error('n8n webhook URL is not set. Please configure it in settings.');
    }

    try {
      // Validate URL before making the request
      try {
        new URL(this.webhookUrl);
      } catch (e) {
        throw new Error('Invalid n8n webhook URL. Please check your configuration.');
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question
        })
      });

      if (!response.ok) {
        throw new Error(`n8n webhook error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data || !data.output) {
        throw new Error('Invalid response format from n8n webhook');
      }

      return data.output;

    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to n8n webhook. Please check if the URL is correct and accessible.');
      }
      throw error;
    }
  }

  clearWebhookUrl(): void {
    this.webhookUrl = null;
    localStorage.removeItem('n8n_webhook_url');
  }
}

export const n8nService = N8nService.getInstance();