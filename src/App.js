import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';

// Separating the CSS into a safe template literal string to prevent compilation errors
const luxuryThemeStyles = `
  :root {
    --wine-dark: #3a0212;
    --wine-main: #5c0620;
    --wine-light: #821131;
    --gold-main: #d4af37;
    --gold-light: #f3e5ab;
    --gold-dark: #aa841c;
    --bg-dark: #1a0209;
    --glass-bg: rgba(92, 6, 32, 0.15);
    --glass-border: rgba(212, 175, 55, 0.25);
  }

  body {
    background-color: var(--bg-dark) !important;
    color: #fefcf7;
    font-family: 'Poppins', sans-serif;
  }

  .page {
    display: none;
    opacity: 0;
    transform: scale(0.98);
    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .page.active {
    display: block !important;
    opacity: 1;
    transform: scale(1);
    animation: pageFadeIn 0.55s ease forwards;
  }

  @keyframes pageFadeIn {
    0% { opacity: 0; transform: translateY(12px) scale(0.99); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  .glass-card, .app-form-card, .hero-card {
    background: var(--glass-bg) !important;
    backdrop-filter: blur(14px) !important;
    -webkit-backdrop-filter: blur(14px) !important;
    border: 1px solid var(--glass-border) !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 10px rgba(212, 175, 55, 0.05) !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  }

  .glass-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px 0 rgba(212, 175, 55, 0.15) !important;
    border-color: rgba(212, 175, 55, 0.5) !important;
  }

  .btn-main, .btn-explore {
    background: linear-gradient(135deg, var(--gold-main), var(--gold-dark)) !important;
    color: var(--wine-dark) !important;
    font-weight: 700 !important;
    letter-spacing: 0.5px;
    border: none !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    cursor: pointer;
  }

  .btn-main:hover, .btn-explore:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5) !important;
    background: linear-gradient(135deg, var(--gold-light), var(--gold-main)) !important;
  }

  .btn-main.enrolled, .btn-main.applied {
    background: transparent !important;
    color: var(--gold-main) !important;
    border: 1px solid var(--gold-main) !important;
    box-shadow: none !important;
  }

  nav {
    background: rgba(26, 2, 9, 0.85) !important;
    border-bottom: 1px solid var(--glass-border) !important;
    backdrop-filter: blur(10px);
  }

  .logo {
    color: var(--gold-main) !important;
    font-weight: 800 !important;
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
  }

  .nav-btn {
    color: #f3e5ab !important;
    transition: all 0.3s ease !important;
    background: none;
    border: none;
  }

  .nav-btn.active, .nav-btn:hover {
    color: var(--gold-main) !important;
    border-bottom: 2px solid var(--gold-main) !important;
    text-shadow: 0 0 8px rgba(212, 175, 55, 0.4);
  }

  input, select, textarea {
    background: rgba(26, 2, 9, 0.5) !important;
    border: 1px solid var(--glass-border) !important;
    color: #fff !important;
    border-radius: 6px !important;
    transition: all 0.3s ease;
  }

  input:focus, select:focus, textarea:focus {
    border-color: var(--gold-main) !important;
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.3) !important;
    outline: none;
  }

  #front-page {
    background: radial-gradient(circle at center, var(--wine-light) 0%, var(--bg-dark) 100%) !important;
    transition: transform 0.65s cubic-bezier(0.77, 0, 0.175, 1) !important;
  }

  #front-page h1 span {
    color: var(--gold-main) !important;
  }

  .toggle-btn {
    background: transparent !important;
    color: #fff !important;
    border: 1px solid var(--glass-border) !important;
  }

  .toggle-btn.active {
    background: var(--wine-main) !important;
    border-color: var(--gold-main) !important;
    color: var(--gold-main) !important;
  }

  .vacancy-card {
    background: rgba(92, 6, 32, 0.2) !important;
    border: 1px solid var(--glass-border) !important;
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  .vacancy-card:hover {
    border-color: var(--gold-main) !important;
    background: rgba(92, 6, 32, 0.35) !important;
  }

  .elig-tag {
    background: rgba(212, 175, 55, 0.15) !important;
    color: var(--gold-main) !important;
    border: 1px solid rgba(212, 175, 55, 0.3) !important;
  }

  .msg.user {
    background: var(--wine-light) !important;
    color: #fff !important;
    border-radius: 12px 12px 0 12px !important;
  }

  .msg.ai {
    background: rgba(212, 175, 55, 0.15) !important;
    color: var(--gold-light) !important;
    border: 1px solid rgba(212, 175, 55, 0.2) !important;
    border-radius: 12px 12px 12px 0 !important;
  }

  .sub-badge {
    background: linear-gradient(45deg, var(--wine-dark), var(--wine-main)) !important;
    color: var(--gold-main) !important;
    border: 1px solid var(--gold-main) !important;
  }
`;

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isFrontPageVisible, setIsFrontPageVisible] = useState(true);
  const [isLoginVisible, setIsLoginVisible] = useState(false); 
  const [jobView, setJobView] = useState('india'); 

  const [userData, setUserData] = useState({
    name: "user",
    degree: "B.E. CSE",
    initial: "U"
  });

  const [showJobModal, setShowJobModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [activeCourse, setActiveCourse] = useState('');

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [quizScore, setQuizScore] = useState(0);

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatWindowRef = useRef(null);
  const [activeJobId, setActiveJobId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const exploreApp = () => {
    setIsFrontPageVisible(false);
    setIsLoginVisible(true);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      username: formData.get('userName'),
      password: "password123" 
    };
  
    try {
      await axios.post('http://localhost:8000/api/register/', payload);
      setIsLoginVisible(false);
      setCurrentPage('home');
    } catch (error) {
      alert("Check if Django is running! Error: " + error.message);
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      job_title: formData.get('jobTitle'),
      company: formData.get('companyName'), 
      location_type: 'India',              
      user: 1                               
    };
  
    try {
      await axios.post('http://localhost:8000/api/apply-job/', payload);
      alert("Application sent!");
      if(activeJobId) setAppliedJobs([...appliedJobs, activeJobId]);
      setShowJobModal(false);
    } catch (error) {
      console.error(error.response?.data);
    }
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const courseValue = formData.get('course');

    const payload = {
      course: courseValue, 
      full_name: formData.get('fullName'),
      email: formData.get('email'),
      contact_number: formData.get('contactNumber'),
      age: formData.get('age'),
      payment_option: formData.get('paymentOption'),
      payment_status: formData.get('paymentStatus'),
      user: 1 
    };
  
    try {
      await axios.post('http://localhost:8000/api/enroll/', payload);
      alert("Enrolled successfully in " + activeCourse);
      setEnrolledCourses([...enrolledCourses, activeCourse]);
      setShowEnrollModal(false);
    } catch (error) {
      console.error("Enrollment error:", error.response?.data);
      alert("Enrollment failed.");
    }
  };

  const checkScore = () => {
    let score = 0;
    const form = document.getElementById('quiz-form');
    const formData = new FormData(form);
    for (let value of formData.values()) { if (value === "1") score++; }
    const percent = (score / 10) * 100;
    setQuizScore(percent);
    if (percent >= 80) setCurrentPage('success');
    else setCurrentPage('failed');
  };

  const sendMsg = () => {
    if (!chatInput) return;
    const newMsgs = [...messages, { role: 'user', text: chatInput }];
    setMessages(newMsgs);
    setChatInput("");
    setTimeout(() => {
      setMessages([...newMsgs, { role: 'ai', text: "I am here to help!" }]);
    }, 700);
  };

  return (
    <>
      <style>{luxuryThemeStyles}</style>

      
      {showJobModal && (
        <div id="form-overlay" style={{ display: 'flex' }}>
          <div className="app-form-card">
            <span onClick={() => setShowJobModal(false)} style={{ position: 'absolute', right: '25px', top: '25px', cursor: 'pointer', color: '#64748b' }}>X</span>
            <h2>Job Application</h2>

            <form id="jobForm" onSubmit={handleJobSubmit}>
              <div className="form-group"><label>Job Title</label><input name="jobTitle" type="text" required /></div>
              <div className="form-group"><label>Company Name</label><input name="companyName" type="text" required /></div>
              <div className="form-group"><label>Full Name</label><input name="fullName" type="text" defaultValue={userData.name} required /></div>
              <div className="form-group"><label>Age</label><input name="age" type="number" required /></div>
              <div className="form-group"><label>Email Address</label><input name="email" type="email" required /></div>
              <div className="form-group"><label>Phone Number</label><input name="phone" type="tel" required /></div>
              <div className="form-group"><label>Qualification</label><input name="qualification" type="text" defaultValue={userData.degree} required /></div>
              <div className="form-group"><label>Top Skills</label><textarea name="skills" required placeholder="Python, JavaScript, React..."></textarea></div>
              <button type="submit" className="btn-main" style={{ width: '100%', padding: '15px' }}>Submit Application</button>
            </form>
          </div>
        </div>
      )}

      
      {showEnrollModal && (
        <div id="enroll-overlay" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2000, background: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <div className="app-form-card" style={{ position: 'relative' }}>
            <button type="button" onClick={() => setShowEnrollModal(false)} style={{ position: 'absolute', right: '25px', top: '25px', cursor: 'pointer', background: 'none', border: 'none', color: '#64748b', fontSize: '1.2rem' }}>X</button>
            <h2>Enroll: {activeCourse}</h2>
            <form id="enrollForm" onSubmit={handleEnrollSubmit}>
              <input type="hidden" name="course" value={activeCourse} />
              <div className="form-group"><label>Full Name</label><input name="fullName" type="text" defaultValue={userData.name} required /></div>
              <div className="form-group"><label>Email Address</label><input name="email" type="email" required /></div>
              <div className="form-group"><label>Contact Number</label><input name="contactNumber" type="tel" required /></div>
              <div className="form-group"><label>Age</label><input name="age" type="number" required /></div>
              <div className="form-group"><label>Payment Option</label>
                <select name="paymentOption" required>
                  <option value="">Select Option</option>
                  <option value="gpay">GPay</option>
                  <option value="phonepe">PhonePe</option>
                </select>
              </div>
              <div className="form-group"><label>Payment Status</label>
                <select name="paymentStatus" required>
                  <option value="not-done">Not Done</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <button type="submit" className="btn-main" style={{ width: '100%', padding: '15px' }}>Confirm Enrollment</button>
            </form>
          </div>
        </div>
      )}

      
      <div id="front-page" style={{ transform: isFrontPageVisible ? 'translateY(0)' : 'translateY(-100%)' }}>
        <div className="hero-card">
          <h1>Connect<span>Dots</span></h1>
          <p>Your journey from learning to earning starts here. High-impact courses, elite assessments, and premium global placement.</p>
          <button className="btn-explore" onClick={exploreApp}>Explore Dashboard</button>
        </div>
      </div>

      
      {isLoginVisible && (
        <div id="login-container">
          <div className="hero-card" style={{zIndex: 1500}}>
            <h2 style={{marginBottom: '20px', color: 'var(--gold-main)'}}>Complete Your Profile</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group"><label>Full Name</label><input name="userName" type="text" placeholder="Enter your name" required /></div>
              <div className="form-group"><label>Qualification / Degree</label><input name="userDegree" type="text" placeholder="e.g. B.E. Computer Science" required /></div>
              <div className="form-group"><label>Email ID</label><input type="email" placeholder="email@example.com" required /></div>
              <button type="submit" className="btn-main" style={{width: '100%', padding: '15px', marginTop: '10px'}}>Go to Dashboard</button>
            </form>
          </div>
        </div>
      )}

      
      {!isFrontPageVisible && !isLoginVisible && (
        <nav>
          <div className="logo" onClick={() => setCurrentPage('home')}>ConnectDots</div>
          <div className="nav-links">
            <button className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`} onClick={() => setCurrentPage('home')}>Home</button>
            <button className={`nav-btn ${currentPage === 'profile' || currentPage === 'assessment' ? 'active' : ''}`} onClick={() => setCurrentPage('profile')}>My Profile</button>
            <button className={`nav-btn ${currentPage === 'reels' ? 'active' : ''}`} onClick={() => setCurrentPage('reels')}>Reels</button>
            <button className={`nav-btn ${currentPage === 'chat' ? 'active' : ''}`} onClick={() => setCurrentPage('chat')}>Chat</button>
            <button className={`nav-btn ${currentPage === 'community' ? 'active' : ''}`} onClick={() => setCurrentPage('community')}>Community ★</button>
          </div>
        </nav>
      )}

      
      <div id="home" className={`page ${currentPage === 'home' ? 'active' : ''}`}>
        <h2 style={{color: 'var(--gold-main)', textAlign: 'center', margin: '30px 0'}}>Premium Skill Paths</h2>
        <div className="grid-container">
          {[
            { name: 'Full-Stack Mastery', price: '₹35,000', tag: 'MOST POPULAR', color: 'var(--gold-main)', desc: 'MERN Stack + Cloud Deployment.' },
            { name: 'AI & Prompt Engineering', price: '₹28,000', tag: 'ADVANCED', color: 'var(--gold-main)', desc: 'Learn to build LLM-powered apps.' },
            { name: 'Cybersecurity Pro', price: '₹30,000', tag: 'NEW', color: 'var(--gold-main)', desc: 'Network security & ethical hacking.' },
            { name: 'Data Science & ML', price: '₹32,000', tag: 'TRENDING', color: 'var(--gold-main)', desc: 'Python, R, and Predictive Modeling.' },
            { name: 'UI/UX Design', price: '₹22,000', tag: 'CREATIVE', color: 'var(--gold-main)', desc: 'Figma mastery and User Psychology.' },
            { name: 'Cloud Computing', price: '₹40,000', tag: 'ENTERPRISE', color: 'var(--gold-main)', desc: 'AWS, Azure, and Google Cloud Architect.' },
            { name: 'React Native Dev', price: '₹26,000', tag: 'MOBILE', color: 'var(--gold-main)', desc: 'Build cross-platform iOS & Android apps.' },
            { name: 'Blockchain Engineer', price: '₹45,000', tag: 'WEB3', color: 'var(--gold-main)', desc: 'Solidity, Smart Contracts, and DApps.' }
          ].map((course) => (
            <div className="glass-card" style={{ textAlign: 'left' }} key={course.name}>
              <span style={{ color: course.color, fontWeight: 800, fontSize: '0.7rem', letterSpacing: '1px' }}>{course.tag}</span>
              <h3 style={{color: '#fff', margin: '5px 0 10px'}}>{course.name}</h3>
              <p style={{color: '#f3e5ab', fontSize: '0.9rem'}}>{course.desc}</p>
              <h3 style={{ margin: '15px 0', color: 'var(--gold-light)' }}>{course.price}</h3>
              <button 
                className={`btn-main ${enrolledCourses.includes(course.name) ? 'enrolled' : ''}`} 
                style={{ width: '100%' }} 
                onClick={() => {
                  if(!enrolledCourses.includes(course.name)) {
                    setActiveCourse(course.name);
                    setShowEnrollModal(true);
                  }
                }}
              >
                {enrolledCourses.includes(course.name) ? '✓ Enrolled' : 'Enroll Now'}
              </button>
            </div>
          ))}
        </div>
      </div>

      
      <div id="profile" className={`page ${currentPage === 'profile' ? 'active' : ''}`}>
        <div className="glass-card" style={{maxWidth: '500px', margin: '40px auto', textAlign: 'center', padding: '40px 20px'}}>
          <div style={{ width: '80px', height: '80px', background: 'var(--wine-main)', color: 'var(--gold-main)', borderRadius: '50%', margin: '0 auto 15px', border: '2px solid var(--gold-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800' }}>
            {userData.initial}
          </div>
          <h2>{userData.name}</h2>
          <p style={{marginBottom: '10px', color: 'var(--gold-light)'}}>{userData.degree}</p>
          <p>Assessment Status: <span style={{ color: 'var(--gold-main)', fontWeight: 800 }}>Pending</span></p>
          <button className="btn-main" style={{ marginTop: '20px', padding: '12px 30px' }} onClick={() => setCurrentPage('assessment')}>Start Assessment</button>
        </div>
      </div>

      
      <div id="assessment" className={`page ${currentPage === 'assessment' ? 'active' : ''}`}>
        <div className="glass-card" style={{maxWidth: '700px', margin: '30px auto'}}>
          <h2 style={{ margin: '25px', color: 'var(--gold-main)', textAlign: 'center' }}>Skill Verification</h2>
          <form id="quiz-form">
            <div className="quiz-q" style={{borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '15px', marginBottom: '15px'}}><p style={{fontWeight: 600}}>1. Which tag is used for the largest heading?</p>
              <label style={{marginRight: '15px'}}><input type="radio" name="q1" value="1" /> &lt;h1&gt;</label> <label><input type="radio" name="q1" value="0" /> &lt;head&gt;</label></div>
            
            <div className="quiz-q" style={{borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '15px', marginBottom: '15px'}}><p style={{fontWeight: 600}}>2. Which language provides structure to a webpage?</p>
              <label style={{marginRight: '15px'}}><input type="radio" name="q2" value="1" /> HTML</label> <label><input type="radio" name="q2" value="0" /> CSS</label></div>
            
            <div className="quiz-q" style={{borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '15px', marginBottom: '15px'}}><p style={{fontWeight: 600}}>3. How do you create a function in JS?</p>
              <label style={{marginRight: '15px'}}><input type="radio" name="q3" value="1" /> function myFunc()</label> <label><input type="radio" name="q3" value="0" /> func = myFunc()</label></div>

            <div className="quiz-q" style={{borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '15px', marginBottom: '15px'}}><p style={{fontWeight: 600}}>4. Which CSS property changes text color?</p>
              <label style={{marginRight: '15px'}}><input type="radio" name="q4" value="1" /> color</label> <label><input type="radio" name="q4" value="0" /> text-style</label></div>

            <div className="quiz-q" style={{borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '15px', marginBottom: '15px'}}><p style={{fontWeight: 600}}>5. What does DOM stand for?</p>
              <label style={{marginRight: '15px'}}><input type="radio" name="q5" value="1" /> Document Object Model</label> <label><input type="radio" name="q5" value="0" /> Data Object Management</label></div>

            <div className="quiz-q" style={{borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '15px', marginBottom: '15px'}}><p style={{fontWeight: 600}}>6. Which array method adds elements to the end?</p>
              <label style={{marginRight: '15px'}}><input type="radio" name="q6" value="1" /> push()</label> <label><input type="radio" name="q6" value="0" /> pop()</label></div>

            <div className="quiz-q" style={{borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '15px', marginBottom: '15px'}}><p style={{fontWeight: 600}}>7. Which command initializes a local Git repository?</p>
              <label style={{marginRight: '15px'}}><input type="radio" name="q7" value="1" /> git init</label> <label><input type="radio" name="q7" value="0" /> git start</label></div>

            <div className="quiz-q" style={{borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '15px', marginBottom: '15px'}}><p style={{fontWeight: 600}}>8. What type of database is MySQL?</p>
              <label style={{marginRight: '15px'}}><input type="radio" name="q8" value="1" /> Relational</label> <label><input type="radio" name="q8" value="0" /> NoSQL</label></div>

            <div className="quiz-q" style={{borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '15px', marginBottom: '15px'}}><p style={{fontWeight: 600}}>9. In React, hooks must be called at the top level.</p>
              <label style={{marginRight: '15px'}}><input type="radio" name="q9" value="1" /> True</label> <label><input type="radio" name="q9" value="0" /> False</label></div>

            <div className="quiz-q" style={{borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '15px', marginBottom: '15px'}}><p style={{fontWeight: 600}}>10. What does API stand for?</p>
              <label style={{marginRight: '15px'}}><input type="radio" name="q10" value="1" /> Application Programming Interface</label> <label><input type="radio" name="q10" value="0" /> App Protocol Integration</label></div>

            <button type="button" className="btn-main" style={{ width: '100%', padding: '14px' }} onClick={checkScore}>Submit Results</button>
          </form>
        </div>
      </div>

      
      <div id="reels" className={`page ${currentPage === 'reels' ? 'active' : ''}`}>
        <h2 style={{color: 'var(--gold-main)', textAlign: 'center', margin: '30px 0'}}>Career Shorts</h2>
        <div className="reels-grid">
          {[
            { title: "How to crack FAANG", views: "2.4M", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400" },
            { title: "Day in life of SDE", views: "1.1M", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400" }
          ].map((reel, idx) => (
            <div className="reel-thumb" key={idx} style={{border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden'}}>
              <img src={reel.img} alt="Tech" />
              <div className="reel-info"><b style={{color: 'var(--gold-light)'}}>{reel.title}</b><br />{reel.views} Views</div>
            </div>
          ))}
        </div>
      </div>

      
      <div id="community" className={`page ${currentPage === 'community' ? 'active' : ''}`}>
        <div className="glass-card" style={{maxWidth: '500px', margin: '40px auto', textAlign: 'center', padding: '40px 20px'}}>
          <h2>Premium Community Access</h2>
          <p style={{color: '#f3e5ab'}}>Join elite developers, get direct referrals, and access 1-on-1 mentorship.</p>
          <div className="sub-badge" style={{margin: '15px auto', display: 'inline-block', padding: '8px 20px', borderRadius: '30px'}}>Special Price: ₹50/-</div>
          <br />
          <button className="btn-main" style={{ padding: '15px 40px' }} onClick={() => alert('Redirecting to Payment Gateway...')}>Subscribe Now</button>
        </div>
      </div>

      
      <div id="jobs-main" className={`page ${currentPage === 'jobs-main' ? 'active' : ''}`}>
        <div className="toggle-container" style={{justifyContent: 'center', display: 'flex', gap: '15px', margin: '25px 0'}}>
          <button className={`toggle-btn ${jobView === 'india' ? 'active' : ''}`} onClick={() => setJobView('india')} style={{padding: '10px 25px', borderRadius: '25px', cursor: 'pointer'}}>India Roles</button>
          <button className={`toggle-btn ${jobView === 'abroad' ? 'active' : ''}`} onClick={() => setJobView('abroad')} style={{padding: '10px 25px', borderRadius: '25px', cursor: 'pointer'}}>Abroad Pathways</button>
        </div>

        {jobView === 'india' ? (
          <div id="view-india" style={{maxWidth: '800px', margin: '0 auto'}}>
            {[
              { id: 'g1', comp: 'Google India', role: 'Associate Cloud Engineer', loc: 'Bengaluru', log: 'G', bg: 'rgba(212,175,55,0.1)' },
              { id: 'amz1', comp: 'Amazon India', role: 'Software Development Engineer (SDE-1)', loc: 'Hyderabad', log: 'A', bg: 'rgba(212,175,55,0.1)' },
              { id: 'ms1', comp: 'Microsoft India', role: 'Support Engineer Intern', loc: 'Noida', log: 'M', bg: 'rgba(212,175,55,0.1)' },
              { id: 'inf1', comp: 'Infosys', role: 'Systems Engineer Specialist', loc: 'Pune', log: 'I', bg: 'rgba(212,175,55,0.1)' },
              { id: 'tcs1', comp: 'TCS Digital', role: 'Systems Engineer', loc: 'Chennai', log: 'T', bg: 'rgba(212,175,55,0.1)' },
              { id: 'wip1', comp: 'Wipro Turbo', role: 'Project Engineer', loc: 'Bengaluru', log: 'W', bg: 'rgba(212,175,55,0.1)' },
              { id: 'tata1', comp: 'Tata Elxsi', role: 'Embedded Systems Developer', loc: 'Thiruvananthapuram', log: 'TE', bg: 'rgba(212,175,55,0.1)' }
            ].map(job => (
              <div className="vacancy-card" key={job.id} style={{padding: '20px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div className="comp-logo" style={{ background: job.bg, color: 'var(--gold-main)', border: '1px solid var(--gold-main)', fontWeight: 'bold', padding: '5px 10px', borderRadius: '4px', minWidth: '40px', textAlign: 'center' }}>{job.log}</div>
                  <div><h4 style={{color: '#fff', margin: 0}}>{job.comp}</h4><p style={{margin: '4px 0', color: 'var(--gold-light)', fontSize: '0.9rem'}}>{job.role} • {job.loc}</p></div>
                </div>
                <button 
                  className={`btn-main ${appliedJobs.includes(job.id) ? 'applied' : ''}`} 
                  onClick={() => {
                    if(!appliedJobs.includes(job.id)) {
                      setActiveJobId(job.id);
                      setShowJobModal(true);
                    }
                  }}
                >
                  {appliedJobs.includes(job.id) ? '✓ Applied' : 'Apply Now'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div id="view-abroad">
            <div className="grid-container">
              <div className="glass-card" style={{ textAlign: 'left' }}>
                <h3>Global SDE Internship</h3>
                <p style={{color: 'var(--gold-light)'}}>Remote SDE roles with US startups. $2000/mo.</p>
                <button className="btn-main" style={{ width: '100%', marginTop: '10px' }} onClick={() => { setActiveJobId('abr1'); setShowJobModal(true); }}>Apply Now</button>
              </div>
              <div className="glass-card" style={{ textAlign: 'left' }}>
                <h3>AI Engineering Intern</h3>
                <p style={{color: 'var(--gold-light)'}}>Remote machine learning pipeline design with London Tech Group. £1800/mo.</p>
                <button className="btn-main" style={{ width: '100%', marginTop: '10px' }} onClick={() => { setActiveJobId('abr2'); setShowJobModal(true); }}>Apply Now</button>
              </div>
              <div className="glass-card" style={{ textAlign: 'left' }}>
                <h3>Full-Stack Dev Internship</h3>
                <p style={{color: 'var(--gold-light)'}}>Remote React & Django interface development with Singapore Systems. $2400SGD/mo.</p>
                <button className="btn-main" style={{ width: '100%', marginTop: '10px' }} onClick={() => { setActiveJobId('abr3'); setShowJobModal(true); }}>Apply Now</button>
              </div>
            </div>
          </div>
        )}
      </div>

      
      {currentPage === 'success' && (
        <div id="success" className="page active">
          <div className="glass-card" style={{maxWidth: '500px', margin: '50px auto', textAlign: 'center', padding: '40px 20px'}}>
            <h1 style={{ fontSize: '5rem', color: 'var(--gold-main)', margin: 0 }}>{quizScore}%</h1>
            <h2>Outstanding!</h2>
            <button className="btn-main" style={{padding: '12px 30px'}} onClick={() => setCurrentPage('jobs-main')}>View High-Package Jobs</button>
          </div>
        </div>
      )}

      {currentPage === 'failed' && (
        <div id="failed" className="page active">
          <div className="glass-card" style={{maxWidth: '500px', margin: '50px auto', textAlign: 'center', padding: '40px 20px'}}>
            <h1 style={{ fontSize: '4rem', color: 'var(--wine-light)', margin: 0 }}>{quizScore}%</h1>
            <h2 style={{margin: '15px 0 25px'}}>Target 80% to Unlock Global Roles</h2>
            <button className="btn-main" style={{ padding: '12px 35px' }} onClick={() => setCurrentPage('assessment')}>Retake Test</button>
          </div>
        </div>
      )}

      
      <div id="chat" className={`page ${currentPage === 'chat' ? 'active' : ''}`}>
        <div className="glass-card" style={{maxWidth: '700px', margin: '30px auto'}}>
          <div id="chat-window" ref={chatWindowRef} style={{background: 'rgba(26,2,9,0.4)', borderRadius: '12px', padding: '15px', minHeight: '200px'}}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`} style={{padding: '8px 12px', margin: '5px 0'}}>{m.text}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <input 
              type="text" 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
              placeholder="Ask career..." 
              style={{ flex: 1, padding: '12px', borderRadius: '10px' }} 
            />
            <button className="btn-main" style={{padding: '0 25px'}} onClick={sendMsg}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;