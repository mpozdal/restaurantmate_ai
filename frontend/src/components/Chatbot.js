import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ThreeDot } from 'react-loading-indicators';
const Chatbot = ({ messages, setMessages }) => {
	const [input, setInput] = useState('');

	const messagesEndRef = useRef(null);

	const handleSendMessage = async () => {
		if (!input.trim()) return;

		const userMessage = { sender: 'user', text: input };
		setMessages((prevMessages) => [...prevMessages, userMessage]);

		try {
			const response = await axios.post(
				'http://localhost:5001/dialogflow',
				{
					query: input,
					sessionId: 'unique-session-id', // Generuj unikalne ID sesji
				}
			);
			console.log(response);
			const botMessage = {
				sender: 'bot',
				text: response?.data?.response,
			};
			setMessages((prevMessages) => [...prevMessages, botMessage]);
		} catch (error) {
			console.error('Error communicating with chatbot:', error);
			const errorMessage = {
				sender: 'bot',
				text: 'Przepraszam, coś poszło nie tak.',
			};
			setMessages((prevMessages) => [...prevMessages, errorMessage]);
		}

		setInput('');
	};

	// Funkcja do obsługi naciskania Enter
	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault(); // Zapobiega domyślnej akcji (np. przesunięcie na nową linię)
			handleSendMessage(); // Wywołuje funkcję wysyłania wiadomości
		}
	};

	// Funkcja do przewijania na dół po każdej zmianie wiadomości
	useEffect(() => {
		// Przewijanie do ostatniej wiadomości po każdej zmianie w tablicy wiadomości
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]); // Ta funkcja będzie wywoływana, gdy zmieni się tablica messages

	return (
		<div className="flex flex-col h-[90vh] bg-[#0d1321] text-white">
			<div className="flex-1 overflow-auto p-4 space-y-4 custom-scrollbar">
				{messages.map((message, index) => (
					<div
						key={index}
						className={`flex ${
							message.sender === 'user'
								? 'justify-end'
								: 'justify-start'
						}`}
					>
						<div
							className={`max-w-[50%] px-5 py-2 rounded-full ${
								message.sender === 'user'
									? 'bg-[#748cab]'
									: 'bg-gray-700'
							}`}
						>
							{message.text}
						</div>
					</div>
				))}
				{/* Ref do przewijania na dół */}
				<div ref={messagesEndRef} />
			</div>

			<div className="flex p-4 border-t border-gray-700">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown} // Dodane nasłuchiwanie na klawisz Enter
					className="flex-1 p-2 rounded-l-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none"
					placeholder="Napisz wiadomość..."
				/>
				<button
					onClick={handleSendMessage}
					className="p-2 px-4 bg-[#748cab] text-white rounded-r-lg hover:bg-blue-900 focus:outline-none"
				>
					<i className="fa-solid fa-arrow-right"></i>
				</button>
			</div>
		</div>
	);
};

export default Chatbot;
