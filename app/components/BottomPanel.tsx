import React from "react";
import BottomButton from "./BottomButton";
import Image from "next/image";
import OverviewIcon from "./icons/OverviewIcon";
import FilesIcon from "./icons/FilesIcon";
import SettingsIcon from "./icons/SettingsIcon";

const BottomPanel = () => {
  return (
    <div className="rounded-xl h-auto p-16 flex flex-col md:flex-row gap-16 justify-between items-start md:items-center glass-panel">
      <div className="flex items-center gap-16">
        <div className="w-48 h-48 bg-gradient-to-t from-[#7F98FF] rounded-md to-[#9764FC] relative shrink-0">
          <Image
            src="/images/nissan.png"
            alt="Description"
            fill
            className="object-contain rounded-full p-8"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-white">Nissan Europe</h3>
          <p className="text-gray-400 text-sm">europe@nissan.com</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-12 sm:gap-16 items-center w-full md:w-auto">
        <BottomButton variant="primary">
          <div className="flex items-center gap-4">
            <OverviewIcon  className="text-white size-16" />
            <p>Overview</p>
          </div>
        </BottomButton>
        <BottomButton>
          <div className="flex items-center gap-4">
            <FilesIcon className="text-white size-16" />
            <p>Older Files</p>
          </div>
        </BottomButton>
        <BottomButton>
          <div className="flex items-center gap-4">
            <SettingsIcon className="text-white size-16" />
            <p>Projects</p>
          </div>
        </BottomButton>
      </div>
    </div>
  );
};

export default BottomPanel;
