"use client";

import React, { useEffect, useRef, useState } from "react";
import { UIMessage, useChat } from "@ai-sdk/react";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { useSchematicFlag } from "@schematichq/schematic-react";
import { FeatureFlag } from "@/features/flags";
import { ImageIcon, LetterText, PenIcon } from "lucide-react";

export default function AiAgentChat({ videoId }: { videoId: string }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        videoId,
      },
    }),
    // maxSteps: 5,
  });

  const bottomRef = useRef<HTMLDivElement>(null)
  const messageContainerRef = useRef<HTMLDivElement>(null)

  const user = useUser();

  const isScriptGenerationEnabled = useSchematicFlag(
    FeatureFlag.SCRIPT_GENERATION
  );
  const isImageGenerationEnabled = useSchematicFlag(
    FeatureFlag.IMAGE_GENERATION
  );

  const isTitleGenerationEnabled = useSchematicFlag(
    FeatureFlag.TITLE_GENERATION
  );

  const isVideoAnalysisEnabled = useSchematicFlag(FeatureFlag.ANALYZE_VIDEO);

  const generateScript = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);

    const userMessage: UIMessage = {
      id: `generate-script-${randomId}`,
      role: "user",
      parts: [
        {
          type: "text",
          text: "Generate a step-by-step shooting script for this video that I can use on my own channel to produce a video that is similar to this one, don't do any other steps such as generating an image, just generate the script only!",
        },
      ],
    };

    sendMessage(userMessage);
  };

  const generateTitle = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);

    const userMessage: UIMessage = {
      id: `generate-script-${randomId}`,
      role: "user",
      parts: [{ type: "text", text: "Generate a title for this video." }],
    };

    sendMessage(userMessage);
  };

  const generateImage = async () => {
    const randomId = Math.random().toString(36).substring(2, 15);

    const userMessage: UIMessage = {
      id: `generate-script-${randomId}`,
      role: "user",
      parts: [{ type: "text", text: "Generate a thumbnail for this video." }],
    };

    sendMessage(userMessage);
  };

  useEffect(()=>{
    if(bottomRef.current && messageContainerRef.current){
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }, [messages])

  console.log("isScriptGenerationEnabled: ", isScriptGenerationEnabled);

  return (
    <div className="flex flex-col h-full">
      <div className="hidden lg:block px-4 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Alpha Romeo</h2>
      </div>

      {/* Messages  */}
      <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-gray-700">
                  Hola {user.user?.firstName}, I&apos;m Alpha Romeo.
                </h3>
                <p className="text-sm text-gray-500">
                  Ask any question about your video.
                </p>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] ${m.role === "user" ? "bg-blue-500" : "bg-gray-100"} rounded-2xl px-4 py-2`}
              >
                {m.parts && m.role === "assistant" ? (
                  <div className="space-y-3">
                    {m.parts.map((part, index) => {
                      //   part.type === "text" ? (
                      //     <div key={index} className="prose prose-sm max-w-none">
                      //       <ReactMarkdown key={index}>{part.text}</ReactMarkdown>
                      //     </div>
                      //   ) : <div key={index} className="prose prose-sm max-w-none">
                      //   <ReactMarkdown key={index}>{part.type}</ReactMarkdown>
                      // </div>
                      switch (part.type) {
                        case "text":
                          return (
                            <div
                              key={index}
                              className="prose prose-sm max-w-none"
                            >
                              <ReactMarkdown key={index}>
                                {part.text}
                              </ReactMarkdown>
                            </div>
                          );
                        case "tool-fetchTranscript":
                          return (
                            <div className="h-60 overflow-y-scroll">
                              <pre
                                key={`${m.id}-${index}`}
                                className="bg-gray-50 p-5 overflow-x-scroll my-3 rounded-lg"
                              >
                                {JSON.stringify(part, null, 2)}
                              </pre>
                            </div>
                          );
                        case "tool-getVideoDetails":
                          return (
                            <div className="h-60 overflow-y-scroll">
                              <pre
                                key={`${m.id}-${index}`}
                                className="bg-gray-50 p-5 overflow-x-scroll my-3 rounded-lg"
                              >
                                {JSON.stringify(part, null, 2)}
                              </pre>
                            </div>
                          );
                      }
                    })}
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-white">
                    {m.parts.map((part, index) =>
                      part.type === "text" ? (
                        <ReactMarkdown key={index}>{part.text}</ReactMarkdown>
                      ) : null
                    )}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>
            // <div key={m.id} className="">
            //     <div className='flex gap-3'>
            //         <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center'>
            //             {m.role === "user" ? "U" : "A"}
            //         </div>
            //         <div className='flex-1'>
            //             <p className='font-semibold'>
            //                 {m.role === 'user' ? 'You' : 'Alpha Romeo'}
            //             </p>
            //             {m.parts.map((part, index) => part.type === "text" ? <span key={index}>{part.text}</span> : null)}
            //         </div>
            //     </div>
            // </div>
          ))}
        </div>
      </div>

      {/* Input Form  */}
      <div className="border-t border-gray-100 p-4 bg-white">
        <div className="space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage({ text: input });
                setInput("");
              }
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder={
                !isVideoAnalysisEnabled
                  ? "Upgrade to ask questions about your video."
                  : "Type your question..."
              }
              className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                status === "streaming" ||
                status === "submitted" ||
                !isImageGenerationEnabled
              }
            >
              {status === "streaming"
                ? "I am replying..."
                : status === "submitted"
                  ? "I am thinking"
                  : "Ask"}
            </Button>
          </form>

          <div className="flex gap-2">
            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateScript}
              disabled={!isScriptGenerationEnabled}
              type="button"
            >
              <LetterText className="w-4 h-4" />
              {isScriptGenerationEnabled ? (
                <span>Generate Script</span>
              ) : (
                <span>Upgrade to generate script</span>
              )}
            </button>
            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateTitle}
              disabled={!isTitleGenerationEnabled}
              type="button"
            >
              <PenIcon className="w-4 h-4" />
              {isTitleGenerationEnabled ? (
                <span>Generate Title</span>
              ) : (
                <span>Upgrade to generate title</span>
              )}
            </button>
            <button
              className="text-xs xl:text-sm w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateImage}
              disabled={!isImageGenerationEnabled}
              type="button"
            >
              <ImageIcon className="w-4 h-4" />
              {isImageGenerationEnabled ? (
                <span>Generate image</span>
              ) : (
                <span>Upgrade to generate image</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
