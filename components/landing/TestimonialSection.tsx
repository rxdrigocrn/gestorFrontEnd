"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
    {
        name: "Carlos Silva",
        company: "TechNet ISP",
        content: "Revolucionou nossa gestão. Aumentamos a eficiência em 300% e reduzimos custos operacionais significativamente.",
        rating: 5,
        avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
        name: "Ana Costa",
        company: "ConnectPlus",
        content: "Interface intuitiva e recursos poderosos. Nossa equipe se adaptou rapidamente e os resultados foram imediatos.",
        rating: 5,
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
        name: "Roberto Lima",
        company: "NetSpeed",
        content: "O melhor investimento que fizemos. O ROI foi positivo já no primeiro mês de uso da plataforma.",
        rating: 5,
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
]

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="relative z-10 py-20 bg-white/50  backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-blue-900  bg-clip-text text-transparent">
                        O que nossos clientes dizem
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Histórias reais de IPTVs que transformaram seus negócios
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="bg-white/70   backdrop-blur-sm border border-slate-200   hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-slate-700   mb-6 italic">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <div className="font-semibold text-slate-900">{testimonial.name}</div>
                                        <div className="text-sm text-slate-600 ">{testimonial.company}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}