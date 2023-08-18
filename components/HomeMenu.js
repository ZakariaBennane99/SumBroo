import Link from "next/link";
import { useRouter } from 'next/router';

const HomeMenu = () => {

    const router = useRouter();

    return (<div className="leftSectionHome">
        <Link href='/dashboard/publish-a-post' style={{backgroundColor: router.pathname === '/dashboard/publish-a-post' ? '#e4e4eb' : 'none'}}>
          Publish Post
        </Link>
        <Link href='/dashboard/analytics' style={{backgroundColor: router.pathname === '/dashboard/analytics' ? '#e4e4eb' : 'none'}}>
          Analytics
        </Link>
        <Link href='/dashboard/posts-status' style={{backgroundColor: router.pathname === '/dashboard/posts-status' ? '#e4e4eb' : 'none'}}>
          Post Status
        </Link>
        <Link href='/dashboard/archived-posts' style={{backgroundColor: router.pathname === '/dashboard/archived-posts' ? '#e4e4eb' : 'none'}}>
          Archive
        </Link>
    </div>)
};

export default HomeMenu;
