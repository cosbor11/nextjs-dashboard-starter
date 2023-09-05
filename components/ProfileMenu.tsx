import { useState, useEffect, Fragment } from 'react';
import { ChevronDownIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../contexts/AuthContext';
import { Img } from 'react-image';
import { UserIcon } from '@heroicons/react/24/solid';
import {TbLogout} from 'react-icons/tb';

const userNavigation = [
  { name: 'Me', href: 'me', icon: <UserIcon height={17} width={17}/> },
  { name: 'Change Password', href: 'update-password', icon: <LockClosedIcon height={17} width={17}/> },
  { name: 'Sign out', href: 'signin?logout=true', icon:<TbLogout className="p-0 ml-1" height={20} width={20}/>}
]

const ProfileMenu = () => {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user?.photoURL) {
      setImageError(false);
    }
  }, [user]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleError = () => {
    setImageError(true);
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="-m-1.5 flex items-center p-1.5 ">
        <span className="sr-only">Open user menu</span>
        {user?.photoURL && !imageError ? (
          <Img
            className="h-11 w-11 border-orange-400 border rounded-full bg-gray-50"
            src={user?.photoURL}
            alt=""
            onError={handleError}
          />
        ) : (
          <div className="h-11 w-11 border-orange-400 border rounded-full bg-gray-50 flex items-center justify-center text-sm font-semibold">
            {getInitials(user?.displayName)}
          </div>
        )}
        <span className="hidden">
          <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
            {user?.displayName}
          </span>
          <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
        {userNavigation.map((item) => (
            <Menu.Item key={item.name}>
              <a href={item.href} className="flex px-3 py-1 text-sm leading-4 text-slate-700 hover:text-slate-400 w-full">
                <div className='mr-2'>
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </a>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileMenu;
