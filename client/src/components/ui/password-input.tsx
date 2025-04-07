import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrengthIndicator?: boolean;
}

export function PasswordInput({ className, showStrengthIndicator = true, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const calculateStrength = (password: string) => {
    let score = 0;
    
    if (!password) {
      setStrength(0);
      return;
    }

    // Length check
    if (password.length >= 8) {
      score += 1;
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    }
    
    // Number check
    if (/[0-9]/.test(password)) {
      score += 1;
    }
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    }
    
    setStrength(score);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showStrengthIndicator) {
      calculateStrength(e.target.value);
    }
    
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const getStrengthLabel = () => {
    if (strength === 0) return 'None';
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-gray-300';
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          onChange={handlePasswordChange}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
      
      {showStrengthIndicator && props.value && (
        <div className="mt-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-medium text-gray-500">
              Password strength: {getStrengthLabel()}
            </div>
            <div className="flex items-center space-x-1">
              {strength >= 4 ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs font-medium">
                {strength >= 4 ? "Good" : "Improve"}
              </span>
            </div>
          </div>
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getStrengthColor()} transition-all duration-300 ease-in-out`} 
              style={{ width: `${(strength / 5) * 100}%` }}
            />
          </div>
          
          {strength < 4 && (
            <ul className="text-xs text-gray-500 mt-1 space-y-1 list-disc pl-4">
              {!/[A-Z]/.test(props.value as string) && (
                <li>Add uppercase letter</li>
              )}
              {!/[a-z]/.test(props.value as string) && (
                <li>Add lowercase letter</li>
              )}
              {!/[0-9]/.test(props.value as string) && (
                <li>Add number</li>
              )}
              {!/[^A-Za-z0-9]/.test(props.value as string) && (
                <li>Add special character</li>
              )}
              {(props.value as string).length < 8 && (
                <li>Use at least 8 characters</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}