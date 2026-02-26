import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  Check,
  Copy,
  Loader2,
  Minimize2,
  SendHorizonal,
  Sparkles,
  Trash2,
  User,
  X,
} from 'lucide-react';

type ChatRole = 'assistant' | 'user';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

interface ChatResponse {
  reply?: string;
  suggestions?: string[];
}

type MessageBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

type InlineSegment =
  | { type: 'text'; value: string }
  | { type: 'strong'; value: string };

type LinkChunk =
  | { type: 'text'; value: string }
  | { type: 'link'; value: string; href: string };

const STORAGE_KEY = 'portfolio-chat-history-v2';

const DEFAULT_PROMPTS = [
  'Show your top services',
  'List your best projects',
  'What AI software can you build?',
  'How can I contact you?',
];

const base = import.meta.env.VITE_API_BASE_URL;

const createMessage = (role: ChatRole, content: string): ChatMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  createdAt: Date.now(),
});

const welcomeMessage = (): ChatMessage =>
  createMessage(
    'assistant',
    "Hello! I'm Talha Tariq Assistant. I can help you with AI software, MERN web development, business systems, and project collaboration.",
  );

const formatMessageTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const parseMessageBlocks = (content: string): MessageBlock[] => {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return [{ type: 'paragraph', text: content.trim() }];
  }

  const blocks: MessageBlock[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let items: string[] = [];

  const flushList = () => {
    if (!listType || items.length === 0) return;
    blocks.push({ type: listType, items: [...items] });
    listType = null;
    items = [];
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^[-*•]\s+(.+)/);
    const orderedMatch = line.match(/^\d+[.)]\s+(.+)/);

    if (bulletMatch) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      items.push(bulletMatch[1]);
      continue;
    }

    if (orderedMatch) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      items.push(orderedMatch[1]);
      continue;
    }

    flushList();
    blocks.push({ type: 'paragraph', text: line });
  }

  flushList();
  return blocks;
};

const parseInlineSegments = (text: string): InlineSegment[] => {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return [{ type: 'text', value: '' }];
  }

  const segments: InlineSegment[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let cursor = 0;
  let match = regex.exec(normalized);

  while (match) {
    const start = match.index;
    const end = regex.lastIndex;
    const full = match[0];
    const strongText = match[1];

    if (start > cursor) {
      segments.push({ type: 'text', value: normalized.slice(cursor, start) });
    }

    if (strongText.trim().length > 0) {
      segments.push({ type: 'strong', value: strongText.trim() });
    } else {
      segments.push({ type: 'text', value: full });
    }

    cursor = end;
    match = regex.exec(normalized);
  }

  if (cursor < normalized.length) {
    segments.push({ type: 'text', value: normalized.slice(cursor) });
  }

  return segments.length ? segments : [{ type: 'text', value: normalized }];
};

const normalizeHref = (value: string) => {
  const trimmed = value.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (/^www\./i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return `https://${trimmed}`;
};

const splitLinkChunks = (text: string): LinkChunk[] => {
  const regex =
    /((?:https?:\/\/|www\.)[^\s]+|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi;
  const chunks: LinkChunk[] = [];
  let cursor = 0;
  let match = regex.exec(text);

  while (match) {
    const start = match.index;
    const fullMatch = match[0];
    let normalizedMatch = fullMatch;
    let trailing = '';

    while (/[),.!?;:]$/.test(normalizedMatch)) {
      trailing = normalizedMatch.slice(-1) + trailing;
      normalizedMatch = normalizedMatch.slice(0, -1);
    }

    if (start > cursor) {
      chunks.push({ type: 'text', value: text.slice(cursor, start) });
    }

    if (normalizedMatch.length > 0) {
      chunks.push({
        type: 'link',
        value: normalizedMatch,
        href: normalizeHref(normalizedMatch),
      });
    }

    if (trailing.length > 0) {
      chunks.push({ type: 'text', value: trailing });
    }

    cursor = start + fullMatch.length;
    match = regex.exec(text);
  }

  if (cursor < text.length) {
    chunks.push({ type: 'text', value: text.slice(cursor) });
  }

  return chunks.length ? chunks : [{ type: 'text', value: text }];
};

const renderLinkifiedText = (text: string, keyPrefix: string) =>
  splitLinkChunks(text).map((chunk, index) =>
    chunk.type === 'link' ? (
      <a
        key={`${keyPrefix}-link-${index}`}
        href={chunk.href}
        target="_blank"
        rel="noopener noreferrer"
        className="chatbot-inline-link"
      >
        {chunk.value}
      </a>
    ) : (
      <React.Fragment key={`${keyPrefix}-text-${index}`}>{chunk.value}</React.Fragment>
    ),
  );

const renderInlineText = (text: string, keyPrefix: string) =>
  parseInlineSegments(text).map((segment, index) =>
    segment.type === 'strong' ? (
      <strong key={`${keyPrefix}-strong-${index}`} className="chatbot-rich-strong">
        {renderLinkifiedText(segment.value, `${keyPrefix}-strong-link-${index}`)}
      </strong>
    ) : (
      <React.Fragment key={`${keyPrefix}-text-${index}`}>
        {renderLinkifiedText(segment.value, `${keyPrefix}-link-${index}`)}
      </React.Fragment>
    ),
  );

const loadInitialMessages = (): ChatMessage[] => {
  if (typeof window === 'undefined') {
    return [welcomeMessage()];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [welcomeMessage()];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [welcomeMessage()];
    }

    const normalized = parsed
      .map((item) => ({
        id: String(item?.id || `msg-${Math.random().toString(36).slice(2, 8)}`),
        role: item?.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: String(item?.content || ''),
        createdAt: Number(item?.createdAt || Date.now()),
      }))
      .filter((item) => item.content.trim().length > 0);

    return normalized.length ? normalized : [welcomeMessage()];
  } catch {
    return [welcomeMessage()];
  }
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(loadInitialMessages);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_PROMPTS);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      // Ignore storage quota issues.
    }
  }, [messages]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isSending, isOpen, isCollapsed]);

  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return;

    inputElement.style.height = '0px';
    const nextHeight = Math.min(inputElement.scrollHeight, 112);
    inputElement.style.height = `${Math.max(nextHeight, 42)}px`;
  }, [input]);

  const latestMessage = messages[messages.length - 1];

  useEffect(() => {
    if (!isOpen && latestMessage?.role === 'assistant') {
      setUnreadCount((count) => Math.min(count + 1, 9));
    }
  }, [isOpen, latestMessage]);

  const history = useMemo(
    () => messages.slice(-8).map((message) => ({ role: message.role, content: message.content })),
    [messages],
  );

  const toggleOpen = () => {
    setIsOpen((current) => {
      const next = !current;
      if (next) {
        setUnreadCount(0);
        setIsCollapsed(false);
      }
      return next;
    });
  };

  const resetConversation = () => {
    const initial = [welcomeMessage()];
    setMessages(initial);
    setSuggestions(DEFAULT_PROMPTS);
    setInput('');
    setCopiedMessageId(null);
  };

  const sendMessage = async (rawText?: string) => {
    const content = (rawText ?? input).trim();
    if (!content || isSending) return;

    const userMessage = createMessage('user', content);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      if (!base) {
        throw new Error('Missing VITE_API_BASE_URL for chatbot API.');
      }

      const response = await fetch(`${base}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const raw = await response.text();
      let data: ChatResponse = {};

      if (contentType.includes('application/json')) {
        try {
          data = raw ? JSON.parse(raw) : {};
        } catch {
          data = { reply: 'Invalid JSON response from server.' };
        }
      } else {
        const trimmed = raw.trim();
        const looksLikeHtml = trimmed.startsWith('<');
        data = {
          reply: looksLikeHtml
            ? 'Unexpected response from server.'
            : trimmed || 'Empty response from server.',
        };
      }

      if (!response.ok) {
        const detail = data?.reply || raw || 'Unable to fetch chatbot response right now.';
        throw new Error(`Request failed (${response.status}): ${detail}`);
      }

      const reply = data.reply?.trim() || 'I am ready to help with your project details.';
      setMessages((prev) => [...prev, createMessage('assistant', reply)]);
      setSuggestions(
        Array.isArray(data.suggestions) && data.suggestions.length
          ? data.suggestions.slice(0, 4)
          : DEFAULT_PROMPTS,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to respond right now. Please try again in a moment.';

      setMessages((prev) => [
        ...prev,
        createMessage(
          'assistant',
          `${errorMessage}\n\nYou can contact me directly at tariqtalha772@gmail.com.`,
        ),
      ]);
      setSuggestions(DEFAULT_PROMPTS);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  const copyMessage = async (message: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
      window.setTimeout(() => {
        setCopiedMessageId((current) => (current === message.id ? null : current));
      }, 1400);
    } catch {
      // Clipboard can fail on non-secure origins. Ignore silently.
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] sm:bottom-6 sm:right-6">
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        <div
          className={`chatbot-panel w-[calc(100vw-2rem)] sm:w-[390px] ${
            isOpen ? 'chatbot-panel-open' : 'chatbot-panel-closed'
          }`}
        >
          <div className="chatbot-header relative overflow-hidden rounded-t-3xl px-4 py-3 sm:px-5">
            <div className="chatbot-header-shine" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <span className="rounded-xl bg-white/15 p-2 backdrop-blur">
                  <Bot className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold leading-none">Talha Tariq Assistant</p>
                  <p className="mt-1 text-[11px] text-white/80">AI Software & Web Solutions</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-white">
                <button
                  type="button"
                  onClick={() => setIsCollapsed((value) => !value)}
                  className="rounded-lg p-1.5 transition hover:bg-white/15"
                  aria-label="Minimize chatbot"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={resetConversation}
                  className="rounded-lg p-1.5 transition hover:bg-white/15"
                  aria-label="Reset conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={toggleOpen}
                  className="rounded-lg p-1.5 transition hover:bg-white/15"
                  aria-label="Close chatbot"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-400 ${
              isCollapsed ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-[640px] opacity-100'
            }`}
          >
            <div ref={viewportRef} className="chatbot-messages h-[360px] space-y-3 overflow-y-auto px-3 py-3 sm:px-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chatbot-message flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed sm:max-w-[84%] ${
                      message.role === 'user'
                        ? 'chatbot-message-user chatbot-user-shell'
                        : 'chatbot-message-assistant chatbot-assistant-shell'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <>
                        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-80">
                          <User className="h-3 w-3" />
                          You
                        </div>
                        <p className="chatbot-user-text whitespace-pre-wrap break-words">
                          {renderInlineText(message.content, `${message.id}-user`)}
                        </p>
                        <p className="chatbot-message-time text-right text-white/75">
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="chatbot-assistant-toolbar">
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                            <Sparkles className="h-3 w-3" />
                            Assistant
                          </div>

                          <button
                            type="button"
                            onClick={() => void copyMessage(message)}
                            className="chatbot-assistant-copy"
                            aria-label="Copy response"
                          >
                            {copiedMessageId === message.id ? (
                              <>
                                <Check className="h-3 w-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>

                        <div className="chatbot-rich-content">
                          {parseMessageBlocks(message.content).map((block, index) => {
                            if (block.type === 'paragraph') {
                              return (
                                <p key={`${message.id}-p-${index}`} className="chatbot-rich-paragraph">
                                  {renderInlineText(block.text, `${message.id}-p-${index}`)}
                                </p>
                              );
                            }

                            if (block.type === 'ul') {
                              return (
                                <ul key={`${message.id}-ul-${index}`} className="chatbot-rich-ul">
                                  {block.items.map((item, itemIndex) => (
                                    <li key={`${message.id}-uli-${itemIndex}`}>
                                      <span>{renderInlineText(item, `${message.id}-ul-${index}-${itemIndex}`)}</span>
                                    </li>
                                  ))}
                                </ul>
                              );
                            }

                            return (
                              <ol key={`${message.id}-ol-${index}`} className="chatbot-rich-ol">
                                {block.items.map((item, itemIndex) => (
                                  <li key={`${message.id}-oli-${itemIndex}`}>
                                    <span>{renderInlineText(item, `${message.id}-ol-${index}-${itemIndex}`)}</span>
                                  </li>
                                ))}
                              </ol>
                            );
                          })}
                        </div>
                        <p className="chatbot-message-time">{formatMessageTime(message.createdAt)}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="chatbot-message flex justify-start">
                  <div className="chatbot-message-assistant max-w-[75%] rounded-2xl px-3 py-2.5">
                    <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-75">
                      <Sparkles className="h-3 w-3" />
                      Assistant
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="chatbot-typing-dot" />
                      <span className="chatbot-typing-dot chatbot-typing-dot-delay" />
                      <span className="chatbot-typing-dot chatbot-typing-dot-delay-2" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200/70 bg-white/55 px-3 py-2 dark:border-slate-700/70 dark:bg-slate-900/50">
              <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                    className="chatbot-suggestion whitespace-nowrap"
                    disabled={isSending}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <form
              className="rounded-b-3xl border-t border-slate-200/70 bg-white/70 p-3 dark:border-slate-700/70 dark:bg-slate-900/65"
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage();
              }}
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Type your message..."
                  className="chatbot-input"
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={isSending || input.trim().length === 0}
                  className="chatbot-send"
                  aria-label="Send message"
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleOpen}
          className="chatbot-launcher"
          aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
          {unreadCount > 0 && !isOpen && (
            <span className="chatbot-unread">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

