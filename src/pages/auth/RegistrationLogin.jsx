// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Telescope, UserSquare, Mail, Lock, Eye, EyeOff, Badge, Calendar } from 'lucide-react';
// import './RegistrationLogin.css';
// import logved from './logved.mp4';

// const API_BASE = "http://localhost:5000/api/v1/auth"; 

// const RegistrationLogin = () => {
//   const navigate = useNavigate();
//   const [currentView, setCurrentView] = useState('login');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     age: '',
//     experience: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     wantsResearcher: false
//   });

//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));

//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (currentView === 'register') {
//       if (!formData.fullName.trim()) {
//         newErrors.fullName = 'Full name is required';
//       }
//       if (!formData.age || formData.age < 1 || formData.age > 120) {
//         newErrors.age = 'Please enter a valid age';
//       }
//       if (!formData.experience) {
//         newErrors.experience = 'Please select your experience';
//       }
//       if (formData.password.length < 6) {
//         newErrors.password = 'Password must be at least 6 characters';
//       }
//       if (formData.password !== formData.confirmPassword) {
//         newErrors.confirmPassword = 'Passwords do not match';
//       }
//     }

//     if (!formData.email.trim() || !formData.email.includes('@')) {
//       newErrors.email = 'Please enter a valid email address';
//     }
//     if (!formData.password.trim()) {
//       newErrors.password = 'Password is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
//     setIsLoading(true);

//     try {
//       let url = `${API_BASE}/login`;
//       let body = {
//         email: formData.email,
//         password: formData.password
//       };

//       if (currentView === 'register') {
//         url = `${API_BASE}/register`;
//         body = {
//           fullName: formData.fullName,
//           age: formData.age,
//           experience: formData.experience,
//           email: formData.email,
//           password: formData.password,
//           wantsResearcher: formData.wantsResearcher
//         };
//       }

//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Request failed');
//       }

//       const data = await response.json();

//       if (currentView === 'register') {
//         alert(`Registration successful! Welcome ${data.user.fullName || ''}`);
//         setCurrentView('login'); 
//         return;
//       }

//       if (currentView === 'login') {
//         localStorage.setItem("token", data.token);
//         alert(data.message || "Login successful!");
//         navigate("/Explora/home"); 
//       }

//     } catch (error) {
//       console.error("Error:", error);
//       alert(error.message || "Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const switchView = () => {
//     setCurrentView(currentView === 'login' ? 'register' : 'login');
//     setErrors({});
//     setFormData({
//       fullName: '',
//       age: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       wantsResearcher: false
//     });
//   };

//   return (
//     <div className="rl-container">
//       {/* الفيديو الخلفية */}
//       <video autoPlay loop muted playsInline className="rl-video-bg">
//         <source src={logved} type="video/mp4" />
//       </video>

//       <div className="rl-overlay"></div>

//       <div className="rl-box">
//         {/* Header */}
//         <div className="rl-header">
//           <div className="rl-logo">
//             <Telescope className="rl-icon" />
//             <h1 className="rl-title">Cosmic Canvas</h1>
//           </div>
//           <p className="rl-subtitle">
//             {currentView === 'login' ? 'Welcome back, explorer!' : 'Join the space exploration community'}
//           </p>
//         </div>

//         {/* Form */}
//         <div className="rl-form">
//           {currentView === 'register' && (
//             <div className="rl-field">
//               <label className="rl-label">
//                 <UserSquare className="rl-label-icon" /> Full Name 
//               </label>
//               <input
//                 type="text"
//                 value={formData.fullName}
//                 onChange={(e) => handleInputChange('fullName', e.target.value)}
//                 className={`rl-input ${errors.fullName ? 'rl-error' : ''}`}
//                 placeholder="Enter your full name"
//               />
//               {errors.fullName && <p className="rl-error-text">{errors.fullName}</p>}
//             </div>
//           )}

//           {currentView === 'register' && (
//             <div className="rl-field">
//               <label className="rl-label">
//                 <Calendar className="rl-label-icon" /> Age
//               </label>
//               <input
//                 type="number"
//                 value={formData.age}
//                 onChange={(e) => handleInputChange('age', parseInt(e.target.value) || '')}
//                 className={`rl-input ${errors.age ? 'rl-error' : ''}`}
//                 placeholder="Enter your age"
//                 min="1"
//                 max="120"
//               />
//               {errors.age && <p className="rl-error-text">{errors.age}</p>}
//             </div>
//           )}

//           {currentView === 'register' && (
//             <div className="rl-field">
//               <label className="rl-label">
//                 <Badge className="rl-label-icon" /> Experience
//               </label>
//               <select
//                 value={formData.experience}
//                 onChange={(e) => handleInputChange('experience', e.target.value)}
//                 className={`rl-input ${errors.experience ? 'rl-error' : ''}`}
//               >
//                 <option value="">-- Choose an option --</option>
//                 <option value="Beginner">Beginner</option>
//                 <option value="Intermediate">Intermediate</option>
//                 <option value="Advanced">Advanced</option>
//               </select>
//               {errors.experience && <p className="rl-error-text">{errors.experience}</p>}
//             </div>
//           )}

//           <div className="rl-field">
//             <label className="rl-label">
//               <Mail className="rl-label-icon" /> Email 
//             </label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) => handleInputChange('email', e.target.value)}
//               className={`rl-input ${errors.email ? 'rl-error' : ''}`}
//               placeholder="Enter your email"
//             />
//             {errors.email && <p className="rl-error-text">{errors.email}</p>}
//           </div>

//           <div className="rl-field">
//             <label className="rl-label">
//               <Lock className="rl-label-icon" /> Password 
//             </label>
//             <div className="rl-input-group">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={formData.password}
//                 onChange={(e) => handleInputChange('password', e.target.value)}
//                 className={`rl-input ${errors.password ? 'rl-error' : ''}`}
//                 placeholder={currentView === 'register' ? 'Create a password (min 6 characters)' : 'Enter your password'}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="rl-eye"
//               >
//                 {showPassword ? <EyeOff /> : <Eye />}
//               </button>
//             </div>
//             {errors.password && <p className="rl-error-text">{errors.password}</p>}
//           </div>

//           {currentView === 'register' && (
//             <div className="rl-field">
//               <label className="rl-label">
//                 <Lock className="rl-label-icon" /> Confirm Password 
//               </label>
//               <div className="rl-input-group">
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   value={formData.confirmPassword}
//                   onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
//                   className={`rl-input ${errors.confirmPassword ? 'rl-error' : ''}`}
//                   placeholder="Confirm your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="rl-eye"
//                 >
//                   {showConfirmPassword ? <EyeOff /> : <Eye />}
//                 </button>
//               </div>
//               {errors.confirmPassword && <p className="rl-error-text">{errors.confirmPassword}</p>}
//             </div>
//           )}

//           {currentView === 'register' && (
//             <div className="rl-checkbox">
//               <input
//                 type="checkbox"
//                 id="researcher"
//                 checked={formData.wantsResearcher}
//                 onChange={(e) => handleInputChange('wantsResearcher', e.target.checked)}
//               />
//               <label htmlFor="researcher" className="rl-label">
//                  Register as Researcher (requires qualification test)
//               </label>
//             </div>
//           )}

//           <button onClick={handleSubmit} disabled={isLoading} className="rl-btn">
//             {isLoading ? (currentView === 'login' ? 'Signing In...' : 'Creating Account...') : currentView === 'login' ? 'Sign In' : 'Create Account'}
//           </button>
//         </div>

//         {/* Switch */}
//         <div className="rl-switch">
//           <p>{currentView === 'login' ? "Don't have an account?" : 'Already have an account?'}</p>
//           <button onClick={switchView} className="rl-link">
//             {currentView === 'login' ? 'Sign up here' : 'Sign in here'}
//           </button>
//         </div>

//         <div className="rl-footer">
//           <p>🚀 NASA "Imagine Your Eyes" Challenge</p>
//           <p>Secure • Private • Space-Focused</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegistrationLogin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Telescope, UserSquare, Mail, Lock, Eye, EyeOff, Badge, Calendar } from 'lucide-react';
import './RegistrationLogin.css';
import welcomeVideo from '../welcome/welcomeved.mp4';
import logbg from './logbg.png'; 

const API_BASE = "http://localhost:5000/api/v1/auth"; 

const RegistrationLogin = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    experience: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // للتحقق
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (currentView === 'register') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.experience) {
        newErrors.experience = 'Please select your experience';
      }
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      let url = `${API_BASE}/login`;
      let body = {
        email: formData.email,
        password: formData.password
      };

      if (currentView === 'register') {
        url = `${API_BASE}/register`;
        body = {
          name: formData.fullName,
          experience: formData.experience,
          email: formData.email,
          password: formData.password,
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Request failed');

      if (currentView === 'register') {
        
        setVerifyOpen(true);
        return;
      }

      if (currentView === 'login') {
        localStorage.setItem("token", data.token);
        alert(data.message || "Login successful!");
        navigate("/Explora/home"); 
      }

    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      const res = await fetch(`${API_BASE}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verifyCode, email: formData.email }),
        credentials: "include"
      });

      const data = await res.json();
      if (res.ok) {
        alert("Email verified successfully!");
        setVerifyOpen(false);
        setCurrentView("login");
      } else {
        alert(data.message || "Invalid code");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch(`${API_BASE}/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await res.json();
      alert(data.message || "Code resent!");
    } catch (err) {
      console.error(err);
    }
  };

  const switchView = () => {
    setCurrentView(currentView === 'login' ? 'register' : 'login');
    setErrors({});
    setFormData({
      fullName: '',
      experience: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="rl-container">
      <video autoPlay loop muted playsInline className="rl-video-bg">
        <source src={welcomeVideo} type="video/mp4" />
      </video>
      {/* <div
  className="rl-bg-image"
  style={{
    backgroundImage: `url(${logbg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -2,
  }}
></div> */}


      <div className="rl-overlay"></div>

      <div className="rl-box">
        {/* Header */}
        <div className="rl-header">
          <div className="rl-logo">
            <Telescope className="rl-icon" />
            <h1 className="rl-title">Cosmic Canvas</h1>
          </div>
          <p className="rl-subtitle">
            {currentView === 'login' ? 'Welcome back, explorer!' : 'Join the space exploration community'}
          </p>
        </div>

        {/* Form */}
        <div className="rl-form">
          {currentView === 'register' && (
            <>
              <div className="rl-field">
                <label className="rl-label"><UserSquare className="rl-label-icon" /> Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`rl-input ${errors.fullName ? 'rl-error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="rl-error-text">{errors.fullName}</p>}
              </div>

              <div className="rl-field">
                <label className="rl-label"><Badge className="rl-label-icon" /> Experience</label>
                <select
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className={`rl-input ${errors.experience ? 'rl-error' : ''}`}
                >
                  <option value="">-- Choose an option --</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {errors.experience && <p className="rl-error-text">{errors.experience}</p>}
              </div>
            </>
          )}

          <div className="rl-field">
            <label className="rl-label"><Mail className="rl-label-icon" /> Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`rl-input ${errors.email ? 'rl-error' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="rl-error-text">{errors.email}</p>}
          </div>

          <div className="rl-field">
            <label className="rl-label"><Lock className="rl-label-icon" /> Password</label>
            <div className="rl-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`rl-input ${errors.password ? 'rl-error' : ''}`}
                placeholder={currentView === 'register' ? 'Create a password (min 6 characters)' : 'Enter your password'}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="rl-eye">
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <p className="rl-error-text">{errors.password}</p>}
          </div>

          {currentView === 'register' && (
            <div className="rl-field">
              <label className="rl-label"><Lock className="rl-label-icon" /> Confirm Password</label>
              <div className="rl-input-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`rl-input ${errors.confirmPassword ? 'rl-error' : ''}`}
                  placeholder="Confirm your password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="rl-eye">
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="rl-error-text">{errors.confirmPassword}</p>}
            </div>
          )}

          <button onClick={handleSubmit} disabled={isLoading} className="rl-btn">
            {isLoading ? (currentView === 'login' ? 'Signing In...' : 'Creating Account...') : currentView === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        {/* Switch */}
        <div className="rl-switch">
          <p>{currentView === 'login' ? "Don't have an account?" : 'Already have an account?'}</p>
          <button onClick={switchView} className="rl-link">
            {currentView === 'login' ? 'Sign up here' : 'Sign in here'}
          </button>
        </div>

        <div className="rl-footer">
          <p>🚀 NASA "Imagine Your Eyes" Challenge</p>
          <p>Secure • Private • Space-Focused</p>
        </div>
      </div>

      
      {verifyOpen && (
        <div className="rl-modal">
          <div className="rl-modal-content">
            <h2>Email Verification</h2>
            <p>Enter the 6-digit code sent to your email</p>
            <input
              type="text"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              maxLength="6"
              className="rl-input"
            />
            <div className="rl-modal-actions">
              <button onClick={handleVerify} className="rl-btn">Verify</button>
              <button onClick={handleResend} className="rl-btn">Resend Code</button>
              <button onClick={() => setVerifyOpen(false)} className="rl-btn">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationLogin;
