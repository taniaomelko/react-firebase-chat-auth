import './App.scss';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { AuthProvider } from './firebase/authContext';
import { Root } from './components/Root/Root';
import { Signup } from './components/Signup/Signup';
import { Login } from './components/Login/Login';
import { Profile } from './components/Profile/Profile';
import { RestorePassword } from './components/RestorePassword/RestorePassword';
import { ChangeEmail } from './components/ChangeEmail/ChangeEmail';
import { ChatBox } from './components/ChatBox/ChatBox';
 
function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={ <Root/> }>
      <Route path="sign-up" element={<Signup />}/>
      <Route path="log-in" element={<Login />}/>
      <Route path="restore-password" element={<RestorePassword />}/>
      <Route path="change-email" element={<ChangeEmail />}/>
      <Route path="profile" element={<Profile />}/>
      <Route path="chat" element={<ChatBox />} />
    </Route>
    ), {
      basename: process.env.PUBLIC_URL
    }
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
