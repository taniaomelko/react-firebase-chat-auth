import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogoIcon, ProfileIcon } from '../icons';
import { useAuth } from '../../firebase/authContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

export const Header = () => {
  const { currentUser, userLoggedIn  } = useAuth(); 

  const photoURL = currentUser?.photoURL;
  const [imgError, setImgError] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    setProfileMenuVisible(false);
  }, [userLoggedIn]);
  
  useEffect(() => {
    setImgError(false);
  }, [photoURL]);  

  useEffect(() => {
    const handleClickOutside: EventListener = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuVisible]);

  const logOut = async() => {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const toggleProfileMenu = () => {
    setProfileMenuVisible(!isProfileMenuVisible);
  }

  const goToProfile = () => {
    setProfileMenuVisible(false);
    navigate('/profile');
  }

  const goToChat = () => {
    setProfileMenuVisible(false);
    navigate('/chat');
  }

  return (
    <header className="sticky top-0 left-0 right-0 py-[10px] shadow-small">
      <div className="container">
        <div className="w-full flex justify-between gap-20">
          <Link to="/">
            <LogoIcon />
          </Link>

          {userLoggedIn ? (
            <div ref={profileMenuRef}>
              <div 
                className="relative cursor-pointer transition duration-300 hover:text-cyan" 
                onClick={toggleProfileMenu}
              >
                {photoURL && !imgError ? (
                  <img 
                    className="w-30 h-30 rounded-full" 
                    src={photoURL} 
                    alt="Profile" 
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <ProfileIcon className="w-30 h-30" />
                )}
              </div>

              {isProfileMenuVisible && (
                <div className="absolute top-full right-0 p-20 w-[200px] bg-white rounded shadow-small">
                  <div className="grid gap-10">
                    <div className="link !w-full" onClick={goToProfile}>Profile</div>
                    <div className="link !w-full" onClick={goToChat}>Chat</div>
                    <div className="link !w-full" onClick={logOut}>Log out</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/log-in">Log in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
