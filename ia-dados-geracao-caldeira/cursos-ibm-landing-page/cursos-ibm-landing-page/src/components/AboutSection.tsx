import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Code, Brain } from "lucide-react";

const learningPoints = [
  {
    icon: Sparkles,
    title: "Tecnologias Emergentes",
    description: "Conhecer as tecnologias emergentes que estão transformando o mercado.",
  },
  {
    icon: Code,
    title: "Desenvolvimento Web",
    description: "Aprender fundamentos de desenvolvimento web com as melhores práticas.",
  },
  {
    icon: Brain,
    title: "Fundamentos de IA",
    description: "Dominar fundamentos da Inteligência Artificial e seu impacto nos negócios.",
  },
];

const AboutSection = () => {
  return (
    <section id="cursos" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Sobre os Cursos
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Nesta trilha, você mergulha no universo da Inteligência Artificial e da
              análise de dados, desenvolvendo competências essenciais para atuar na era
              digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {learningPoints.map((point, index) => (
              <Card
                key={index}
                className="shadow-elegant hover:shadow-xl transition-smooth hover:-translate-y-2 border-border/50"
              >
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-lg gradient-primary flex items-center justify-center">
                    <point.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
