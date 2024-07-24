import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react';

function Header() {
  const headerMenu = [
    {
      id: 1,
      name: 'Ride',
      icon: '/taxi.png', // Updated to use absolute path
    },
  
  ];

  return (
    <div>
      <div className='p-5 pb-3 pl-10 border-b-[4px] border-gray-200 flex items-center justify-between'>
        <div className='flex gap-24 items-center'>
        <span className="text-3xl font-bold text-gray-800">Ambu<span className="text-red-500">X</span></span>
            {/* <Image src='/logo.png' width={70} height={70} alt='Logo' /> */}
            <div className='flex gap-6 items-center'> {/* Add flex container for menu items */}
            {headerMenu.map((item) => (
                <div className='flex gap-2 items-center'>
                <Image src="/ambulance4.png" width={25} height={25} alt={item.name} />
                <h2> Rides</h2>
                </div>
            ))}
            </div>
        </div>
        <UserButton afterSignOutUrl='/sign-in'/>
        
      </div>
    </div>
  );
}

export default Header;
