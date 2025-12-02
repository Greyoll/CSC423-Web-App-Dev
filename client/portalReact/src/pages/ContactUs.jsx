import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function ContactUs() {
  const { darkMode } = useTheme();

  return (
    <>
      <header>
        <div className="logo">
          <img
            src={darkMode ? "/Images/valdez_logo-white.png" : "/Images/valdez_logo-black.png"}
            alt="Valdez MD Logo"
          />
        </div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/login" className="login-btn">Log In</Link></li>
          </ul>
        </nav>
      </header>

      <main style={{ padding: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Contact Us</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <img 
              src="/Images/Stan-Phone.jpg" 
              alt="Valdez Medical Office" 
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
          
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Get in Touch</h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                <img src="/Images/house-heart.png" alt="" style={{ width: '20px', marginRight: '8px' }} />
                Office Location
              </h3>
              <p style={{ marginLeft: '28px', color: '#666' }}>
                123 Medical Plaza Drive<br />
                Brockport, NY 14420
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                <img src="/Images/clock.png" alt="" style={{ width: '20px', marginRight: '8px' }} />
                Office Hours
              </h3>
              <p style={{ marginLeft: '28px', color: '#666' }}>
                Monday - Friday: 8:00 AM - 6:00 PM<br />
                Saturday: 9:00 AM - 2:00 PM<br />
                Sunday: Closed
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                <img src="/Images/user.png" alt="" style={{ width: '20px', marginRight: '8px' }} />
                Contact Information
              </h3>
              <p style={{ marginLeft: '28px', color: '#666' }}>
                Phone: (XXX) XXX-XXXX<br />
                Fax: (XXX) XXX-XXXX<br />
                Email: GMoney527@valdezmd.com
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                <img src="/Images/clipboard.png" alt="" style={{ width: '20px', marginRight: '8px' }} />
                Emergency
              </h3>
              <p style={{ marginLeft: '28px', color: '#d32f2f', fontWeight: 'bold' }}>
                For medical emergencies, call 911
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <Link 
            to="/login" 
            className="button"
            style={{ 
              display: 'inline-block',
              backgroundColor: '#000',
              color: '#fff',
              padding: '12px 32px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '1.1rem'
            }}
          >
            Patient Portal Login
          </Link>
        </div>
      </main>
    </>
  );
}

export default ContactUs;