import { Head } from '@inertiajs/react'
import UpdatePasswordForm from './partials/updatePasswordForm'
import UpdateProfileInformationForm from './partials/updateProfileInformationForm'

export default function Edit({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
   return (
      <>
         <Head title="Profile" />

         <div className="py-12 max-h-full overflow-y-auto">
            <div className="space-y-6 sm:px-6 lg:px-8">
               <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                  <UpdateProfileInformationForm
                     mustVerifyEmail={mustVerifyEmail}
                     status={status}
                     className="max-w-xl"
                  />
               </div>

               <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                  <UpdatePasswordForm className="max-w-xl" />
               </div>
            </div>
         </div>
      </>
   )
}
