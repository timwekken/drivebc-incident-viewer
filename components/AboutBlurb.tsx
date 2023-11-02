import { FC } from "react";
import AboutIcon from "./icons/AboutIcon";
import CloseIcon from "./icons/CloseIcon";

interface AboutBlurbProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AboutBlurb: FC<AboutBlurbProps> = ({ children, isOpen, setIsOpen }) => {
  const openBlurb = () => setIsOpen(true);
  const closeBlurb = () => setIsOpen(false);

  return (
    <div
      className="absolute z-50 right-0 rounded-bl-md bg-white 
                shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] 
                border-slate-200 border-b-[1px] text-sm text-info"
    >
      {!isOpen ? (
        <button onClick={openBlurb} className="h-10 flex items-center">
          <AboutIcon />
          <span className="middle pr-2">About</span>
        </button>
      ) : (
        <div className="pt-4 pb-4 pr-8">
          <AboutIcon isAbsolute />
          <div className="relative z-10 ml-[80px]">
            <>
              <button className="absolute -right-6" onClick={closeBlurb}>
                <CloseIcon />
              </button>
              {children}
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutBlurb;
