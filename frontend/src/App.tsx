// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// src/App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.tsx';
import Login from './pages/Login.tsx';
import Register from "./pages/Register.tsx";
import Home from './pages/Home.tsx';
import QuizList from './pages/QuizList.tsx';
import CreateQuiz from './pages/CreateQuiz.tsx';
import Quizzes from './pages/Quizzes.tsx';
import QuizDetails from './pages/QuizDetails.tsx';
import TakeQuiz from './pages/TakeQuiz.tsx';
import QuizResult from './pages/QuizResult.tsx';
import Leaderboard from './pages/Leaderboard.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz/details/:id" element={<QuizDetails />} />
        <Route path="/quiz/take/:id" element={<TakeQuiz />} />
        <Route path="/result/:id" element={<QuizResult />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin/quizzes" element={<QuizList />} />
        <Route path="/admin/quiz/create" element={<CreateQuiz />} />
      </Routes>
    </Router>
  );
};

export default App;