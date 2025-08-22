"use client";

import Link from "next/link";
import React, { useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
  NavItems,
} from "./ui/acertenity/resizable-navbar";

export default function Header() {
  const navItems = [
    {
      name: "Pricing",
      link: "#",
    },
    {
      name: "Contact",
      link: "#",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar className="top-0 ">
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href={"/manage-plan"}>
              <NavbarButton
                variant={"primary"}
                className="mr-4 bg-gradient-to-r from-[#2a3443] to-[#00679c] text-transparent bg-clip-text"
              >
                Manage Plan
              </NavbarButton>
            </Link>
            <div className="p-2 w-8 h-8 flex items-center justify-center rounded-full border border-[#2a3443]">
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <NavbarButton
                variant={"primary"}
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text"
              >
                Sign In
              </NavbarButton>
            </SignInButton>
          </SignedOut>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Login
            </NavbarButton>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Book a call
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
    // <header className="sticky top-0 z-50  left-0 right-0 px-4 md:px-0 bg-white/80 backdrop-blur-sm border-b border-gray-200">
    //   <div className="container mx-auto">
    //     <div className="w-full flex items-center justify-between h-16">
    //       {/* Left Section  */}
    //       <div className="flex items-center justify-content-center h-16">
    //         <Link href={"/"} className="flex items-center h-14">
    //           <Image
    //             src={"/assets/images/logo.png"}
    //             alt={""}
    //             width={50}
    //             height={50}
    //             objectFit="contain"
    //           />
    //           <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#00679c] to-[#2a3443] bg-clip-text text-transparent">
    //             Alpha Romeo
    //           </h1>
    //         </Link>
    //       </div>
    //       {/* Right Section  */}
    //       <div className="flex items-center gap-4">
    //         <SignedIn>
    //           <Link href={"/manage-plan"}>
    //             <Button
    //               variant={"outline"}
    //               className="mr-4 bg-gradient-to-r from-[#2a3443] to-[#00679c] text-transparent bg-clip-text"
    //             >
    //               Manage Plan
    //             </Button>
    //           </Link>
    //           <div className="p-2 w-8 h-8 flex items-center justify-center rounded-full border border-[#2a3443]">
    //             <UserButton />
    //           </div>
    //         </SignedIn>
    //         <SignedOut>
    //           <SignInButton mode="modal">
    //             <Button
    //               variant={"ghost"}
    //               className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text"
    //             >
    //               Sign In
    //             </Button>
    //           </SignInButton>
    //         </SignedOut>
    //       </div>
    //     </div>
    //   </div>
    // </header>
  );
}
