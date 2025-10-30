# Lab1_WWSI_TI

Instrukcja inicjalizacji strony projektu "Mała biblioteka"

# Instalacja Node.js na hoście.
Lab1_WWSI_TI> node --version
v22.12.0

# Instalacja wszystkich potrzebnych modułów.
Lab1_WWSI_TI> npm install

# Wygenerowanie bazy danych.
Lab1_WWSI_TI> npx prisma migrate dev --name init

# Uruchomienie serwera NodeJS.
Lab1_WWSI_TI> npm run dev

# Strona znajduje się pod podanym w terminalu adresem.
Library API running on http://localhost:3000
