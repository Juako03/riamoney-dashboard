export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="px-8 py-4">
        <h1 
          className="text-2xl font-extrabold"
          style={{ color: 'var(--accent)' }}
        >
          Currency Exchange Dashboard
        </h1>
      </div>
    </nav>
  );
}
