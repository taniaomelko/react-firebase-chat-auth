import React, { useState } from 'react';
import { EyeIcon, EyeCrossedIcon } from '../icons';

interface ChildComponentProps {
  setPassword: (value: string) => void;
}

export const PasswordInput:React.FC<ChildComponentProps> = ({ setPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <label htmlFor="password" className="block">
        Password
      </label>
      <div className="relative">
        <input
          className="!pr-30"
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          autoComplete=""
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div 
          className="absolute top-1/2 right-10 transform -translate-y-1/2 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <EyeCrossedIcon /> : <EyeIcon />}
        </div>
      </div>
    </>
  )
}
