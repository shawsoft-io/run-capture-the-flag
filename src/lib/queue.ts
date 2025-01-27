import { QueueClient, QueueSendMessageResponse } from '@azure/storage-queue';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

export class QueueLib {
  private queueClient: QueueClient;

  constructor(queueName?: string) {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const resolvedQueueName = queueName || process.env.QUEUE_NAME;

    if (!connectionString) {
      throw new Error('Azure Storage connection string must be set in the environment.');
    }

    if (!resolvedQueueName) {
      throw new Error('Queue name must be set in the environment or provided.');
    }

    this.queueClient = new QueueClient(connectionString, resolvedQueueName);
  }

  /**
   * Ensures the queue exists. Creates the queue if it doesn't exist.
   */
  async ensureQueueExists(): Promise<void> {
    try {
      const createQueueResponse = await this.queueClient.createIfNotExists();
      if (createQueueResponse.succeeded) {
        console.log(`Queue '${this.queueClient.name}' created successfully.`);
      } else {
        console.log(`Queue '${this.queueClient.name}' already exists.`);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred while ensuring the queue exists.';
      console.error(`Error ensuring queue existence: ${errorMessage}`);
      throw new Error('Failed to ensure the queue exists.');
    }
  }

  /**
   * Sends a message to the queue.
   * @param message The message to send (any serializable object).
   * @returns The response from the Azure Storage Queue service.
   */
  async sendMessage(message: unknown): Promise<QueueSendMessageResponse> {
    if (message === null || message === undefined) {
      throw new Error('Message cannot be null or undefined.');
    }

    try {
      const messageText = Buffer.from(JSON.stringify(message)).toString('base64');
      const response = await this.queueClient.sendMessage(messageText);
      console.log(`Message added to queue '${this.queueClient.name}':`, response.messageId);
      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred while sending the message.';
      console.error(`Error sending message to queue: ${errorMessage}`);
      throw new Error('Failed to send the message to the queue.');
    }
  }
}