import React, { useState } from "react";
import SettingSidebar from "./SettingSidebar";
import PersonalInfo from "./PersonalInfo";
import Password from "./Password";
import TwoFA from "./2FA";
import Breadcrumb from "../../components/Breadcrumb";
import backward from "../../assets/SVG/backward.svg";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="flex flex-col p-2 gap-4">
      <Breadcrumb
        items={[{ label: "Dashboard", path: "/" }, { label: "Setting" }]}
      />
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl fw6 font-roboto text-[#232323] leading-[140%] tracking-[-3%]">
          Setting
        </h2>

        <p className="text-[#232323] fw4 text-sm leading-[150%] tracking-[-3%]">
          View and manage your profile and account setting.
        </p>
      </div>
      {/* <div className="flex gap-6  ">
        <SettingSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "personal" && <PersonalInfo />}
        {activeTab === "password" && <Password />}
        {activeTab === "2fa" && <TwoFA />}
      </div> */}

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div
          className={` lg:flex w-full lg:w-[330px] lg:gap-6 ${
            activeTab ? "hidden" : "block"
          } lg:block`}
        >
          <SettingSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div
          className={`flex-1 w-full ${activeTab ? "block" : "hidden"} lg:block`}
        >
          <p className="lg:hidden pb-4 text-sm fw4 font-inter hover:bg-[#f39a51] flex items-center gap-2">
            <img
              src={backward}
              alt="backward"
              onClick={() => setActiveTab(null)}
            />
            Back to Settings
          </p>

          {activeTab === "personal" && <PersonalInfo />}
          {activeTab === "password" && <Password />}
          {activeTab === "2fa" && <TwoFA />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
