import Link from "next/link";
import { useRouter } from 'next/router';

const SettingsMenu = () => {

    const router = useRouter();

    return (<div className="leftSectionHome" style={{ width: '15%' }}>
        <Link href='/settings/linked-accounts' style={{backgroundColor: router.pathname === '/settings/linked-accounts' ? '#e4e4eb' : 'none'}}>
          Linked Accounts
        </Link>
        <Link href='/settings/account-settings' style={{backgroundColor: router.pathname === '/settings/account-settings' ? '#e4e4eb' : 'none'}}>
          Account Settings
        </Link>
        <Link href='/settings/billing' style={{backgroundColor: router.pathname === '/settings/billing' ? '#e4e4eb' : 'none'}}>
          Billing
        </Link>
        <span className="sign-out">
          Sign Out
        </span>
    </div>)
};

export default SettingsMenu;
