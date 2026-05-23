"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import styles from "./ChatbotWidget.module.css";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

type ChatbotResponse = {
  reply: string;
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Bonjour, je suis BEA Assistant. Comment puis-je vous aider ?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function addUserMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        sender: "user",
        text,
      },
    ]);
  }

  function addBotMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        sender: "bot",
        text,
      },
    ]);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  async function sendMessage() {
    const message = input.trim();

    if (message === "" || isSending) return;

    addUserMessage(message);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("http://localhost:8101/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data: ChatbotResponse = await response.json();

      addBotMessage(data.reply || "Aucune réponse reçue.");
    } catch (error) {
      addBotMessage("Cannot connect to backend ❌");
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <button
        className={`${styles.floatingButton} ${isOpen ? styles.floatingButtonActive : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Fermer le chatbot" : "Ouvrir le chatbot"}
      >
        {isOpen ? (
          <span className={styles.closeIcon}>×</span>
        ) : (
          <svg
            className={styles.robotIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="8" width="18" height="11" rx="2" />
            <path d="M12 4v4" />
            <path d="M9 4h6" />
            <circle cx="9" cy="13" r="1" />
            <circle cx="15" cy="13" r="1" />
            <path d="M8 17h8" />
          </svg>
        )}
      </button>

      <div className={`${styles.chatWindow} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>B</div>
            <div>
              <h3>BEA Assistant</h3>
              <p>Assistant bancaire</p>
            </div>
          </div>

          <button
            className={styles.headerClose}
            onClick={() => setIsOpen(false)}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className={styles.messages}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${
                msg.sender === "user" ? styles.userRow : styles.botRow
              }`}
            >
              <div
                className={`${styles.messageBubble} ${
                  msg.sender === "user" ? styles.userBubble : styles.botBubble
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isSending && (
            <div className={`${styles.messageRow} ${styles.botRow}`}>
              <div className={`${styles.messageBubble} ${styles.botBubble}`}>
                <span className={styles.typing}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Écrivez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.input}
          />

          <button
            className={styles.sendButton}
            onClick={sendMessage}
            disabled={isSending || !input.trim()}
          >
            Envoyer
          </button>
        </div>
      </div>
    </>
  );
}
