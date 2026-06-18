import React from "react";

type BottomButtonProps = {
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
};

const BottomButton = ({ children, variant }: BottomButtonProps) => {
  const isPrimary = variant === "primary";
  const buttonStyle = isPrimary
    ? "bg-gradient-to-r from-[#7F3DFF] to-[#5a1cd6] border-transparent text-white shadow-[0_4px_12px_rgba(127,61,255,0.25)] hover:shadow-[0_4px_16px_rgba(127,61,255,0.4)]"
    : "bg-transparent border-[#351A99]/50 hover:border-[#582CFF] text-gray-400 hover:text-white hover:bg-white/5";
  return (
    <button
      className={`${buttonStyle} py-10 px-30 rounded-xl border transition-all duration-300 ease-out hover:scale-[1.04] active:scale-[0.97] cursor-pointer`}
    >
      {children}
    </button>
  );
};

export default BottomButton;
