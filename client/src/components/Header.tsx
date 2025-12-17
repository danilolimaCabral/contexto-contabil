import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/servicos", label: "Serviços" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/logo-modern.png"
              alt="Contexto Assessoria Contábil"
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                  location === "/admin" || location === "/dashboard"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Painel
              </Link>
            )}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://wa.me/5562990700393"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="btn-gold gap-2">
                <Phone className="h-4 w-4" />
                Fale Conosco
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary px-2 py-2 ${
                    location === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors hover:text-primary px-2 py-2 flex items-center gap-1 ${
                    location === "/admin" || location === "/dashboard"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Painel Administrativo
                </Link>
              )}
              <a
                href="https://wa.me/5562990700393"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2"
              >
                <Button className="btn-gold gap-2 w-full">
                  <Phone className="h-4 w-4" />
                  Fale Conosco
                </Button>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
