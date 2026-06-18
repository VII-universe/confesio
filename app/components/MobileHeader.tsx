"use client";

import React, { useState } from "react";
import Navigation from "./Navigation";
import MenuIcon from "./icons/MenuIcon";
import CloseIcon from "./icons/CloseIcon";

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="lg:hidden w-full flex justify-between items-center p-16 bg-[#060B28] border-b border-borderBlue sticky top-0 z-40">
        <h1 className="font-bold text-2xl text-white">Confesio</h1>
        <button
          onClick={toggleMenu}
          className="p-8 text-white bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors duration-200"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <CloseIcon className="size-24" />
          ) : (
            <MenuIcon className="size-24" />
          )}
        </button>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop overlay */}
        <div
          onClick={toggleMenu}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Drawer content */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-280 bg-[#060B28] border-r border-borderBlue transition-transform duration-300 ease-out p-16 flex flex-col ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-16 pl-8">
            <h2 className="text-xl font-bold text-white">Navigation</h2>
            <button
              onClick={toggleMenu}
              className="p-8 text-white bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer"
              aria-label="Close menu"
            >
              <CloseIcon className="size-20" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {/* Render full Navigation sidebar inside mobile container */}
            <Navigation />
          </div>
        </div>
      </div>
    </>
  );
}
