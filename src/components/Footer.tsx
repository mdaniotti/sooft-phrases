const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-text">
          Challenge by Sooft • Built with React and TypeScript
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Made by Martin Danilo Daniotti. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
