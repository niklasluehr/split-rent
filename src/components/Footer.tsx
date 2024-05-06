export const Footer = () => {
  return (
    <footer className="absolute bottom-2 flex w-full justify-center text-center">
      <span className="text-xs opacity-60">
        Copyright ©{" "}
        <a
          className="underline"
          href="https://niklasluehr.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Niklas Lühr
        </a>
        {" " + new Date().getFullYear()}
      </span>
    </footer>
  );
};
