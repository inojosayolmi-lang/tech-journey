import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import ibmLogo from "@/assets/ibm-logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={ibmLogo}
                  alt="IBM Logo"
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold text-foreground">Cursos IBM</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Desenvolvendo profissionais para a era da Inteligência Artificial.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Links Rápidos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#inicio" className="hover:text-primary transition-smooth">
                    Início
                  </a>
                </li>
                <li>
                  <a href="#cursos" className="hover:text-primary transition-smooth">
                    Cursos
                  </a>
                </li>
                <li>
                  <a href="#time" className="hover:text-primary transition-smooth">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#inscricao" className="hover:text-primary transition-smooth">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Redes Sociais</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-smooth flex items-center justify-center"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-smooth flex items-center justify-center"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-smooth flex items-center justify-center"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-smooth flex items-center justify-center"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              © 2025 Cursos IBM | Projeto desenvolvido pelos alunos da Geração Caldeira.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
