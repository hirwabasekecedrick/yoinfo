import axios from 'axios';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/infopulse';

export const dispatchWebhookEvent = async (event: string, payload: any) => {
  if (!N8N_WEBHOOK_URL) {
    console.log('Webhook URL not configured, skipping event dispatch.');
    return;
  }

  try {
    await axios.post(N8N_WEBHOOK_URL, {
      event,
      payload,
      timestamp: new Date().toISOString()
    });
    console.log(`Successfully dispatched event: ${event} to n8n`);
  } catch (error: any) {
    console.error(`Failed to dispatch event: ${event} to n8n`, error.message);
  }
};
