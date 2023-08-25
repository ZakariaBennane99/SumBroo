import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SlideMenu from './SlideMenu';

const Header = ({ signedIn, isLanding }) => {

  const landing = isLanding || false;

  const [windowWidth, setWindowWidth] = useState(null);
  const [isSubMenuOpen1, setIsSubMenuOpen1] = useState(false);
  const [isSubMenuOpen2, setIsSubMenuOpen2] = useState(false);
  const [isSignOutClicked, setIsSignOutClicked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  async function signOutUser() {
    setIsSignOutClicked(true)
    const url = 'http://localhost:4050/api/sign-out-user';
    try {
      const res = await axios.post(url, {}, { withCredentials: true });
      if (res.status === 200) {
        router.push('/sign-in');
      } else {
        console.error(`Unexpected status code: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
      setIsServerErr(true);
    }
  }

  const renderLinks = (isMobile) => {
    return signedIn ? renderSignedInLinks(isMobile) : renderSignedOutLinks();
  };

  const renderSignedInLinks = (isMobile) => {
    return isMobile ? renderMobileSignedInLinks() : renderDesktopSignedInLinks();
  };

  const renderMobileSignedInLinks = () => {
    return (
      <div id='mobile-sub-menu-wrapper'>
        {renderSubMenu('Dashboard', 'dashboard', isSubMenuOpen1, setIsSubMenuOpen1)}
        {renderSubMenu('Settings', 'settings', isSubMenuOpen2, setIsSubMenuOpen2)}
      </div>
    );
  };

  const renderDesktopSignedInLinks = () => {
    if (landing) {
      return (
        <>
          <Link href='/blog'><p>Blog</p></Link>
          <Link href='/dashboard'><p>Dashboard</p></Link>
          <Link href='/settings'><p>Settings</p></Link>
        </>
      );
    } else {
      return (
        <>
          <Link href='/dashboard'><p>Dashboard</p></Link>
          <Link href='/settings'><p>Settings</p></Link>
        </>
      );
    }
  };

  const renderSubMenu = (title, path, isOpen, setOpen) => {
    return (
      <>
        <div onClick={() => setOpen(!isOpen)}>
          {title}
          <img src={router.pathname.includes(`/${path}`) || isOpen ? '/menu-dropper-active.svg' : '/menu-dropper.svg'} />
        </div>
        {(isOpen || router.pathname.includes(`/${path}`)) && (
          <div id='mobile-sub-menu'>
            <Link href={`/${path}/linked-accounts`}>Linked Accounts</Link>
            <Link href={`/${path}/account-settings`}>Account Settings</Link>
            <Link href={`/${path}/billing`}>Billing</Link>
            title === 'Settings' && <button onClick={signOutUser} disabled={isSignOutClicked}>Sign Out</button>
          </div>
        )}
      </>
    );
  };

  const renderSignedOutLinks = () => {
    return (
      <>
        <Link href='/blog'><p>Blog</p></Link>
        <Link href='/pricing'><p>Pricing</p></Link>
        <Link href='/sign-in'><p>Sign In</p></Link>
      </>
    );
  };

  const isMobile = () => windowWidth < 750;

  const shouldRenderMobileLinks = () => {
    return (router.pathname.includes('dashboard') || router.pathname.includes('settings')) && windowWidth < 1215 || isMobile();
  };

  return (
    <div id='header'>
      <span className='logo' onClick={() => router.push('/')}>
        <img src='/logo.svg' alt='logo' />
        <span className='logo-text'>
          <span style={{ fontWeight: 'bold' }}>{windowWidth < 500 ? 'S' : 'Sum'}</span>
          <span style={{ fontWeight: 'regular' }}>{windowWidth < 500 ? 'B' : 'Broo'}</span>
        </span>
      </span>

      { shouldRenderMobileLinks() ? 
        <SlideMenu links={renderLinks(true)} /> :
        <div className='desktop-menu'>
          { renderLinks(false) }
        </div>
      }
    </div>
  );
};

export default Header;