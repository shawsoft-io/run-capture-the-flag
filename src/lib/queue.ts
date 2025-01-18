import { QueueClient } from '@azure/storage-queue';

class AzureQueueManager {
  private queueClient: QueueClient;

  constructor(connectionString: string, queueName: string) {
    if (!connectionString || !queueName) {
      throw new Error('Azure Storage connection string and queue name must be provided.');
    }

    this.queueClient = new QueueClient(connectionString, queueName);
  }

  /**
   * Ensures the queue exists. Creates the queue if it doesn't exist.
   */
  async ensureQueueExists(): Promise<void> {
    try {
      const createQueueResponse = await this.queueClient.createIfNotExists();
      if (createQueueResponse.succeeded) {
        console.log(`Queue '${this.queueClient.name}' created.`);
      }
    } catch (error: any) {
      console.error(`Error ensuring queue existence: ${error.message}`);
      throw new Error('Failed to ensure queue existence.');
    }
  }

  /**
   * Sends a message to the queue.
   * @param message The message to send (any serializable object).
   * @returns The response from the Azure Storage Queue service.
   */
  async sendMessage(message: any): Promise<any> {
    if (!message) {
      throw new Error('Message cannot be empty.');
    }

    try {
      // Serialize the message as JSON and encode it in base64
      const messageText = Buffer.from(JSON.stringify(message)).toString('base64');
      const response = await this.queueClient.sendMessage(messageText);
      console.log('Message added to the queue:', response.messageId);
      return response;
    } catch (error: any) {
      console.error(`Error sending message to queue: ${error.message}`);
      throw new Error('Failed to send message to the queue.');
    }
  }
}

export default AzureQueueManager;