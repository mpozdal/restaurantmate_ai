const email_template = (data) => {
	return `
    Szanowny Panie/Pani ${data?.name},  
    
    Dziękujemy za dokonanie rezerwacji w naszej restauracji. Z przyjemnością potwierdzamy szczegóły Państwa rezerwacji:  
    
    - **Data**: ${data?.date}
    - **Godzina**: ${data?.time}
    - **Liczba osób**: ${data?.number} 
     
    Czekamy na Państwa wizytę i życzymy przyjemnego pobytu w naszej restauracji!      
    `;
};

const email_template_html = (data) => {
	return `
    <!DOCTYPE html>
<html>
<body>
    <p>Szanowny Panie/Pani <b>${data?.name}</b>,</p>
    <p>Dziękujemy za dokonanie rezerwacji w naszej restauracji. Z przyjemnością potwierdzamy szczegóły Państwa rezerwacji:</p>
    <ul>
        <li><b>Data:</b> ${data?.date}</li>
        <li><b>Godzina:</b> ${data?.time}</li>
        <li><b>Liczba osób:</b> ${data?.number}</li>
    </ul>
    <p>Czekamy na Państwa wizytę i życzymy przyjemnego pobytu w naszej restauracji!</p>
   
</body>
</html>
 
    `;
};

module.exports = { email_template, email_template_html };
