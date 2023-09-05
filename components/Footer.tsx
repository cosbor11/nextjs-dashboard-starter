import Logo from './Logo';
import Branding from './branding/Branding';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col justify-center items-center py-4">
        <div className="flex items-center">
          <Logo className="logo h-6 w-6 mr-2" width={18} height={18}/>
          <span className="h-6 align-middle tracking-tighter font-semibold text-center">{Branding.domain}</span>
        </div>
        <span className="mt-2 text-center font-light text-sm">© {currentYear} {Branding.rights} All rights reserved.</span>
        <div className="text-xs flex space-x-3 text-link-theme-color pt-2">
          <a href='/privacy-policy'>Privacy Policy</a> <p>|</p> <a href='/terms-of-service'>Terms of Service</a>
        </div>
    </footer>
  );
};

export default Footer;