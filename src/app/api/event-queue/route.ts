// pages/api/azure-queue/messages.js
import { QueueServiceClient } from '@azure/storage-queue';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const QUEUE_NAME = process.env.QUEUE_NAME;

    if (!AZURE_STORAGE_CONNECTION_STRING || !QUEUE_NAME) {
      return NextResponse.json({ error: 'Missing Azure configuration' }, { status: 500 });
    }

    const queueServiceClient = QueueServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const queueClient = queueServiceClient.getQueueClient(QUEUE_NAME);

    const messagesResponse = await queueClient.receiveMessages(); 

    const messages = messagesResponse.receivedMessageItems.map((message) => ({
      messageId: message.messageId,
      popReceipt: message.popReceipt,
      dequeueCount: message.dequeueCount,
      messageText: message.messageText,
    }));

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch messages from Azure Queue:', error);
    return NextResponse.json({ error: 'Failed to fetch messages from Azure Queue' }, { status: 500 });
  }
}
