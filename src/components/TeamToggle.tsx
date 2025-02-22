import React from 'react';
import { useToggle } from './TeamToggleContext';

export default function Nav() {
  const { toggle, setToggle } = useToggle();

  return (
    <div className="flex rounded-xl text-xs font-bold overflow-hidden">
      <button
        onClick={() => setToggle('individual')}
        className={`px-4 py-2 ${toggle === 'individual' ? 'bg-black text-white' : 'bg-gray-300'}`}
      >
        Individual
      </button>
      <button
        onClick={() => setToggle('team')}
        className={`px-4 py-2 ${toggle === 'team' ? 'bg-black text-white' : 'bg-gray-300'}`}
      >
        Team
      </button>
    </div>
  );
}