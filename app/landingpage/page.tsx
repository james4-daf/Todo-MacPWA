import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Check, Lock} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground p-8 flex flex-col items-center">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Todomac</h1>
                <p className="text-lg text-muted-foreground">
                    The simplest AI-powered to-do app for Mac and Web
                </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-16">
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">🆓 Free Plan</h2>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500"/> Local browser storage
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500"/> No login required
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500"/> Use AI feature <strong>5 times</strong>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">💎 Pro Plan — $2/month</h2>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-blue-500"/> Sign in with Apple, Google or OAuth
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500"/> Unlimited AI feature usage
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500"/> Sync across all devices
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </section>

            <Button asChild size="lg">
                <Link href="/app">Get Started</Link>
            </Button>
        </div>
    );
}
