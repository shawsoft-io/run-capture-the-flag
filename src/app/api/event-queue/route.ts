import { QueueServiceClient } from "@azure/storage-queue";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const QUEUE_NAME = process.env.QUEUE_NAME;

    if (!AZURE_STORAGE_CONNECTION_STRING || !QUEUE_NAME) {
      return NextResponse.json({ error: "Missing Azure configuration" }, { status: 500 });
    }

    const queueServiceClient = QueueServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const queueClient = queueServiceClient.getQueueClient(QUEUE_NAME);
    const queueProperties = await queueClient.getProperties();
    const queueCount = queueProperties.approximateMessagesCount || 0;
    const messagesResponse = await queueClient.peekMessages({ numberOfMessages: 30 });

    const messages = messagesResponse.peekedMessageItems.map((message) => ({
      messageId: message.messageId,
      dequeueCount: message.dequeueCount,
      messageText: message.messageText,
      insertionTime: message.insertedOn || null,
      expirationTime: message.expiresOn || null, 
    }));

    return NextResponse.json({ messages, queueCount }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch messages from Azure Queue:", error);
    return NextResponse.json({ error: "Failed to fetch messages from Azure Queue" }, { status: 500 });
  }
}