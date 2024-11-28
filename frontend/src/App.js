import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Chatbot from './components/Chatbot';

const App = () => {
	const [messages, setMessages] = useState([
		{
			sender: 'bot',
			text: 'Witaj! Jestem Twoim wirtualnym asystentem. Mozesz w prosty sposob zarezerwowac stolik!:)',
		},
	]);

	return (
		<div className="bg-[#0d1321]">
			<Header setMessages={setMessages} />
			<Chatbot messages={messages} setMessages={setMessages} />
		</div>
	);
};

export default App;
