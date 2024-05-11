# Projektuppgift i kursen DT207G, Back-end.
*Anton Eriksson, aner2308*

Denna README-fil dokumenterar funktionaliteten för min webbapplikation. Applikationen är ett enklare REST API för hantering av inloggning och registrering av användare, samt inläsning och redigering av menyobjekt till en restaurang.

## Beskrivning
Min webbapplikation är uppbyggd med två delar, separerade med olika models och routes. Dessa två delar är:
1. Inloggning och registrering. Det tillåter restaurangen att registrera admin-konton för att logga in och få åtkomst till skyddade resurser med hjälp av JSON Web Tokens (JWT).
2. GET, POST, PUT, och DELETE routes för att ändra i restaurangens meny. GET-routen har åtkomst utan JWT web token. För alla andra routes krävs inloggning för att komma åt.

## Länk till liveversion av API:et
[Liveversion av API](https://projektapi-backend2.onrender.com)

## Installation
API:et använder en MongoDB-databas med Mongoose. Följ stegen nedan för installation:

1. Klona detta repo till din lokala maskin.
2. Installera alla dependencies genom att köra `npm install`.
3. Konfigurera miljövariabler genom att skapa en `.env`-fil och fylla i nödvändig information enligt `.env.sample`.
4. Se till att ha en MongoDB-databas tillgänglig och konfigurera anslutningsinformationen i `.env`-filen.

## Användning
För att använda API:et kan du skicka förfrågningar till de olika endpoints för registrering, inloggning och åtkomst till skyddade resurser. Efter inloggning får du ett aktivt JWT. Du kan då använda dig av POST, PUT, och DELETE. Se dokumentationen för API:et för att få mer information om varje endpoint och hur de ska användas.

## Dependencies
- bcrypt: ^5.1.1
- body-parser: ^1.20.2
- dotenv: ^16.4.5
- express: ^4.19.2
- jsonwebtoken: ^9.0.2
- mongoose: ^8.3.3
- nodemon: ^3.1.0
- router: ^1.3.8
