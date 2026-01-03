import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface CTASectionProps {
  user: { id: string } | null
}

export function CTASection({ user }: CTASectionProps) {
  return (
    <section className="py-24 sm:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-12 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {user ? 'Visit Your Personalized Dashboard' : 'Ready to build your success ledger?'}
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              {user 
                ? 'Manage your achievements, track your growth, and build your success story.'
                : 'Start capturing your achievements today and turn them into powerful stories for your career growth.'}
            </p>
            {user ? (
              <Button size="lg" variant="secondary" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/signup">Get Started Free</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

