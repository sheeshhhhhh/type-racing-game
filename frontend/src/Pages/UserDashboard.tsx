import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs"
import axiosFetch from "@/lib/axiosFetch"
import { useQuery } from "@tanstack/react-query"
import { Trophy, Target, Clock, Zap, Award, RotateCcw } from 'lucide-react'
import { format } from 'date-fns'
import AchievementCard from "@/components/common/AchievementCard"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Link } from "react-router-dom"

const UserDashboard = () => {

    const { data: dashboardInfo, isLoading } = useQuery({
        queryKey: ['userDashboardInfo'],
        queryFn: async () => {
            const response = await axiosFetch.get('/user/getDashboardInfo')

            return response.data 
        }
    })

    // this is just sample data fix this later to real data in the database
    const upcomingChallenges = [
        { id: 1, name: "Daily Challenge", difficulty: "Medium", timeLimit: "5 min" },
        { id: 2, name: "Programming Special", difficulty: "Hard", timeLimit: "10 min" },
        { id: 3, name: "Speed Test", difficulty: "Easy", timeLimit: "3 min" },
    ]

    if(isLoading) {
        return (
            <div className="container mx-auto min-h-[750px] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="min-h-[750px] bg-background">
            <main className="container mx-auto px-4 py-8">

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Average WPM
                            </CardTitle>
                            <Zap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardInfo?.Biometrics.AverageWpm} WPM</div>
                            <p className="text-xs text-muted-foreground">+2 from last week</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Accuracy
                            </CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardInfo?.Biometrics.AverageAccuracy}%</div>
                            <p className="text-xs text-muted-foreground">+1% from last week</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Time to Practiced
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardInfo?.Biometrics.TimePracticed}</div>
                            <p className="text-xs text-muted-foreground">This month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Challenges Finish
                            </CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{dashboardInfo?.completedChallenges.length}</div>
                            <p className="text-xs text-muted-foreground">Total Challenges Finish</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    
                    <div className="col-span-4">
                        <Tabs defaultValue="recent" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                                <TabsTrigger value="upcoming">Upcoming Challenge</TabsTrigger>
                            </TabsList>
                            <TabsContent value='recent' className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Recent Challenges
                                        </CardTitle>
                                        <CardDescription>
                                            Your latest typing challenges and results
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {dashboardInfo?.completedChallenges?.map((completedChallenge: any) => (
                                                <div key={completedChallenge.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div>
                                                        <h4 className="font-semibold">{completedChallenge.challenge.title}</h4>
                                                        {/*  it think date in here would be formated */}
                                                        <p className="text-sm text-muted-foreground">
                                                            {format(new Date(completedChallenge.dateCompleted), 'yyyy-MM-d')}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="font-semibold">{completedChallenge.wpm} WPM</p>
                                                            <p className="text-sm text-muted-foreground">{completedChallenge.accuracy}% accuracy</p>
                                                        </div>
                                                        <Link title="try again" to={`/challenge?challengeId=${completedChallenge.challenge.id}`} >
                                                            <RotateCcw className="h-4 w-4 text-muted-foreground" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="upcoming" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            New Challenges
                                        </CardTitle>
                                        <CardDescription>
                                            Challenges available for you to attempt
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {upcomingChallenges.map(challenge => (
                                                <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div>
                                                        <h4 className="font-semibold">{challenge.name}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {challenge.difficulty} • {challenge.timeLimit}
                                                        </p>
                                                    </div>
                                                    <Button className="rounded-lg">
                                                        Start Challenge
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                    
                    <div className="col-span-3">
                        <Card className="h-full">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Achievements</CardTitle>
                                        <CardDescription>
                                            Your progress towards achievements
                                        </CardDescription>
                                    </div>
                                    <Award className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {dashboardInfo?.Achievements?.map((achievement: any) => (
                                        <AchievementCard achievement={achievement} key={achievement.id} />                               
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Start a new challenge or practice session
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">

                            <Button 
                            onClick={() => {
                                window.location.assign(`/challenge?challengeId=${dashboardInfo?.dailyChallengeId}`)
                            }}
                            className="flex-1 rounded-lg">
                                Start Daily Challenge
                            </Button>

                            <Button className="flex-1 rounded-lg" variant={'outline'}>
                                Multiplayer Race
                            </Button>
                            
                        </CardContent>
                    </Card>
                </div>

            </main>
        </div>
    )
}

export default UserDashboard