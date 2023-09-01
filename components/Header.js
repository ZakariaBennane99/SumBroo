import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SlideMenu from './SlideMenu';

const Header = ({ signedIn, isLanding, width }) => {

  const landing = isLanding || false;

  const [isSubMenuOpen1, setIsSubMenuOpen1] = useState(false);
  const [isSubMenuOpen2, setIsSubMenuOpen2] = useState(false);
  const [isSignOutClicked, setIsSignOutClicked] = useState(false);
  const router = useRouter();

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
          <Link href='/blog'><p style={{ 
          color: router.pathname.includes('blog') ? '#1c1c57' : ''
          }}>Blog</p></Link>
          <Link href='/dashboard'><p style={{ 
          color: router.pathname.includes('pricing') ? '#1c1c57' : ''
          }}>Dashboard</p></Link>
          <Link href='/settings'><p style={{ 
          color: router.pathname.includes('sign-in') ? '#1c1c57' : ''
          }}>Settings</p></Link>
        </>
      );
    } else {
      return (
        <>
          <Link href='/dashboard'><p style={{ 
            color: router.pathname.includes('dashboard') ? '#1c1c57' : ''
          }}>Dashboard</p></Link>
          <Link href='/settings'><p style={{ 
            color: router.pathname.includes('settings') ? '#1c1c57' : ''
          }}>Settings</p></Link>
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
            { title === 'Settings' && <button onClick={signOutUser} disabled={isSignOutClicked}>Sign Out</button> }
          </div>
        )}
      </>
    );
  };

  const renderSignedOutLinks = () => {
    return (
      <>
        <Link href='/blog'><p style={{ 
          color: router.pathname.includes('blog') ? '#1c1c57' : ''
         }}>Blog</p></Link>
        <Link href='/pricing'><p style={{ 
          color: router.pathname.includes('pricing') ? '#1c1c57' : ''
         }}>Pricing</p></Link>
        <Link href='/sign-in'><p style={{ 
          color: router.pathname.includes('sign-in') ? '#1c1c57' : ''
         }}>Sign In</p></Link>
      </>
    );
  };

  const isMobile = () => width < 750;

  const shouldRenderMobileLinks = () => {
    return (router.pathname.includes('dashboard') || router.pathname.includes('settings')) && width < 1215 || isMobile();
  };

  return (
    <div id='header'>
      <span className='logo' onClick={() => router.push('/')}>
        <img src='/logo.svg' alt='logo' />
        <span className='logo-text'>
          <span style={{ fontWeight: 'bold' }}>{width < 500 ? 'S' : 'Sum'}</span>
          <span style={{ fontWeight: 'regular' }}>{width < 500 ? 'B' : 'Broo'}</span>
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