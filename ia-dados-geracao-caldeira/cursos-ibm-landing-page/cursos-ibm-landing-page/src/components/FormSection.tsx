import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const FormSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      nome: formData.get('nome'),
      email: formData.get('email'),
    };

    try {
      await fetch('https://hook.us2.make.com/l3jqwtyu0rdfyvmncig6grnyhryvo3ke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      toast({
        title: "E-mail enviado com sucesso!",
        description: "Verifique sua caixa de entrada para confirmar sua inscrição.",
      });

      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inscricao" className="py-20 md:py-32 gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-border/50">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl md:text-4xl font-bold">
                Inscreva-se para começar sua jornada em IA
              </CardTitle>
              <CardDescription className="text-base md:text-lg">
                Ao se inscrever, você receberá uma sequência de e-mails com conteúdos
                exclusivos sobre Inteligência Artificial.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome completo"
                    name="nome"
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    name="email"
                    required
                    className="h-12"
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Enviando..." : "Quero me inscrever"}
                  <Send className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-xs text-center text-muted-foreground pt-2">
                  Ao se inscrever, você concorda em receber e-mails educativos sobre IA.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FormSection;
