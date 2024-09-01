import './login.css';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function Login({ show, onClose }) {
  const loginRef = useRef();
  const signupRef = useRef();
  const backdropRef = useRef();
  const [s, setS] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState('');
  const [confirmPassword, setConfirmPass] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errl, setErrl] = useState(false);
  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [emptyFieldError, setEmptyFieldError] = useState(false);

  useEffect(() => {
    if (show) {
      gsap.fromTo(loginRef.current, { x: 500 }, { x: 0, duration: 0.5 });
    } else {
      gsap.to(loginRef.current, { x: 500, duration: 0.5 });
    }
  }, [show]);

  useEffect(() => {
    if (s) {
      gsap.fromTo(signupRef.current, { x: 500 }, { x: 0, duration: 0.5 });
    } else {
      gsap.to(signupRef.current, { x: 500, duration: 0.5 });
    }
  }, [s]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setEmptyFieldError(true);
      return;
    }

    const res = await axios.post("https://collab-sheet-5.onrender.com/login", { email, password });
    if (res.data !== "err") {
      setSuccessMessage('Login successful!');
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("phoneNumber", res.data.phoneNumber);
      setSuccess(true);
      window.location.reload(); 
    } else {
      setErrl(true);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !phoneNumber) {
      setEmptyFieldError(true);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    const res = await axios.post("https://collab-sheet-5.onrender.com/register", { name, email, password, phoneNumber });
    if (res.data === "OK") {
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("phoneNumber", phoneNumber);
      setSuccessMessage('Registration successful!');
      setSuccess(true);
      window.location.reload(); 
    } else {
      setErr(true);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
      setS(false);
    }
  };

  const handleCloseSignup = () => {
    setS(false);
  };

  const handleInputFocus = () => {
    setErrl(false);
    setErr(false);
    setPasswordMatchError(false);
    setEmptyFieldError(false);
  };

  return (
    <>
      {show && (
        <div ref={backdropRef} className="backdrop" onClick={handleBackdropClick}>
          <div ref={loginRef} className="login">
            <button className="close-button" onClick={onClose}>×</button>
            <h2 className="login-title">Login to Your Account</h2>
            {success && <p className="success-message">{successMessage}</p>}
            <form className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleInputFocus}
                  type="email"
                  id="email"
                  name="email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                  onFocus={handleInputFocus}
                  type="password"
                  id="password"
                  name="password"
                  required
                />
              </div>
              {errl && <p style={{ color: 'red', textAlign: 'center' }}>Email or password is wrong</p>}
              {emptyFieldError && <p style={{ color: 'red', textAlign: 'center' }}>Please fill in all fields</p>}
              <button onClick={handleLogin} type="submit" className="submit-button">Login</button>
            </form>
            <div className="social-login">
              <button className="social-button google">Login with Google</button>
              <button onClick={() => setS(true)} className="social-button twitter">Sign Up</button>
            </div>
          </div>

          {s && (
            <div ref={signupRef} className="signup">
              <button className="close-button" onClick={handleCloseSignup}>×</button>
              <h2 className="signup-title">Create Your Account</h2>
              {success && <p className="success-message">{successMessage}</p>}
              <form className="signup-form">
                <div className="form-group">
                  <label htmlFor="signup-name">Name:</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={handleInputFocus}
                    type="text"
                    id="signup-name"
                    name="signup-name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-email">Email:</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={handleInputFocus}
                    type="email"
                    id="signup-email"
                    name="signup-email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-phone">Phone Number:</label>
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onFocus={handleInputFocus}
                    type="tel"
                    id="signup-phone"
                    name="signup-phone"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    placeholder="123-456-7890"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-password">Password:</label>
                  <input
                    value={password}
                    onChange={(e) => setPass(e.target.value)}
                    onFocus={handleInputFocus}
                    type="password"
                    id="signup-password"
                    name="signup-password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-confirm-password">Confirm Password:</label>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    onFocus={handleInputFocus}
                    type="password"
                    id="signup-confirm-password"
                    name="signup-confirm-password"
                    required
                  />
                  {passwordMatchError && <p style={{ color: 'red', textAlign: 'center' }}>Passwords do not match</p>}
                </div>
                {emptyFieldError && <p style={{ color: 'red', textAlign: 'center' }}>Please fill in all fields</p>}
                {err && <p style={{ color: 'red', textAlign: 'center' }}>Email already exists</p>}
                <button onClick={handleSignup} type="submit" className="submit-button">Sign Up</button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
