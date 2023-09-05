import Admin from "../admin"

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <Admin>{children}</Admin>
    )
  }