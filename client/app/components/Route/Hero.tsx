import React, { FC } from "react";
import { BiSearch } from "react-icons/bi";
import Image from "next/image";

type Props = {};
const Hero: FC<Props> = (props) => {
  return (
    <div className="w-full 1000px:flex items-center">
      <div className="flex items-center justify-center 1000px:w-[40%] min-h-screen 1000px:pt-[0]">
        <div className="flex items-center justify-center p-8 w-[80%] rounded-full hero_animation">
          <Image
            src={require("../../../public/assets/Hero.png")}
            alt=""
            className="object-contain w-[100%] h-[100%]"
          />
        </div>
      </div>

      <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left ">
        <h1 className="dark:text-white text-[#000000c7] font-Poppins font-[800] text-[50px] 1500px:!w-[55%] 1100px:!w-[78%] mb-5">
          Improve your online learning experience better instantly
        </h1>
        <h2 className="dark:text-white text-[#000000c7] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[78%]">
          We have Online courses & Online registered students. Find your desired
          Courses from them.
        </h2>
        <br />
        <div className="1500px:w-[55%] 1100px:2-[70%] w-[90%] h-[50px] bg-transparent relative">
          <input
            type="search"
            placeholder="Search Courses..."
            className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffff] rounded-[5px] p-2 w-full h-full outline-none "
          />
          <div className="absolute flex items-center justify-center w-[50px] h-full right-0 top-0 bg-[#39c1f3] rounded-r-[5px]">
            <BiSearch className="text-white" size={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
