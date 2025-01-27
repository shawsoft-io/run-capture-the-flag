"use client";

import React, { useEffect, useState } from "react";

export default function AzureQueueAccordion() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queueCount, setQueueCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchQueueData() {
      try {
        const response = await fetch('/api/event-queue');
        if (!response.ok) {
          throw new Error('Failed to fetch messages from Azure Queue');
        }
        const data = await response.json();
        setMessages(data.messages || []);
        setQueueCount(data.queueCount || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchQueueData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Decoded Azure Queue Messages</h1>
        {queueCount !== null && (
          <p className="text-center text-gray-700 mb-4">Total Messages in Queue: {queueCount}</p>
        )}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {messages.length > 0 ? (
              <div>
                {messages.map((message, index) => (
                  <AccordionItem key={index} message={message} />
                ))}
              </div>
            ) : (
              <p className="text-center text-red-600">No messages found in the queue.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AccordionItem({ message }: { message: any }) {
  const [isOpen, setIsOpen] = useState(false);

  let formattedContent;
  try {
    formattedContent = JSON.stringify(JSON.parse(atob(message.messageText)), null, 2);
  } catch (error) {
    formattedContent = "Invalid JSON format";
  }

  return (
    <div className="border rounded shadow-sm">
      <button
        className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 font-bold"
        onClick={() => setIsOpen(!isOpen)}
      >
        Message ID: {message.messageId}
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-50">
          <p><strong>Insertion Time:</strong> {message.enqueueTime ? new Date(message.enqueueTime).toLocaleString() : "Unknown"}</p>
          <p><strong>Expiration Time:</strong> {message.expirationTime ? new Date(message.expirationTime).toLocaleString() : "Unknown"}</p>
          <p><strong>Decoded Content:</strong></p>
          <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">{formattedContent}</pre>
        </div>
      )}
    </div>
  );
}
