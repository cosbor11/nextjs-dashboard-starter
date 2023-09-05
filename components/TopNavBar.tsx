import HamburgerButton from './HamburgerButton'
import SearchBar from './SearchBar'
import NotificationButton from './NotificationButton'
import ProfileMenu from './ProfileMenu'

type TopNavBarProps = {
    onHamburgerClick: (open: boolean) => void;
};

const TopNavBar: React.FC<TopNavBarProps> = ({ onHamburgerClick }) => {
    return (
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 app-bar pl-4 pr-2 lg:pl-5 lg:pr-3 shadow-sm" >
            <HamburgerButton onClick={onHamburgerClick} />

            {/* Separator */}
            <div className="h-6 w-px bg-gray-900/10" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch">
                <SearchBar className="app-bar-text-color" textClassName='app-bar-text-color' />

                <div className="flex items-center gap-x-4">
                    <NotificationButton />
                    <ProfileMenu />
                </div>
            </div>
        </div>
    );
};

export default TopNavBar;