import { getUser, getUserProfile } from '@/lib/supabase/auth'
import { getAllPublicAchievements } from '@/lib/supabase/database'
import { PublicAchievements } from '@/components/PublicAchievements'
import { Suspense } from 'react'
import { AchievementListSkeleton } from '@/components/skeletons'
import {
  LandingHeader,
  HeroSection,
  FeaturesSection,
  CTASection,
  LandingFooter,
} from '@/components/landing'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let user = null
  let userProfile = null
  let achievementsList: any[] = []
  
  try {
    user = await getUser()
    if (user) {
      userProfile = await getUserProfile(user.id)
    }
  } catch (error) {
    console.error('Error fetching user:', error)
  }
  
  try {
    const { data: achievements, error } = await getAllPublicAchievements()
    if (error) {
      console.error('Error fetching achievements:', error)
    } else {
      achievementsList = Array.isArray(achievements) ? achievements : []
    }
  } catch (error) {
    console.error('Error in getAllPublicAchievements:', error)
  }
  
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader user={user} userProfile={userProfile} />
      <HeroSection user={user} />
      
      {/* Public Achievements Section */}
      <section className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Suspense fallback={<AchievementListSkeleton count={6} />}>
            <PublicAchievements achievements={achievementsList} />
          </Suspense>
        </div>
      </section>

      <FeaturesSection />
      <CTASection user={user} />
      <LandingFooter />
    </div>
  )
}
