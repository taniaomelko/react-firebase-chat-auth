import { useState, FormEvent } from 'react';
import { 
  reauthenticateWithCredential, 
  EmailAuthProvider, 
  updatePassword 
} from 'firebase/auth';
import { useAuth } from '../../firebase/authContext';

export const PasswordTab = () => {
  const { currentUser } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const reauthenticateUser = async (currentPassword: string): Promise<void> => {
    if (!currentUser || !currentUser.email) {
      throw new Error("No authenticated user found.");
    }
  
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    try {
      await reauthenticateWithCredential(currentUser, credential);
    } catch (error) {
      console.error("Error during re-authentication:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };
  
  // Function to change the user's password
  const changeUserPassword = async (newPassword: string): Promise<void> => {
    if (!currentUser) {
      throw new Error("No authenticated user found.");
    }
  
    try {
      await updatePassword(currentUser, newPassword);
      console.log("Password updated successfully.");
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
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
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await reauthenticateUser(currentPassword);
      await changeUserPassword(newPassword);
      setSuccess("Password was successfully updated.");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-20">
        <label htmlFor="currentPassword" className="text-14 font-bold">
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
          required
        />
      </div>

      <div className="mb-20">
        <label htmlFor="new-password" className="text-14 font-bold">
          New Password
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />
      </div>

      <div className="mb-20">
        <label htmlFor="confirm-password" className="text-14 font-bold">
          Confirm New Password
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
        />
      </div>

      {error && (
        <div className="mb-20 text-12 leading-10 text-red">{error}</div>
      )}
      {success && (
        <div className="mb-20 text-12 leading-10 text-green">{success}</div>
      )}

      <button 
        type="submit" 
        disabled={loading} 
        className="button"
        >
        Update password
      </button>
    </form>
  );
};
