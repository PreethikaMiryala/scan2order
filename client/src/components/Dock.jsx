import "./Dock.css";

const defaultLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Cart", href: "/cart" },
  { label: "Orders", href: "/admin/dashboard" },
];

export default function Dock({ links = defaultLinks, className = "" }) {
  return (
    <nav className={`dock-shell ${className}`} aria-label="Quick actions">
      <ul className="dock-list">
        {links.map((item, index) => (
          <li key={index} className="dock-item">
            <a href={item.href} className="dock-link">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
