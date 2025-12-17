import React, { Suspense } from 'react'
import ProfileTabs from '@/components/ui/Profile/ProfileTabs'

function Profile() {
  return (
    <div className="max-w-screen-xl mx-auto p-4 section-min">
      <Suspense fallback={<div></div>}>
        <ProfileTabs />
      </Suspense>
    </div>
  )
}

export default Profile
