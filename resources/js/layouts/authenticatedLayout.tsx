import Sidebar from './sidebar'

type AuthenticatedLayoutProps = {
  children: React.ReactNode
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <section className="flex-1 max-h-screen">
          {children}
      </section>
    </main>
  )
}

export default AuthenticatedLayout
