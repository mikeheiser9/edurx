export default () => {
  return (
    <header className="flex bottom-0 justify-center fixed w-full bg-primary-dark p-2">
      <h1 className="text-white text-2xl font-bold">
        &copy; EduRx {new Date().getFullYear()}
      </h1>
    </header>
  );
};
