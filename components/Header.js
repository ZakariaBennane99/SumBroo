/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useRef, useState } from 'react';
import { Tadpole } from "react-svg-spinners";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { slide as BurgerMenu } from 'react-burger-menu';
import SlideMenu from './SlideMenu';

const Header = ({ signedIn }) => {

  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    // Update the window width when the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  const [isSubMenuOpen1, setIsSubMenuOpen1] = useState(false)
  const [isSubMenuOpen2, setIsSubMenuOpen2] = useState(false)

  const router = useRouter();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const styles = {
    bmBurgerButton: {
      position: 'relative',
      width: '36px',
      height: '30px',
      right: '15px',
      top: '15px'
    },
    bmCross: {
      background: '#bdc3c7'
    },
    bmBurgerBars: {
      background: '#373a47'
    },
    bmBurgerBarsHover: {
      background: '#a90000'
    },
    bmCrossButton: {
      height: '24px',
      width: '24px'
    },
    bmCross: {
      background: '#bdc3c7'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%'
    },
    bmMenu: {
      background: '#373a47',
      padding: '2.5em 1.5em 0',
      fontSize: '1.15em',
      left: '0',
      top: '0',
      transform: 'translateX(12vw)'
    },
    bmMorphShape: {
      fill: '#373a47'
    },
    bmItemList: {
      color: '#b8b7ad',
      padding: '0.8em'
    },
    bmItem: {
      display: 'inline-block'
    }
    // ... other styles you want to customize
  };

  const renderLinks = (isMobile) => (
    <>
      {
        signedIn ? (
          isMobile ? 
            <div id='mobile-sub-menu-wrapper'>
              <p onClick={() => setIsSubMenuOpen1(!isSubMenuOpen1)} style={{  
                color: router.pathname.includes('/dashboard') ? '#484876' : '', margin: '0px' }} >Dashboard <span> {
                  (router.pathname.includes('/dashboard') || isSubMenuOpen1 ) ? <img style={{ height: 'fit-content' }} src={router.pathname.includes('/dashboard') ? '/menu-dropper-active.svg' : '/menu-dropper-inactive.svg' } /> : <img style={{ width: '16px' }} src='/menu-dropper.svg' />
                }</span></p>
                {
                  (isSubMenuOpen1 || router.pathname.includes('dashboard')) ?
                  <div id='mobile-sub-menu'>
                    <Link href='/dashboard/publish-a-post' style={{ color: router.pathname === '/dashboard/publish-a-post' ? 'rgb(72, 72, 118)' : 'none' }}>
                      Publish Post
                    </Link>
                    <Link href='/dashboard/analytics' style={{ color: router.pathname === '/dashboard/analytics' ? 'rgb(72, 72, 118)' : 'none'}}>
                      Analytics
                    </Link>
                    <Link href='/dashboard/posts-status' style={{ color: router.pathname === '/dashboard/posts-status' ? 'rgb(72, 72, 118)' : 'none'}}>
                      Post Status
                    </Link>
                    <Link href='/dashboard/archived-posts' style={{ color: router.pathname === '/dashboard/archived-posts' ? 'rgb(72, 72, 118)' : 'none'}}>
                      Archive
                    </Link>
                  </div> 
                  : ''
                }

            </div>:
            <Link href='/dashboard'>
              <p style={{ 
                borderBottom: router.pathname.includes('/dashboard') ? '2px solid #484876' : 'none', 
                color: router.pathname.includes('/dashboard') ? '#484876' : '' }} >Dashboard</p>
          </Link>
        )
          : <Link href='/blog'><p style={{ 
            borderBottom: router.pathname.includes('/blog') ? '2px solid #484876' : 'none', 
            color: router.pathname.includes('/blog') ? '#484876' : '' }} >Blog</p></Link>
      }
      {
        signedIn ? (
          isMobile ? 
            <div id='mobile-sub-menu-wrapper'>
              <p onClick={() => setIsSubMenuOpen2(!isSubMenuOpen2)} style={{  
                color: router.pathname.includes('/settings') ? '#484876' : '', margin: '0px', width: '188.67px' }} >Settings <span> {
                  (router.pathname.includes('/settings') || isSubMenuOpen2 ) ? <img style={{ height: 'fit-content' }} src={router.pathname.includes('/settings') ? '/menu-dropper-active.svg' : '/menu-dropper-inactive.svg' } /> : <img style={{ width: '16px' }} src='/menu-dropper.svg' />
                }</span></p>
                {
                  (isSubMenuOpen2 || router.pathname.includes('settings')) ?
                  <div id='mobile-sub-menu'>
                    <Link href='/settings/linked-accounts' style={{ color: router.pathname === '/settings/linked-accounts' ? 'rgb(72, 72, 118)' : 'none'}}>
                      Linked Accounts
                    </Link>
                    <Link href='/settings/account-settings' style={{ color: router.pathname === '/settings/account-settings' ? 'rgb(72, 72, 118)' : 'none'}}>
                      Account Settings
                    </Link>
                    <Link href='/settings/billing' style={{ color: router.pathname === '/settings/billing' ? 'rgb(72, 72, 118)' : 'none'}}>
                      Billing
                    </Link>
                    <span className="sign-out">
                      Sign Out
                    </span>
                  </div> 
                  : ''
                }

            </div> :
            <Link href='/settings'>
              <p style={{ 
                borderBottom: router.pathname.includes('/settings') ? '2px solid #484876' : 'none', 
                color: router.pathname.includes('/settings') ? '#484876' : '' }} >Settings</p>
            </Link>
        )
          : <>
            <Link href='/pricing'><p style={{ 
              borderBottom: router.pathname.includes('/pricing') ? '2px solid #484876' : 'none', 
              color: router.pathname.includes('/pricing') ? '#484876' : '' }} >Pricing</p></Link>
            <Link href='/sign-in'><p style={{ 
              borderBottom: router.pathname.includes('/sign-in') ? '2px solid #484876' : 'none', 
              color: router.pathname.includes('/sign-in') ? '#484876' : '' }}>Sign In</p></Link>
          </>
      }
    </>
  );

  return (
    <div id='header'>
      <span className='logo' onClick={() => router.push('/')}>
        <img src='/logo.svg' alt='logo' />
        <span className='logo-text'>
          <span style={{ fontWeight: 'bold' }}>{windowWidth < 500 ? 'S' : 'Sum'}</span>
          <span style={{ fontWeight: 'regular' }}>{windowWidth < 500 ? 'B' : 'Broo'}</span>
        </span>
      </span>

      {
        (router.pathname.includes('dashboard') || router.pathname.includes('settings')) && windowWidth < 1215 || windowWidth < 750 ? 
        <SlideMenu links={renderLinks(true)} /> :
        <div className='desktop-menu'>
          { renderLinks() }
        </div>
      }

    </div>
  );
};

export default Header;
