import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, HeartPulse } from 'lucide-react';
import { Patient, Enquiry } from '../types';

interface ChatbotProps {
  patientsList: Patient[];
  onAddEnquiry: (enquiry: Omit<Enquiry, 'id' | 'status' | 'date'>) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function Chatbot({ patientsList, onAddEnquiry }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Namaste! Welcome to Jeevan Parivartan. I am your healing assistant. How can I support you or your family member today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Generate responsive bot reply
    setTimeout(() => {
      const botReply = generateResponse(input);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 700);
  };

  const generateResponse = (text: string): string => {
    const lowercase = text.toLowerCase();

    // 1. Check if user is asking about a patient
    if (lowercase.includes('status') || lowercase.includes('patient') || lowercase.includes('progress') || lowercase.includes('check')) {
      // Look for patient name matches
      const matchedPatients = patientsList.filter(p => 
        lowercase.includes(p.name.toLowerCase().split(' ')[0]) || lowercase.includes(p.id.toLowerCase())
      );

      if (matchedPatients.length > 0) {
        const patient = matchedPatients[0];
        return `I found a record for patient ${patient.name} (${patient.id}). Current Status: "${patient.status}". They have been admitted for ${patient.daysAdmitted} days since ${patient.admitDate}. For confidential safety, please log into the Family Portal to see complete daily evaluations.`;
      }

      return 'To check a patient status, please tell me the patient first name or ID (e.g., "status Rahul" or "JP-2024-089").';
    }

    // 2. Help/Query about admissions
    if (lowercase.includes('admit') || lowercase.includes('cost') || lowercase.includes('fee') || lowercase.includes('price') || lowercase.includes('join')) {
      return 'Our standard residential recovery program is fully comprehensive. It includes supervised detox, psychiatrist counseling, meals, and natural therapy. For pricing, call us at +91 8052948863 or fill out the Request Callback form and we can customize a plan based on the severity.';
    }

    // 3. Inquire types of addiction treatment
    if (lowercase.includes('alcohol') || lowercase.includes('drug') || lowercase.includes('ganja') || lowercase.includes('tobacco') || lowercase.includes('med')) {
      return 'Yes, we provide specialized medical detox programs for alcohol, drug, cannabis (ganja), prescription meds, and tobacco addictions. Our center operates 24/7 with professional doctors. Would you like me to schedule a priority callback for you? Just say "call back [Your Name] [Your Phone]".';
    }

    // 4. Callback matching pattern "call back NAME PHONE"
    const callbackMatch = lowercase.match(/(?:call back|callback|consult|schedule)\s+([a-zA-Z\s]+)\s+(\d{10})/i);
    if (callbackMatch) {
      const name = callbackMatch[1].trim();
      const phone = callbackMatch[2].trim();
      
      onAddEnquiry({
        name,
        phone,
        age: 30,
        addictionType: 'Other',
        message: 'Quick Callback requested via chatbot assistant.',
      });

      return `Excellent! I have recorded your priority callback request for ${name} at phone number +91 ${phone}. A senior de-addiction counselor will reach out to you within 15-30 minutes. Stay strong!`;
    }

    // 5. Help, Hello, Greetings
    if (lowercase.includes('hello') || lowercase.includes('hi') || lowercase.includes('hey') || lowercase.includes('namaste')) {
      return 'Namaste! I am here to help you take the first step towards sobriety. You can ask me about "admission costs", "treatment for alcohol/drugs", "patient status", or type "callback [Name] [Phone]" to schedule a call back!';
    }

    return 'Thank you. We understand recovery can be complex. Please call our 24/7 helpline at +91 8052948863 to speak directly with an admissions coordinator, or reply with your Name and 10-digit Phone Number to schedule an immediate callback.';
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-xl shadow-teal-100/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] focus:outline-none"
        aria-label="Toggle chat assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-bounce" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 md:bottom-28 md:right-10 w-[calc(100vw-32px)] sm:w-96 h-[480px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col z-[60] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-teal-200" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm tracking-tight leading-none">Healing Assistant</h4>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-wider flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Admissions Assistant • Active
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick instructions banner */}
          <div className="bg-teal-50 text-[11px] text-teal-950 px-4 py-2 font-medium flex items-center gap-1.5 border-b border-teal-100/50">
            <HeartPulse className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
            <span>Type "callback [Name] [Phone]" to book a priority counselor call!</span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 custom-scrollbar">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-teal-700 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 mx-1">{msg.time}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="How can we help today?"
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700 focus:bg-white transition-all"
            />
            <button
              onClick={handleSend}
              className="bg-teal-700 hover:bg-teal-800 text-white p-2.5 rounded-xl transition-all shadow-md shadow-teal-100/50 flex items-center justify-center focus:outline-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
