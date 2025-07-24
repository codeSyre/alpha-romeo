"use client"

import React, { useState } from 'react'
import { useChat } from '@ai-sdk/react';
import { useUser } from '@clerk/nextjs';
import { Button } from './ui/button';
import { DefaultChatTransport } from 'ai';
import ReactMarkdown from 'react-markdown';

export default function AiAgentChat({ videoId }: { videoId: string }) {
    const [input, setInput] = useState("");
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
            body: {
                videoId
            },
        }),
        maxSteps: 5
    });

    const user = useUser()

    return (
        <div className='flex flex-col h-full'>
            <div className='hidden lg:block px-4 pb-3 border-b border-gray-100'>
                <h2 className='text-lg font-semibold text-gray-800'>
                    Alpha Romeo
                </h2>
            </div>

            {/* Messages  */}
            <div className='flex-1 overflow-y-auto p-4'>
                <div className='space-y-6'>
                    {messages.length === 0 && (
                        <div className='flex items-center justify-center h-full min-h-[200px]'>
                            <div className='text-center space-y-2'>
                                <h3 className='text-lg font-medium text-gray-700'>
                                    Hola {user.user?.firstName}, I'm Alpha Romeo.
                                </h3>
                                <p className='text-sm text-gray-500'>
                                    Ask any question about your video.
                                </p>
                            </div>
                        </div>
                    )}

                    {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] ${m.role === "user" ? "bg-blue-500" : "bg-gray-100"} rounded-2xl px-4 py-2`}>
                                {m.parts && m.role === "assistant" ? (
                                    <div className='space-y-3'>
                                        {m.parts.map((part, index) => part.type === "text" ?
                                            <div className='prose prose-sm max-w-none'>
                                                <ReactMarkdown key={index}>{part.text}</ReactMarkdown>
                                            </div> : null)}
                                    </div>
                                ) : (
                                    <div className='prose prose-sm max-w-none text-white'>
                                        {m.parts.map((part, index) => part.type === "text" ? <ReactMarkdown key={index}>{part.text}</ReactMarkdown> : null)}
                                    </div>
                                )}
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
            <div className='border-t border-gray-100 p-4 bg-white'>
                <div className='space-y-3'>
                    <form onSubmit={e => {
                        e.preventDefault();
                        if (input.trim()) {
                            sendMessage({ text: input })
                            setInput('')
                        }
                    }} className='flex gap-2'>
                        <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder='Type your question...' className='flex-1 px-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                        <Button type='submit' className='px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>Ask</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
