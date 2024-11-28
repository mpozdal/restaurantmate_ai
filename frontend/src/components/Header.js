import React from 'react';

function Header({ setMessages }) {
	return (
		<div className="container p-4 lg:max-w[1440px] gap-5 text-white bg-[#0d1321] font-extrabold text-2xl h-[10vh] flex justify-left items-center">
			RestaurantMate AI
			<button
				onClick={() =>
					setMessages([
						{
							sender: 'bot',
							text: 'Witaj! Jestem Twoim wirtualnym asystentem. Mozesz w prosty sposob zarezerwowac stolik!:)',
						},
					])
				}
			>
				<i className="fa-solid text-xl fa-arrow-up-right-from-square hover:opacity-60 transition"></i>
			</button>
		</div>
	);
}

export default Header;
