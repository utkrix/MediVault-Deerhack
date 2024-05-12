const Nav = ({ text, number }) => {
  return (
    <div className="flex items-center">
      <h1 className="flex justify-center items-center border-primary border-2 rounded-full text-base w-7 h-7">
        {number}
      </h1>
      <h1 className="ml-2">{text}</h1>
    </div>
  );
};

export default Nav;
