import { Link } from "wouter";
import { Instagram, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <img
              src="/logo-header.png"
              alt="Contexto Assessoria Contábil"
              className="h-16 w-auto"
            />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Simplificando a gestão contábil e fiscal da sua empresa, oferecendo
              todo o suporte que você precisa para crescer com segurança.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-primary mb-4">
              Links Rápidos
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Início
              </Link>
              <Link href="/sobre" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Sobre Nós
              </Link>
              <Link href="/servicos" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Serviços
              </Link>
              <Link href="/contato" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Contato
              </Link>
            </nav>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-primary mb-4">
              Serviços
            </h4>
            <nav className="flex flex-col gap-2">
              <span className="text-muted-foreground text-sm">Contabilidade Empresarial</span>
              <span className="text-muted-foreground text-sm">Consultoria Tributária</span>
              <span className="text-muted-foreground text-sm">Departamento Pessoal</span>
              <span className="text-muted-foreground text-sm">Assessoria Fiscal</span>
              <span className="text-muted-foreground text-sm">Abertura de Empresas</span>
            </nav>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-primary mb-4">
              Contato
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5562990700393"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Phone className="h-4 w-4 text-primary" />
                (62) 9907-0393
              </a>
              <a
                href="mailto:contextocontabilidadego@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Mail className="h-4 w-4 text-primary" />
                contextocontabilidadego@gmail.com
              </a>
              <div className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  Av. João Luiz de Almeida, 451<br />
                  Setor Crimeia Oeste<br />
                  Goiânia - GO, 74.563-230
                </span>
              </div>
              <a
                href="https://instagram.com/contexto.contabil"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Instagram className="h-4 w-4 text-primary" />
                @contexto.contabil
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider my-8" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {currentYear} Contexto Assessoria Contábil. Todos os direitos reservados.
          </p>
          <p>
            CNPJ: 35.664.761/0001-22
          </p>
        </div>
      </div>
    </footer>
  );
}
