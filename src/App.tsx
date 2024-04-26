import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './firebase/authContext';
import { Header } from './components/Header/Header';
import { Home } from './components/Home/Home';
import { Signup } from './components/Signup/Signup';
import { Login } from './components/Login/Login';
import { Profile } from './components/Profile/Profile';
import { RestorePassword } from './components/RestorePassword/RestorePassword';
import { ChangeEmail } from './components/ChangeEmail/ChangeEmail';
import { ChatBox } from './components/ChatBox/ChatBox';
 
function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/sign-up" element={<Signup />}/>
          <Route path="/log-in" element={<Login />}/>
          <Route path="/restore-password" element={<RestorePassword />}/>
          <Route path="/change-email" element={<ChangeEmail />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/chat" element={<ChatBox />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
