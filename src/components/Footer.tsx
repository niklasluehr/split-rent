export const Footer = () => {
  return (
    <footer className="absolute bottom-2 flex w-full justify-center text-center">
      <span className="text-xs opacity-60">
        Copyright © Niklas Lühr
        {" " + new Date().getFullYear()}
      </span>
    </footer>
  );
};
