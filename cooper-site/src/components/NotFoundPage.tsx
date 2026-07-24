import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useSeo } from '../lib/useSeo'

export default function NotFoundPage() {
  useSeo({
    title: 'Page Not Found — Cooper',
    description: 'The page you were looking for could not be found.',
    canonicalPath: '/',
    noindex: true,
  })

  return (
    <div className="min-h-screen bg-cream-light flex flex-col">
      <Navbar variant="light" />

      <section className="flex-1 flex items-center justify-center bg-cream px-5 md:px-10 lg:px-[62px] pt-[160px] pb-[120px]">
        <div className="max-w-[560px] text-center">
          <span className="font-grotesk font-medium text-[11px] tracking-[1.4px] uppercase text-accent-orange mb-[16px] block">
            Error 404
          </span>
          <h1 className="font-serif text-[44px] md:text-[64px] leading-[1.05] tracking-[-1px] text-dark mb-[20px]">
            Page not found.
          </h1>
          <p className="font-sans text-[17px] leading-[1.6] text-dark/60 mb-[36px]">
            The page you're looking for doesn't exist or may have moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center min-h-[40px] font-sans font-medium text-[15px] text-cream-light bg-dark rounded-[6px] px-[28px] py-[12px] hover:bg-dark/90 transition-colors no-underline"
          >
            Back to home
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
