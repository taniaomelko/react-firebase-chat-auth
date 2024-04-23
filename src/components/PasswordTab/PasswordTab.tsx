import { useState, useEffect, FormEvent } from 'react';
import { 
  reauthenticateWithCredential, 
  EmailAuthProvider, 
  updatePassword 
} from 'firebase/auth';
import { useAuth } from '../../firebase/authContext';
import { PasswordInput } from '../PasswordInput/PasswordInput';
import './PasswordTab.scss'
import { LoaderIcon } from '../icons';

export const PasswordTab = () => {
  const { currentUser } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (currentPassword && newPassword && confirmPassword) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [confirmPassword, currentPassword, newPassword]);

  const reauthenticateUser = async (currentPassword: string): Promise<void> => {
    if (!currentUser || !currentUser.email) {
      throw new Error("No authenticated user found.");
    }
  
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);

    reauthenticateWithCredential(currentUser, credential)
      .then(() => {
        updatePassword(currentUser, newPassword)
          .then(() => {
            setSuccess("Password was successfully updated.");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          })
          .catch((error) => {
            switch (error.code) {
              case 'auth/weak-password':
                setError('The new password is too weak. Please choose a stronger password.');
                break;
              case 'auth/requires-recent-login':
                setError('This operation is sensitive and requires recent authentication. Please log in again before retrying this request.');
                break;
              default:
                setError('Failed to update password. Please try again.');
            }
          })
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/wrong-password':
            setError('The password is incorrect. Please try again.');
            break;
          case 'auth/user-mismatch':
            setError('The provided user does not match the current user.');
            break;
          case 'auth/user-not-found':
            setError('No user found with this email.');
            break;
          case 'auth/too-many-requests':
            setError('Too many attempts. Please try again later.');
            break;
          default:
            setError('Failed to reauthenticate. Please try again.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!newPassword && !confirmPassword) {
      setError("Please enter a new password.");
      setLoading(false);
      return;
    };

    if (newPassword !== confirmPassword) {
      setError("Your new password and confirmation password do not match. Please ensure both fields are identical and try again.");
      setLoading(false);
      return;
    }

    await reauthenticateUser(currentPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-20">
        <PasswordInput id="current-password" label="Current Password" setPassword={setCurrentPassword} />
      </div>

      <div className="mb-20">
        <PasswordInput id="new-password" label="New Password" setPassword={setNewPassword} />
      </div>

      <div className="mb-20">
        <PasswordInput id="confirm-password" label="Confirm New Password" setPassword={setConfirmPassword} />
      </div>

      {error && (
        <div className="mb-20 text-12 leading-10 text-red">{error}</div>
      )}
      {success && (
        <div className="mb-20 text-12 leading-10 text-green">{success}</div>
      )}

      <div className="flex items-center gap-10">
        <button 
          type="submit" 
          disabled={disabled} 
          className="button"
          >
          Update Password
        </button>

          {loading && (
            <LoaderIcon className="animate-spin text-cyan" />
          )}
      </div>
    </form>
  );
};
