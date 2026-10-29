import '../styles/components.css';

const Spinner = ({ size = 'default' }) => (
  <div className="spinner-container">
    <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export default Spinner;
