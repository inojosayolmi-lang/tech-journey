"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, Clock, Users, TrendingUp, RefreshCw, Loader2 } from "lucide-react"
import Image from "next/image"

const SHEET_ID = "1XkJvizU-ngXhO940sN4nCk-jCOXSPN1-"
const SHEET_NAME = "Pagina 1"
const API_KEY = "AIzaSyBAxWh7zEpnvqJUXrpaZjdRJhc3m45qpjI"
const RANGE = "A1:M" // Adjust range as needed

interface Ticket {
  "ID do Chamado": string
  "Data de Abertura": number
  "Data de Fechamento": string
  Status: string
  Prioridade: string
  Motivo: string
  Solução: string
  Solicitante: string
  "Agente Responsável": string
  Departamento: string
  "TMA (minutos)": number
  "FRT (minutos)": number
  "Satisfação do Cliente": string
}

const SATISFACTION_MAP: Record<string, number> = {
  Excelente: 5,
  Bom: 4,
  Médio: 3,
  Regular: 2,
  Ruim: 1,
}

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [agentFilter, setAgentFilter] = useState<string>("all")
  const [dataSource, setDataSource] = useState<string>("local")

  const loadData = async () => {
    setLoading(true)
    console.log("[v0] Starting data load...")

    try {
      if (API_KEY && SHEET_ID) {
        console.log("[v0] Attempting to load from Google Sheets...")
        const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A:M?key=${API_KEY}`
        console.log("[v0] Google Sheets URL:", sheetsUrl)

        try {
          const sheetsResponse = await fetch(sheetsUrl)
          console.log("[v0] Google Sheets API response status:", sheetsResponse.status)

          if (sheetsResponse.ok) {
            const sheetsData = await sheetsResponse.json()
            console.log("[v0] Successfully loaded data from Google Sheets")

            const rows = sheetsData.values

            if (!rows || rows.length === 0) {
              console.log("[v0] No data found in Google Sheets, falling back to local JSON")
              throw new Error("No data in sheets")
            }

            const ticketsFromSheets = rows.slice(1).map((row: string[]) => ({
              "ID do Chamado": row[0] || "",
              "Data de Abertura": Number.parseFloat(row[1]) || 0,
              "Data de Fechamento": row[2] || "",
              Status: row[3] || "",
              Prioridade: row[4] || "",
              Motivo: row[5] || "",
              Solução: row[6] || "",
              Solicitante: row[7] || "",
              "Agente Responsável": row[8] || "",
              Departamento: row[9] || "",
              "TMA (minutos)": Number.parseInt(row[10]) || 0,
              "FRT (minutos)": Number.parseInt(row[11]) || 0,
              "Satisfação do Cliente": row[12] || "",
            }))

            setTickets(ticketsFromSheets)
            setDataSource("Google Sheets")
            setLastUpdate(new Date())
            setLoading(false)
            console.log("[v0] Data loaded successfully from Google Sheets:", ticketsFromSheets.length, "tickets")
            return
          } else {
            const errorText = await sheetsResponse.text()
            console.log("[v0] Google Sheets API error response:", errorText)
            console.log(
              "[v0] Possible issues: Sheet not public, incorrect API key, wrong Sheet ID, or sheet name 'Pagina 1' not found",
            )
          }
        } catch (sheetsError) {
          console.log("[v0] Google Sheets API fetch error:", sheetsError)
          console.log("[v0] Falling back to local JSON file...")
        }
      }

      console.log("[v0] Loading from local JSON file...")
      const response = await fetch("/data/chamados_suporte.json")

      if (!response.ok) {
        throw new Error(`Failed to load local JSON: ${response.status}`)
      }

      const data = await response.json()
      setTickets(data)
      setDataSource("JSON Local")
      setLastUpdate(new Date())
      console.log("[v0] Data loaded successfully from local JSON:", data.length, "tickets")
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      try {
        console.log("[v0] Attempting final fallback to local JSON...")
        const response = await fetch("/data/chamados_suporte.json")
        const data = await response.json()
        setTickets(data)
        setDataSource("JSON Local (Fallback)")
        setLastUpdate(new Date())
        console.log("[v0] Fallback successful:", data.length, "tickets")
      } catch (fallbackError) {
        console.error("[v0] All data loading attempts failed:", fallbackError)
        setTickets([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let filtered = [...tickets]

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.Status === statusFilter)
    }

    if (agentFilter !== "all") {
      filtered = filtered.filter((t) => t["Agente Responsável"] === agentFilter)
    }

    setFilteredTickets(filtered)
  }, [tickets, statusFilter, agentFilter])

  const uniqueAgents = Array.from(new Set(tickets.map((t) => t["Agente Responsável"]))).sort()

  const totalTickets = filteredTickets.length
  const openTickets = filteredTickets.filter((t) => t.Status === "Aberto").length
  const pendingTickets = filteredTickets.filter((t) => t.Status === "Pendente").length
  const closedTickets = filteredTickets.filter((t) => t.Status === "Encerrado").length

  const avgResolutionTime =
    filteredTickets.length > 0
      ? Math.round(filteredTickets.reduce((sum, t) => sum + t["TMA (minutos)"], 0) / filteredTickets.length)
      : 0

  const avgSatisfaction =
    filteredTickets.length > 0
      ? (
          filteredTickets.reduce((sum, t) => sum + (SATISFACTION_MAP[t["Satisfação do Cliente"]] || 0), 0) /
          filteredTickets.length
        ).toFixed(1)
      : "0.0"

  const agentStats = filteredTickets.reduce(
    (acc, ticket) => {
      const agent = ticket["Agente Responsável"]
      if (!acc[agent]) {
        acc[agent] = 0
      }
      if (ticket.Status === "Encerrado") {
        acc[agent]++
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const agentData = Object.entries(agentStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const categoryStats = filteredTickets.reduce(
    (acc, ticket) => {
      const category = ticket.Motivo
      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryData = Object.entries(categoryStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const COLORS = ["#0ea5e9", "#06b6d4", "#14b8a6", "#10b981", "#84cc16"]

  const topAgent = agentData[0]?.name || "N/A"
  const topAgentCount = agentData[0]?.count || 0

  const topCategory = categoryData[0]?.name || "N/A"
  const topCategoryCount = categoryData[0]?.value || 0

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white shadow-lg">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/techhelp%20solution-BA4wHmEAMuwYXi5C1ztzkwNMrKihyQ.jpg"
                alt="TechHelp Solution Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard de Suporte Técnico</h1>
              <p className="text-sm text-muted-foreground">TechHelp Solutions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">Fonte: {dataSource}</span>
            <Button onClick={loadData} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar Dados
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Carregando dados...</span>
          </div>
        )}

        {!loading && (
          <>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">Status:</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Aberto">Aberto</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Encerrado">Encerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">Técnico:</label>
                <Select value={agentFilter} onValueChange={setAgentFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueAgents.map((agent) => (
                      <SelectItem key={agent} value={agent}>
                        {agent}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(statusFilter !== "all" || agentFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all")
                    setAgentFilter("all")
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-chart-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total de Chamados</CardTitle>
                  <Activity className="w-5 h-5 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{totalTickets}</div>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="text-green-600">Abertos: {openTickets}</span>
                    <span className="text-yellow-600">Pendentes: {pendingTickets}</span>
                    <span className="text-blue-600">Encerrados: {closedTickets}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-chart-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio de Resolução</CardTitle>
                  <Clock className="w-5 h-5 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{avgResolutionTime} min</div>
                  <p className="text-xs text-muted-foreground mt-2">TMA médio da equipe</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-chart-3">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Satisfação Média</CardTitle>
                  <TrendingUp className="w-5 h-5 text-chart-3" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{avgSatisfaction}/5.0</div>
                  <p className="text-xs text-muted-foreground mt-2">Avaliação dos clientes</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-chart-4">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Técnico Mais Produtivo</CardTitle>
                  <Users className="w-5 h-5 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-foreground truncate">{topAgent}</div>
                  <p className="text-xs text-muted-foreground mt-2">{topAgentCount} chamados resolvidos</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Chamados por Técnico</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={agentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Insight:</span> O técnico mais produtivo é{" "}
                      <span className="font-semibold text-chart-1">{topAgent}</span> com{" "}
                      <span className="font-semibold text-chart-1">{topAgentCount}</span> chamados resolvidos.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Categorias Mais Recorrentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Insight:</span> A categoria mais recorrente é{" "}
                      <span className="font-semibold text-chart-2">{topCategory}</span> com{" "}
                      <span className="font-semibold text-chart-2">{topCategoryCount}</span> ocorrências.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Chamados Detalhados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium text-muted-foreground">ID</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Prioridade</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Agente</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">TMA (min)</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">FRT (min)</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Satisfação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.slice(0, 10).map((ticket) => (
                        <tr key={ticket["ID do Chamado"]} className="border-b border-border hover:bg-muted/50">
                          <td className="p-3 font-mono text-xs">{ticket["ID do Chamado"]}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ticket.Status === "Aberto"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : ticket.Status === "Pendente"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}
                            >
                              {ticket.Status}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ticket.Prioridade === "Urgente"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  : ticket.Prioridade === "Alta"
                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                    : ticket.Prioridade === "Média"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                              }`}
                            >
                              {ticket.Prioridade}
                            </span>
                          </td>
                          <td className="p-3 text-foreground">{ticket["Agente Responsável"]}</td>
                          <td className="p-3 text-foreground">{ticket["TMA (minutos)"]}</td>
                          <td className="p-3 text-foreground">{ticket["FRT (minutos)"]}</td>
                          <td className="p-3 text-foreground">{ticket["Satisfação do Cliente"]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <footer className="mt-12 text-center text-sm text-muted-foreground pb-8">
              <p>Última atualização: {lastUpdate.toLocaleString("pt-BR")}</p>
              <p className="mt-2">Dashboard desenvolvido para TechHelp Solutions</p>
            </footer>
          </>
        )}
      </main>
    </div>
  )
}
