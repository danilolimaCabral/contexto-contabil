import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { MapView } from "@/components/Map";

const contactInfo = [
  {
    icon: Phone,
    title: "Telefone / WhatsApp",
    value: "(62) 9907-0393",
    href: "https://wa.me/5562990700393",
  },
  {
    icon: Mail,
    title: "E-mail",
    value: "contextocontabilidadego@gmail.com",
    href: "mailto:contextocontabilidadego@gmail.com",
  },
  {
    icon: MapPin,
    title: "Endereço",
    value: "Av. João Luiz de Almeida, 451\nQuadra 27 Lote 14 Sala 02\nSetor Crimeia Oeste\nGoiânia - GO, 74.563-230",
    href: "https://maps.google.com/?q=Av.+João+Luiz+de+Almeida,+451,+Setor+Crimeia+Oeste,+Goiânia+-+GO",
  },
  {
    icon: Instagram,
    title: "Instagram",
    value: "@contexto.contabil",
    href: "https://instagram.com/contexto.contabil",
  },
  {
    icon: Clock,
    title: "Horário de Funcionamento",
    value: "Segunda a Sexta\n08:00 às 18:00",
    href: null,
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createLeadMutation = trpc.leads.create.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    },
    onError: () => {
      toast.error("Erro ao enviar mensagem. Por favor, tente novamente.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Por favor, informe seu nome.");
      return;
    }
    createLeadMutation.mutate({
      ...formData,
      source: "contact_form",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Coordenadas do escritório em Goiânia
  const officeLocation = { lat: -16.6799, lng: -49.2556 };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-card to-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Entre em <span className="text-gold-gradient">Contato</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Estamos prontos para atender você. Entre em contato pelo formulário, 
              WhatsApp ou visite nosso escritório em Goiânia.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="font-serif text-2xl font-bold mb-6">
                Envie uma <span className="text-gold-gradient">Mensagem</span>
              </h2>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Mensagem Enviada!</h3>
                  <p className="text-muted-foreground mb-6">
                    Obrigado pelo contato. Nossa equipe entrará em contato em breve.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Enviar Nova Mensagem
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="(62) 99999-9999"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Empresa
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Nome da empresa"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mensagem
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Como podemos ajudar?"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="btn-gold w-full gap-2"
                    disabled={createLeadMutation.isPending}
                  >
                    {createLeadMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold mb-6">
                Informações de <span className="text-gold-gradient">Contato</span>
              </h2>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      {info.href ? (
                        <a
                          href={info.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground text-sm hover:text-primary transition-colors whitespace-pre-line"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground text-sm whitespace-pre-line">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick WhatsApp CTA */}
              <div className="p-6 bg-gradient-to-r from-[#C9A962] to-[#A68B4B] rounded-2xl">
                <h3 className="font-semibold text-black mb-2">
                  Prefere falar pelo WhatsApp?
                </h3>
                <p className="text-black/80 text-sm mb-4">
                  Clique no botão abaixo para iniciar uma conversa diretamente com nossa equipe.
                </p>
                <a
                  href="https://wa.me/5562990700393"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-black text-white hover:bg-black/90 gap-2 w-full">
                    <Phone className="h-5 w-5" />
                    Abrir WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Nossa <span className="text-gold-gradient">Localização</span>
            </h2>
            <p className="text-muted-foreground">
              Visite nosso escritório no Setor Crimeia Oeste, Goiânia - GO
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-border h-[400px]">
            <MapView
              onMapReady={(map) => {
                // Centralizar no escritório
                map.setCenter(officeLocation);
                map.setZoom(16);
                
                // Adicionar marcador
                new google.maps.Marker({
                  position: officeLocation,
                  map: map,
                  title: "Contexto Assessoria Contábil",
                  animation: google.maps.Animation.DROP,
                });
              }}
            />
          </div>

          <div className="mt-6 text-center">
            <a
              href="https://maps.google.com/?q=Av.+João+Luiz+de+Almeida,+451,+Setor+Crimeia+Oeste,+Goiânia+-+GO"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                <MapPin className="h-5 w-5" />
                Abrir no Google Maps
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
