import type React from "react"
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react"
import { useState, useEffect } from "react"
import { getFooterData, getLegalPages, type FooterData } from "@/services/footerService"
import { useFooterNavigation } from "@/hooks/useFooterNavigation"

const Footer: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null)
  const [legalPages, setLegalPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { handleNavigation } = useFooterNavigation()

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        setLoading(true)
        const [footer, legal] = await Promise.all([
          getFooterData(),
          getLegalPages()
        ])
        setFooterData(footer)
        setLegalPages(legal)
      } catch (error) {
        console.error('Error cargando datos del footer:', error)
        // Usar datos por defecto si hay error
        const defaultData = await getFooterData()
        setFooterData(defaultData)
      } finally {
        setLoading(false)
      }
    }

    loadFooterData()
  }, [])

  const handleLinkClick = (url: string, e: React.MouseEvent) => {
    e.preventDefault()
    handleNavigation(url)
  }

  if (loading) {
    return (
      <footer className="w-full bg-black text-white">
        <div className="w-full px-6 py-12">
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-400">Cargando...</div>
          </div>
        </div>
      </footer>
    )
  }

  if (!footerData) {
    return null
  }

  return (
    <footer className="w-full bg-black text-white">
      <div className="w-full px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand and Social Media */}
          <div className="flex flex-col space-y-6">
            <div className="text-2xl font-bold">
              <img 
                src={footerData.company_info.logo_url || "/logo-beltspot.png"} 
                alt={footerData.company_info.name} 
                className="h-12 w-auto object-contain"
              />
            </div>
            {footerData.company_info.description && (
              <p className="text-gray-400 text-sm">
                {footerData.company_info.description}
              </p>
            )}
            <div className="flex space-x-4">
              {footerData.social_media.instagram && (
                <a 
                  href={footerData.social_media.instagram}
                  onClick={(e) => handleLinkClick(footerData.social_media.instagram!, e)}
                  className="text-gray-300 hover:text-[#ff0000] transition-colors duration-200 no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {footerData.social_media.youtube && (
                <a 
                  href={footerData.social_media.youtube}
                  onClick={(e) => handleLinkClick(footerData.social_media.youtube!, e)}
                  className="text-gray-300 hover:text-[#ff0000] transition-colors duration-200 no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="w-6 h-6" />
                </a>
              )}
              {footerData.social_media.facebook && (
                <a 
                  href={footerData.social_media.facebook}
                  onClick={(e) => handleLinkClick(footerData.social_media.facebook!, e)}
                  className="text-gray-300 hover:text-[#ff0000] transition-colors duration-200 no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              {footerData.social_media.twitter && (
                <a 
                  href={footerData.social_media.twitter}
                  onClick={(e) => handleLinkClick(footerData.social_media.twitter!, e)}
                  className="text-gray-300 hover:text-[#ff0000] transition-colors duration-200 no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>

          {/* Support Links */}
          {footerData.sections.find(s => s.title === 'Soporte') && (
            <div className="flex flex-col space-y-4">
              <h3 className="text-white font-semibold mb-2">Soporte</h3>
              {footerData.sections
                .find(s => s.title === 'Soporte')
                ?.links.filter(link => link.is_active)
                .sort((a, b) => a.order - b.order)
                .map((link) => (
                  <a 
                    key={link.id}
                    href={link.url}
                    onClick={(e) => handleLinkClick(link.url, e)}
                    className="text-gray-300 hover:text-[#ff0000] transition-colors duration-200 text-sm no-underline"
                  >
                    {link.title}
                  </a>
                ))}
            </div>
          )}

          {/* About Links */}
          {footerData.sections.find(s => s.title === 'Acerca de') && (
            <div className="flex flex-col space-y-4">
              <h3 className="text-white font-semibold mb-2">Acerca de</h3>
              {footerData.sections
                .find(s => s.title === 'Acerca de')
                ?.links.filter(link => link.is_active)
                .sort((a, b) => a.order - b.order)
                .map((link) => (
                  <a 
                    key={link.id}
                    href={link.url}
                    onClick={(e) => handleLinkClick(link.url, e)}
                    className="text-gray-300 hover:text-[#ff0000] transition-colors duration-200 text-sm no-underline"
                  >
                    {link.title}
                  </a>
                ))}
            </div>
          )}
        </div>

        {/* Bottom section */}
        <div className="border-t border-red-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-300">
              {footerData.company_info.copyright_text}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              {legalPages.map((page) => (
                <a 
                  key={page.id}
                  href={page.url}
                  onClick={(e) => handleLinkClick(page.url, e)}
                  className="hover:text-[#ff0000] transition-colors duration-200 text-gray-300 no-underline"
                >
                  {page.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 