# jsramverk-project

## Installation
``npm install``  
Installerar samtliga moduler.

## Körning
``npm start``  
Kör en development server på port 3000.

``npm test``  
Bygger och serverar frontend medans tester körs. Kräver API och Socket server lokalt på port 1337 och 3001 respektive.

## Val av teknik
- React  
Jag valde React då jag har jobbat med det hela kursen och kännde inte att det var särskilt svårt att börja med ett nytt ramverk för projektet. Mitt frontend är strukturerat i Routes, Models och Components. Routes är vad man förväntar sig och är mappad till en direkt URL med React.Router och React.Route. Modeller är direkt kopplat till statisk data, config innehåller URL:er för API och socket medans auth innehåller data kopplat till den inloggade användaren. Components är olika komponenter som inkluderas på sidor, i mitt fall har jag 3 stycken components för modal-fönster.

- react-charts  
För att visa upp priser i en graf så använder jag react-charts. Jag valde react-charts då det är byggt för React och har stöd för att uppdatera innehållet dynamiskt och det verkade rätt så lätt att använda.

## Tester
### Use-cases
- Index `/` skall finnas  
Ladda in sidan och se till att man hamnar på index och att URL:en matchar `/`.

- Skall gå att navigera till `/register`  
Ladda in på sidan och navigera till `/register` genom att först navigera igenom `/login` i navbaren. Se till att URL:en matchar `/register`.

- Skall gå att hitta en lista med samtliga aktier  
Ladda in på sidan och navigera till `/invest` genom navbaren. Se till att URL:en matchar `/invest`.

- Skall gå att hitta en specifik aktie i listan av aktier.  
Ladda in sidan och navigera genom `/invest` i navbaren och tryck sedan på en specifik aktie. Kolla så att det finns en header som matchar den aktien som trycktes.

- Skall gå att navigera tillbaka till första sidan genom en länk.  
Ladda in sidan och navigera genom `/invest` till en specifik aktie och navigera sedan tillbaka till `/` genom navbaren. Kolla så att URL:en matchar `/`.