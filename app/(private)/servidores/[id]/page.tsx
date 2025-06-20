import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3,
  Users,
  Clock,
  DollarSign,
  RefreshCw,
  Power,
  Settings,
  AlertCircle
} from "lucide-react"

// This would come from your API/database
const serverData = {
  id: "SRV001",
  name: "ELITE",
  creditValue: "R$ 13.00",
  credits: 9971,
  whatsappSession: true,
  panelLink: "https://panel.streaming.com/elite",
  stats: {
    revenue: "R$ 216,91",
    expenses: "R$ 0,00",
    profit: "R$ 216,91",
    margin: "100%",
    clients: {
      total: 11,
      active: 7,
      creditUsage: 7
    },
    resellers: {
      total: 0,
      sales: 0,
      creditUsage: 0
    }
  },
  performance: {
    cpu: 45,
    memory: 60,
    bandwidth: 42,
    connections: 324
  }
}

// Add the required generateStaticParams function
export function generateStaticParams() {
  // For now, we'll statically generate just the example server
  // In a real application, this would fetch all server IDs from your database
  return [
    { id: 'SRV001' }
  ]
}

export default function ServerDetailsPage() {
  return (
    <div className="container mx-auto px-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Detalhes do Servidor</h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar Sessão
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none bg-green-500/10 text-green-500 hover:bg-green-500/20">
            <Power className="w-4 h-4 mr-2" />
            Reiniciar Servidor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg sm:text-xl font-bold">Informações do Servidor</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                <AlertCircle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome do Servidor</p>
                <p className="font-medium">{serverData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor do Crédito</p>
                <p className="font-medium">{serverData.creditValue}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Créditos Disponíveis</p>
                <p className="font-medium">{serverData.credits}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessão WhatsApp</p>
                <Badge variant={serverData.whatsappSession ? "default" : "destructive"}>
                  {serverData.whatsappSession ? "Ativa" : "Inativa"}
                </Badge>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Link do Painel</p>
                <p className="font-medium break-all">{serverData.panelLink}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU</span>
                <span className="font-medium">{serverData.performance.cpu}%</span>
              </div>
              <Progress value={serverData.performance.cpu} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memória</span>
                <span className="font-medium">{serverData.performance.memory}%</span>
              </div>
              <Progress value={serverData.performance.memory} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Banda</span>
                <span className="font-medium">{serverData.performance.bandwidth}%</span>
              </div>
              <Progress value={serverData.performance.bandwidth} className="h-2" />
            </div>
            
            <div className="pt-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Conexões</span>
              <span className="text-lg font-bold">{serverData.performance.connections}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1 text-center">
                <span className="text-2xl font-bold">{serverData.stats.clients.total}</span>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="space-y-1 text-center">
                <span className="text-2xl font-bold">{serverData.stats.clients.active}</span>
                <p className="text-xs text-muted-foreground">Ativos</p>
              </div>
              <div className="space-y-1 text-center">
                <span className="text-2xl font-bold">{serverData.stats.clients.creditUsage}</span>
                <p className="text-xs text-muted-foreground">Uso de Créditos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1 text-center">
                <span className="text-2xl font-bold">{serverData.stats.resellers.total}</span>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="space-y-1 text-center">
                <span className="text-2xl font-bold">{serverData.stats.resellers.sales}</span>
                <p className="text-xs text-muted-foreground">Vendas</p>
              </div>
              <div className="space-y-1 text-center">
                <span className="text-2xl font-bold">{serverData.stats.resellers.creditUsage}</span>
                <p className="text-xs text-muted-foreground">Uso de Créditos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Faturamento</p>
              <p className="text-xl font-bold">{serverData.stats.revenue}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Custo</p>
              <p className="text-xl font-bold">{serverData.stats.expenses}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Lucro</p>
              <p className="text-xl font-bold text-green-500">{serverData.stats.profit}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Margem</p>
              <p className="text-xl font-bold">{serverData.stats.margin}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}