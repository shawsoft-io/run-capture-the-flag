"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Define the structure of queue messages
interface QueueMessage {
  messageId: string;
  messageText: string;
  insertionTime?: string;
  expirationTime?: string;
}

export default function AzureQueueAccordion() {
  const [messages, setMessages] = useState<QueueMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [queueCount, setQueueCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchQueueData() {
      try {
        const response = await fetch("/api/event-queue");
        if (!response.ok) {
          throw new Error("Failed to fetch messages from Azure Queue");
        }
        const data: { messages: QueueMessage[]; queueCount?: number } =
          await response.json();

        setMessages(data.messages || []);
        setQueueCount(data.queueCount ?? data.messages.length);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchQueueData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 mt-40 max-w-7xl mx-auto">
      <div className="w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Decoded Azure Queue Messages
        </h1>
        {queueCount !== null && (
          <p className="text-center text-gray-700 mb-4">
            Total Messages in Queue: {queueCount}
          </p>
        )}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {messages.length > 0 ? (
              <div>
                {messages.map((message) => (
                  <AccordionItem key={message.messageId} message={message} />
                ))}
              </div>
            ) : (
              <p className="text-center text-red-600">
                No messages found in the queue.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// AccordionItem component with strong TypeScript types
function AccordionItem({ message }: { message: QueueMessage }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  let formattedContent: string;
  try {
    formattedContent = JSON.stringify(
      JSON.parse(atob(message.messageText)),
      null,
      2
    );
  } catch {
    formattedContent = "Invalid JSON format";
  }

  return (
    <div className="w-full max-w-2xl mx-auto border border-gray-200 rounded-md overflow-hidden shadow-md">
      {/* Accordion Header */}
      <button
        className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-600 text-white font-semibold transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Message ID: {message.messageId}</span>
        <span
          className={`transform transition ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>

      {/* Accordion Body with Animation */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden bg-gray-100 rounded-b-lg"
      >
        <div className="p-4 text-gray-800">
          <p>
            <strong>📌 Insertion Time:</strong>{" "}
            {message.insertionTime
              ? new Date(message.insertionTime).toLocaleString()
              : "N/A"}
          </p>
          <p>
            <strong>⏳ Expiration Time:</strong>{" "}
            {message.expirationTime
              ? new Date(message.expirationTime).toLocaleString()
              : "N/A"}
          </p>
          <p className="mt-2 text-sm text-gray-600">Decoded Content:</p>
          <pre className="mt-2 p-3 bg-gray-800 text-white text-sm rounded-lg overflow-x-auto">
            {formattedContent}
          </pre>
        </div>
      </motion.div>
    </div>
  );
}