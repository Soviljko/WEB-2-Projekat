# KvizHub

Web aplikacija za kreiranje i rešavanje kvizova sa sistemom bodovanja i rang listom.

## Tehnologije

**Backend:**
- ASP.NET Core 8.0 Web API
- Entity Framework Core (Code First)
- SQL Server
- JWT Bearer Authentication
- BCrypt za heširanje lozinki

**Frontend:**
- React 19.1.1 sa TypeScript
- React Router DOM
- Axios
- CSS

## Preduslov

- .NET 8.0 SDK
- Node.js (v18 ili noviji)
- SQL Server

## Pokretanje projekta

### 1. Backend

Navigirajte u Backend folder:
```bash
cd Backend/Backend
```

Proverite connection string u `appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=KvizHubDb;Trusted_Connection=True;TrustServerCertificate=True"
}
```

Kreirajte bazu podataka:
```bash
dotnet ef database update
```

Pokrenite server:
```bash
dotnet run
```

API će biti dostupan na `http://localhost:5132`

### 2. Frontend

Navigirajte u frontend folder:
```bash
cd frontend
```

Instalirajte pakete:
```bash
npm install
```

Pokrenite React aplikaciju:
```bash
npm start
```

Aplikacija će biti dostupna na `http://localhost:3000`

## Funkcionalnosti

### Korisnik
- Registracija i login
- Pregled dostupnih kvizova
- Rešavanje kvizova sa različitim tipovima pitanja (jednokratni izbor, višestruki izbor, unos teksta)
- Pregled sopstvenih rezultata
- Rang lista po kvizovima

### Administrator
- Sve funkcionalnosti korisnika
- Kreiranje kvizova sa pitanjima i opcijama
- Dodavanje različitih tipova pitanja
- Dodavanje bodova za svako pitanje
- Pregled svih rezultata svih korisnika

## Test nalozi

Nakon pokretanja, možete kreirati admin i korisničke naloge preko registracije.

Primer:
- **Email**: admin@test.com
- **Username**: admin
- **Password**: admin123

Da biste postavili korisnika kao admina, potrebno je u bazi podataka ručno promeniti `Role` kolonu u `Users` tabeli na vrednost `"Admin"`.

## API Endpoints

### Auth
- `POST /api/auth/register` - Registracija
- `POST /api/auth/login` - Prijava

### Quiz
- `GET /api/quiz` - Svi kvizovi
- `GET /api/quiz/{id}` - Detalji kviza
- `POST /api/quiz` - Kreiranje kviza (Admin)

### Result
- `POST /api/result` - Slanje rezultata
- `GET /api/result/{id}` - Detalji rezultata
- `GET /api/result/user` - Rezultati trenutnog korisnika
- `GET /api/result/leaderboard/{quizId}` - Rang lista za kviz
- `GET /api/result/all` - Svi rezultati (Admin)

## Struktura projekta

```
Backend/
  └── Backend/
      ├── Controllers/          # API kontroleri
      ├── Models/               # Domain modeli
      ├── Services/             # Biznis logika
      │   └── Interfaces/       # Service interfejsi
      ├── DTOs/                 # Data Transfer Objects
      ├── Data/                 # DbContext i konfiguracija
      └── Program.cs            # Konfiguracija aplikacije

frontend/
  └── src/
      ├── pages/                # React stranice
      ├── components/           # React komponente
      ├── services/             # API pozivi (Axios)
      ├── styles/               # CSS stilovi
      └── api/                  # Axios konfiguracija
```

## Baza podataka

Entiteti:
- **User** - Korisnici (Username, Email, Password, Role)
- **Quiz** - Kvizovi (Title, Description)
- **Question** - Pitanja (Text, Type, Points)
- **Option** - Opcije odgovora (Text, IsCorrect)
- **Result** - Rezultati kvizova (Score, TimeSpent)
- **Answer** - Odgovori korisnika
