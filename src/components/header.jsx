function Header({ name, color }) {
  return (
    <header>
      <h1 style={{ color: color }}>
        {name}
      </h1>
    </header>
  );
}

export default Header;