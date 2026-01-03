import { AppHeader } from '@/components/AppHeader'

interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
}

interface LandingHeaderProps {
  user: { id: string } | null
  userProfile: UserProfile | null
}

export function LandingHeader({ user, userProfile }: LandingHeaderProps) {
  return <AppHeader user={user} userProfile={userProfile} variant="landing" />
}

