import Footer from "@/components/footer/page"
import Navbar from "@/components/navbar/page"

export default function SkillLayout({
  children,
}: {    
    children: React.ReactNode
}) {
  return (
    <>
    <Navbar />
    <main>
      {children}
    </main>
    <Footer />
  </>
)
}