# Lab1_WWSI_TI

Instrukcja inicjalizacji strony projektu "Mała biblioteka"

# Instalacja Node.js na hoście (tu jest już zainstalowany).
> node --version
v22.12.0

# Instalacja wszystkich potrzebnych modułów.
> npm install

# Wygenerowanie bazy danych.
> npx prisma migrate dev --name init

# Uruchomienie serwera NodeJS.
> npm run dev

# Strona znajduje się pod podanym w terminalu adresem.
Library API running on http://localhost:3000
