import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ibmLogo from "@/assets/ibm-logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        isScrolled ? "bg-card/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <img
              src={ibmLogo}
              alt="IBM Logo"
              className="h-8 md:h-10 w-auto"
            />
            <span className="text-xl md:text-2xl font-bold text-foreground">
              Cursos IBM
            </span>
          </div>

          <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
            <li>
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-foreground hover:text-primary transition-smooth"
              >
                Início
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("cursos")}
                className="text-foreground hover:text-primary transition-smooth"
              >
                Cursos
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("time")}
                className="text-foreground hover:text-primary transition-smooth"
              >
                Sobre
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("inscricao")}
                className="text-foreground hover:text-primary transition-smooth"
              >
                Contato
              </button>
            </li>
          </ul>

          <Button
            size="sm"
            onClick={() => scrollToSection("inscricao")}
            className="hidden md:inline-flex"
          >
            Inscreva-se
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
