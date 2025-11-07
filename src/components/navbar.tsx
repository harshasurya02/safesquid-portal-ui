import Image from "next/image";

const Navbar = () => {
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="flex items-center justify-between mt-[26px] mb-[24px] ml-[58px]">
        <Image
          src="/logo.png"
          width={211}
          height={32}
          alt="SafeSquid"
          className="h-8 w-[211px]"
        />
        <div>
          {/* <p>Hello, John Doe</p>
          <p>john.doe@example.com</p> */}

          {/* SearchBar */}
        </div>

        <div>{/* Avatar Menu */}</div>
      </div>
    </div>
  );
};

export default Navbar;
