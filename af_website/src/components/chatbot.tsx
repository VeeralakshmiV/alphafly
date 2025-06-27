import React, { useState } from 'react';
import './chatbot.css';

const courses = [
    "Web Development",
    "Data Science",
    "UI/UX Design",
    "Cloud Computing",
    "Cyber Security"
];

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<{ sender: string, text: string }[]>(
        [{ sender: 'bot', text: "Hi! 👋 I'm your course enquiry assistant. What course are you interested in?" }]
    );
    const [input, setInput] = useState('');
    const [step, setStep] = useState<'askCourse' | 'askName' | 'askEmail' | 'done'>('askCourse');
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { sender: 'user', text: input }]);
        if (step === 'askCourse') {
            const found = courses.find(
                c => c.toLowerCase() === input.trim().toLowerCase()
            );
            if (found) {
                setSelectedCourse(found);
                setTimeout(() => {
                    setMessages(msgs => [
                        ...msgs,
                        { sender: 'bot', text: `Great choice! What's your name?` }
                    ]);
                }, 500);
                setStep('askName');
            } else {
                setTimeout(() => {
                    setMessages(msgs => [
                        ...msgs,
                        { sender: 'bot', text: `Sorry, we don't have that course. Available courses: ${courses.join(', ')}` }
                    ]);
                }, 500);
            }
        } else if (step === 'askName') {
            setUserName(input.trim());
            setTimeout(() => {
                setMessages(msgs => [
                    ...msgs,
                    { sender: 'bot', text: `Thanks, ${input.trim()}! Please provide your email address.` }
                ]);
            }, 500);
            setStep('askEmail');
        } else if (step === 'askEmail') {
            setTimeout(() => {
                setMessages(msgs => [
                    ...msgs,
                    { sender: 'bot', text: `Thank you, ${userName}! We have received your enquiry for "${selectedCourse}". Our team will contact you at ${input.trim()} soon.` }
                ]);
            }, 500);
            setStep('done');
            setInput('');
        }
    };

    const handleCourseClick = (course: string) => {
        setMessages([...messages, { sender: 'user', text: course }]);
        setSelectedCourse(course);
        setTimeout(() => {
            setMessages(msgs => [
                ...msgs,
                { sender: 'bot', text: `Great choice! What's your name?` }
            ]);
        }, 500);
        setStep('askName');
        setInput('');
    };

    return (
        <div
            className="chatbot-sticky-container"
            style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 9999,
                maxWidth: '90vw',
                width: 340,
                boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
                borderRadius: 12,
                background: '#fff',
                transition: 'all 0.3s',
                ...(open ? { height: 420 } : { height: 60, width: 60, padding: 0, overflow: 'hidden' })
            }}
        >
            {!open ? (
                <button
                    aria-label="Open chatbot"
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: '#007bff',
                        color: '#fff',
                        border: 'none',
                        fontSize: 28,
                        cursor: 'pointer'
                    }}
                    onClick={() => setOpen(true)}
                >
                    💬
                </button>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{
                        background: '#007bff',
                        color: '#fff',
                        padding: '12px 16px',
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span>Course Enquiry</span>
                        <button
                            aria-label="Close chatbot"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                fontSize: 20,
                                cursor: 'pointer'
                            }}
                            onClick={() => setOpen(false)}
                        >×</button>
                    </div>
                    <div className="chatbot-messages" style={{
                        flex: 1,
                        padding: 12,
                        overflowY: 'auto',
                        background: '#f8f9fa'
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chatbot-message ${msg.sender}`}>
                                <span>{msg.text}</span>
                            </div>
                        ))}
                        {step === 'askCourse' && (
                            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {courses.map(course => (
                                    <button
                                        key={course}
                                        style={{
                                            padding: '4px 10px',
                                            borderRadius: 6,
                                            border: '1px solid #007bff',
                                            background: '#fff',
                                            color: '#007bff',
                                            cursor: 'pointer',
                                            fontSize: 13
                                        }}
                                        onClick={() => handleCourseClick(course)}
                                    >
                                        {course}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {step !== 'done' && (
                        <div className="chatbot-input" style={{
                            display: 'flex',
                            borderTop: '1px solid #eee',
                            padding: 8,
                            background: '#fff'
                        }}>
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder={
                                    step === 'askCourse'
                                        ? 'Type course name or select...'
                                        : step === 'askName'
                                            ? 'Enter your name...'
                                            : step === 'askEmail'
                                                ? 'Enter your email...'
                                                : ''
                                }
                                style={{
                                    flex: 1,
                                    padding: 6,
                                    border: '1px solid #ccc',
                                    borderRadius: 4,
                                    fontSize: 15
                                }}
                                disabled={step === 'done'}
                            />
                            <button
                                onClick={handleSend}
                                style={{
                                    marginLeft: 8,
                                    padding: '6px 14px',
                                    border: 'none',
                                    background: '#007bff',
                                    color: '#fff',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    fontSize: 15
                                }}
                                disabled={step === 'done'}
                            >
                                Send
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Chatbot;
