import { useEffect, useState } from 'react';
import { HomeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import LogoWithTitle from "./LogoWithTitle";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
];

const Sidebar: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const isCurrentPath = (href: string) => {
    return currentPath.startsWith(href);
  };

  return (
    <div className="flex grow border-r-1 shadow-lg shadow-orange-400/100 border-orange-300 flex-col gap-y-5 overflow-y-auto sidebar px-6 pb-4 ring-1 ring-white/10">
      <LogoWithTitle />
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${isCurrentPath(item.href)
                      ? 'sidebar-active-link'
                      : 'sidebar-link'}`}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <a
              href="/settings"
              className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${isCurrentPath("/settings")
                      ? 'sidebar-active-link'
                      : 'sidebar-link'}`}
            >
              <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default Sidebar;
