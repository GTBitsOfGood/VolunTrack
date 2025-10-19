import { useState } from "react";
import { Button } from "flowbite-react";
import { HiX } from "react-icons/hi";
import useWindowDimensions from "./GetWindowDimensions";

export default function HomePageHeader({ goToCreateAcc, goToLogin }) {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowDimensions();

  return width > 850 ? (
    <div className="mx-6 my-4 flex flex-row justify-between self-stretch px-[6%] py-4">
      <div className="">
        <a href="/" className="flex">
          <img src={"/images/voluntrack.svg"} alt="org logo" className="h-10" />
        </a>
        <a href="https://bitsofgood.org/" className="flex">
          <img src={"/images/bog.svg"} alt="org logo" className="h-6" />
        </a>
      </div>
      <div className="hidden w-[40%] justify-evenly md:flex">
        <a href="/" className="flex self-center text-lg text-black">
          Home
        </a>
        <a href="#product" className="flex self-center text-lg text-black">
          Product
        </a>
        <a
          href="https://bitsofgood.org/about"
          className="flex self-center text-lg text-black"
        >
          About
        </a>
        <a
          href="https://bitsofgood.org/contact"
          className="flex self-center text-lg text-black"
        >
          Contact
        </a>
      </div>
      <div className="flex flex-col items-end md:flex-row-reverse md:items-center">
        <Button
          onClick={goToCreateAcc}
          className="ml-1 mr-2 flex border-0 bg-purple-700 hover:bg-purple-600"
          size="sm"
        >
          Create Volunteer Account
        </Button>
        <button
          onClick={goToLogin}
          className="mr-4 text-purple-600 hover:text-purple-700 hover:underline"
        >
          Login
        </button>
      </div>
    </div>
  ) : (
    <div>
      <div className="mx-6 my-4 flex flex-row items-center justify-between self-stretch px-[6%] py-4">
        <div className="">
          <a href="/" className="flex">
            <img
              src={"/images/voluntrack.svg"}
              alt="org logo"
              className="h-10"
            />
          </a>
          <a href="https://bitsofgood.org/" className="flex">
            <img src={"/images/bog.svg"} alt="org logo" className="h-6" />
          </a>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center rounded-md bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-600"
        >
          Menu
        </button>
      </div>
      <div
        className={`fixed right-0 top-0 z-40 h-screen w-80 transform bg-white p-4 transition-transform dark:bg-gray-800 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <HiX className="h-5 w-5" />
          <span className="sr-only">Close menu</span>
        </button>

        <h5 className="mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
          Menu
        </h5>
        <nav className="flex flex-col space-y-2">
          <a href="/" className="py-2 text-purple-600">
            Home
          </a>
          <a href="#product" className="py-2 text-purple-600">
            Product
          </a>
          <a
            href="https://bitsofgood.org/about"
            className="py-2 text-purple-600"
          >
            About
          </a>
          <a
            href="https://bitsofgood.org/contact"
            className="py-2 text-purple-600"
          >
            Contact
          </a>
          <hr className="my-2" />
          <button
            onClick={goToLogin}
            className="py-2 text-left text-purple-600 hover:underline"
          >
            Login
          </button>
          <Button
            onClick={goToCreateAcc}
            className="mt-2 w-full bg-purple-700 hover:bg-purple-600"
            size="sm"
          >
            Create Volunteer Account
          </Button>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
