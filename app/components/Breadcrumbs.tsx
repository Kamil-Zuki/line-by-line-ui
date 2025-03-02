'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Breadcrumbs = () => {
  const pathname = usePathname();
  
  // Split the pathname into segments and filter out empty strings
  const pathSegments = pathname.split('/').filter(segment => segment);

  // Create breadcrumb items
  const crumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    
    return {
      href,
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      isLast
    };
  });

  return (
    <nav className="py-2 px-5 text-sm text-neutral-400">
      <ol className="flex items-center space-x-2">
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center">
            <span className="mx-2">/</span>
            {crumb.isLast ? (
              <span className="text-neutral-200">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-neutral-200">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;