import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosFetch from "@/lib/axiosFetch";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const NotificationTab = () => {
    const [emailNotifications, setEmailNotifications] = useState<boolean>(true)
    const [pushNotifications,  setPushNotifications] = useState<boolean>(true)
    const [smsNotifications,   setSmsNotifications] = useState<boolean>(true)
    const [challengeReminders, setChallengeReminders] = useState<boolean>(true)

    const { mutate: saveChanges, isPending } = useMutation({
        mutationKey: ['updateNotificationPreferences'],
        onMutate: async () => {
            const response = await axiosFetch.post('/user/updateNotificationPreferences', {
                emailNotifications: emailNotifications,
                pushNotifications: pushNotifications,
                smsNotifications: smsNotifications,
                challengeReminders: challengeReminders
            })

            return response.data
        }
    })

    return (
        <TabsContent value="notifications">
            <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                        Customize your notification preferences
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} id="email-notifications" />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} id="push-notifications" />                         
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} id="sms-notifications" />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="challenge-reminders">Challenge Reminders</Label>
                        <Switch checked={challengeReminders} onCheckedChange={setChallengeReminders} id="challenge-reminders" defaultChecked />
                    </div>

                </CardContent>
                <CardFooter>
                    <Button
                    onClick={() => saveChanges()}
                    disabled={isPending}
                    >
                        {isPending ? <LoadingSpinner /> : "Save Notifications"}
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}

export default NotificationTab