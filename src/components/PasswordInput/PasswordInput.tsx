import React, { useState } from 'react';
import { EyeIcon, EyeCrossedIcon } from '../icons';

interface ChildComponentProps {
  id: string;
  label?: string,
  setPassword: (value: string) => void;
}

export const PasswordInput:React.FC<ChildComponentProps> = ({ id, label, setPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {label && (
        <label htmlFor={id} className="block">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className="!pr-30"
          id={id}
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
