import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Navigation = () => {
    return (
        <nav className="bg-purple-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    Braille Toolbox
                </div>
                <div className="hidden md:flex space-x-4">
                    <Link to="/" className="text-white hover:bg-purple-700 px-3 py-2 rounded">Home</Link>
                    <Link to="/quick-reference" className="text-white hover:bg-purple-700 px-3 py-2 rounded">Quick Reference</Link>
                    <Link to="/write-in-braille" className="text-white hover:bg-purple-700 px-3 py-2 rounded">Write in Braille</Link>
                    <Link to="/dot-decoder" className="text-white hover:bg-purple-700 px-3 py-2 rounded">Dot Decoder</Link>
                    <Link to="/braillewriter-help" className="text-white hover:bg-purple-700 px-3 py-2 rounded">Braillewriter Help</Link>
                    <Link to="/slate-stylus" className="text-white hover:bg-purple-700 px-3 py-2 rounded">Slate & Stylus</Link>
                </div>
                <div className="md:hidden">
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-purple-600 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none">
                                Menu
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link to="/" className={`block px-4 py-2 text-sm ${active ? 'bg-purple-100' : ''}`}>Home</Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link to="/quick-reference" className={`block px-4 py-2 text-sm ${active ? 'bg-purple-100' : ''}`}>Quick Reference</Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link to="/write-in-braille" className={`block px-4 py-2 text-sm ${active ? 'bg-purple-100' : ''}`}>Write in Braille</Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link to="/dot-decoder" className={`block px-4 py-2 text-sm ${active ? 'bg-purple-100' : ''}`}>Dot Decoder</Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link to="/braillewriter-help" className={`block px-4 py-2 text-sm ${active ? 'bg-purple-100' : ''}`}>Braillewriter Help</Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link to="/slate-stylus" className={`block px-4 py-2 text-sm ${active ? 'bg-purple-100' : ''}`}>Slate & Stylus</Link>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;