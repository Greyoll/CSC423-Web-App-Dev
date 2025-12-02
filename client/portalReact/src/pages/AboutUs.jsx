import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function AboutUs() {
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
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>About Valdez M.D. Family Medicine</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Our Mission</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555' }}>
              At Valdez M.D. Family Medicine, we are dedicated to providing comprehensive, 
              compassionate healthcare to families in the Brockport community. Our team of 
              experienced medical professionals is committed to delivering personalized care 
              that addresses the unique needs of each patient.
            </p>
            
            <h3 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '1rem' }}>Our Services</h3>
            <ul style={{ fontSize: '1.05rem', lineHeight: '2', color: '#555', listStyle: 'none', paddingLeft: '0' }}>
              <li>✓ Annual Physical Examinations</li>
              <li>✓ Chronic Disease Management</li>
              <li>✓ Preventive Care & Wellness</li>
              <li>✓ Immunizations & Vaccinations</li>
              <li>✓ Minor Procedures</li>
              <li>✓ Lab Services</li>
            </ul>
          </div>
          
          <div>
            <img 
              src="/Images/Stan-Home2.jpg" 
              alt="Our Medical Team" 
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
        </div>

        <div style={{ backgroundColor: '#f5f5f5', padding: '3rem', borderRadius: '12px', marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>Why Choose Us?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <img src="/Images/stethoscope.png" alt="" style={{ width: '48px', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Experienced Team</h3>
              <p style={{ color: '#666' }}>Board-certified physicians with years of experience</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img src="/Images/users.png" alt="" style={{ width: '48px', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Patient-Centered</h3>
              <p style={{ color: '#666' }}>Your health and comfort are our top priorities</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img src="/Images/clipboard-list.png" alt="" style={{ width: '48px', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Modern Technology</h3>
              <p style={{ color: '#666' }}>State-of-the-art equipment and online portal</p>
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
              fontSize: '1.1rem',
              marginRight: '1rem'
            }}
          >
            Patient Portal Login
          </Link>
          <Link 
            to="/contact" 
            className="button"
            style={{ 
              display: 'inline-block',
              backgroundColor: '#fff',
              color: '#000',
              border: '2px solid #000',
              padding: '12px 32px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '1.1rem'
            }}
          >
            Contact Us
          </Link>
        </div>
      </main>
    </>
  );
}

export default AboutUs;