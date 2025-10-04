import { Trophy, Users, Calendar, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent min-h-[60vh] lg:min-h-[70vh]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl animate-fade-in-up">
              <span className="block">Where Legends Rise</span>
            </h1>
            <p className="mt-6 text-base leading-7 text-white/90 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9 max-w-4xl mx-auto animate-fade-in-up text-balance" style={{ animationDelay: '0.2s' }}>
              The premier basketball league bringing together the finest talent from across West Africa. 
              8 teams, 96 players, one championship dream.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button size="xl" variant="secondary" className="text-primary w-full sm:w-auto min-w-[160px]">
                View Teams
              </Button>
              <Button size="xl" variant="outline" className="text-white border-white hover:bg-white hover:text-primary w-full sm:w-auto min-w-[160px]">
                Watch Highlights
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
            {[
              { label: "Teams", value: "8", icon: Users, color: "text-blue-600" },
              { label: "Players", value: "96", icon: Trophy, color: "text-green-600" },
              { label: "Matches", value: "30", icon: Calendar, color: "text-purple-600" },
              { label: "Countries", value: "8", icon: TrendingUp, color: "text-orange-600" },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center animate-count-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`mx-auto flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-lg bg-muted/50`}>
                  <stat.icon className={`h-6 w-6 lg:h-8 lg:w-8 ${stat.color}`} />
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold tracking-tight text-foreground lg:text-4xl">{stat.value}</div>
                  <div className="text-sm text-muted-foreground lg:text-base">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl mb-4">
              Latest from WABL
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg mx-auto optimal-text" style={{ maxWidth: '600px' }}>
              Stay updated with the latest matches, standings, and league news
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 max-w-none">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 min-w-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="success">Final</Badge>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Yesterday</span>
                </div>
                <CardTitle className="text-lg sm:text-xl leading-tight">
                  Lagos Lions vs Dakar Sharks
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  Lagos defeated Dakar in a thrilling overtime finish
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-2xl sm:text-3xl font-bold mb-4">
                  <span className="text-primary">95</span>
                  <span className="text-sm text-muted-foreground">-</span>
                  <span className="text-muted-foreground">92</span>
                </div>
                <Button variant="outline" className="w-full">
                  View Match Details
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 min-w-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl leading-tight">
                  League Standings
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Current season rankings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { team: "Lagos Lions", record: "8-2", streak: "W3" },
                    { team: "Accra Panthers", record: "7-3", streak: "W1" },
                    { team: "Dakar Sharks", record: "6-4", streak: "L1" },
                  ].map((team, index) => (
                    <div key={team.team} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <span className="w-6 text-sm text-muted-foreground font-medium flex-shrink-0">{index + 1}</span>
                        <span className="text-sm font-medium truncate">{team.team}</span>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-sm font-mono">{team.record}</span>
                        <Badge variant={team.streak.startsWith('W') ? 'success' : 'destructive'} className="text-xs">
                          {team.streak}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Full Standings
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 min-w-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="info">Upcoming</Badge>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Tomorrow</span>
                </div>
                <CardTitle className="text-lg sm:text-xl leading-tight">
                  Abidjan Thunder vs Bamako Warriors
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  7:30 PM WAT • Félix Houphouët-Boigny Stadium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-lg font-semibold text-muted-foreground mb-4">
                    VS
                  </div>
                  <Button variant="wabl" className="w-full">
                    Get Tickets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-primary py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl mb-6">
              Join the WABL Community
            </h2>
            <p className="text-base text-white/90 sm:text-lg mx-auto mb-8 optimal-text" style={{ maxWidth: '700px' }}>
              Follow your favorite teams, get match notifications, and be part of the West African basketball revolution.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
