import React from "react";
import Typography from "../Reusable/Typography";

export default function TopBar() {
  return (
    <div className=" h-20 w-full border-b border-secondary bg-white text-black dark:bg-black dark:text-white">
      <div className="grid grid-cols-2 gap-5 px-8 py-4 h-full">
        <div className="w-full h-full  flex-col items-start justify-start">
          <Typography variant="h3">Quran Mazid</Typography>
          <Typography variant="small">Read, Study and Learn the Quran</Typography>
        </div>
        <div className="w-full h-full "></div>
      </div>
    </div>
  );
}
