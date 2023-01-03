import { useState } from "react";

const AboutIconBG = ({ isAbsolute = false }: { isAbsolute?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="#3f5661"
    opacity={0.5}
    className={`${
      isAbsolute ? "absolute w-[80px]" : "inline-block w-8 h-8 mt-1 ml-1"
    }`}
    style={
      isAbsolute ? { height: "calc(100% - 1rem)", marginTop: "-0.5rem" } : {}
    }
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
    />
  </svg>
);

const CloseMark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const AdjustedBlurb = ({ isMobile = false, className, children }: any) => {
  const [isOpen, setIsOpen] = useState(!isMobile);

  if (!isMobile && !isOpen) return null;

  return (
    <div
      className={`${className} absolute md:relative bg-white md:w-full shadow-md 
          border-slate-200 border-b-[1px] z-50 text-sm text-[#3f5661]`}
    >
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            height: "2.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AboutIconBG />
          <span className="middle pl-1 pr-2">About</span>
        </button>
      ) : (
        <div className="pt-4 pb-4 pr-8">
          <AboutIconBG isAbsolute />
          <div className="relative z-10 ml-[80px]">
            <>
              {isMobile && (
                <button
                  className="absolute -right-6"
                  onClick={() => setIsOpen(false)}
                >
                  <CloseMark />
                </button>
              )}
              {children}
            </>
          </div>
        </div>
      )}
    </div>
  );
};

const AboutBlurb = ({ children }: any) => {
  return (
    <>
      <AdjustedBlurb className={"md:hidden right-0 rounded-md"} isMobile>
        {children}
      </AdjustedBlurb>
      <AdjustedBlurb className={"hidden md:block"}>{children}</AdjustedBlurb>
    </>
  );
};

export default AboutBlurb;
