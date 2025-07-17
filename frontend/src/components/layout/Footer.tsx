import type React from "react"
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand and Social Media */}
          <div className="flex flex-col space-y-6">
            <div className="text-2xl font-bold">
              <img 
                src="/logo-beltspot.png" 
                alt="BeltSpot" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-red-300 transition-colors no-underline">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-2.54v5.79c0 2.84-2.26 5.14-5.09 5.14-2.84 0-5.14-2.3-5.14-5.14V2H0.84v5.79c0 4.11 3.22 7.47 7.26 7.47 4.04 0 7.32-3.36 7.32-7.47V5.27c1.2.8 2.6 1.3 4.17 1.42v-2z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-red-300 transition-colors no-underline">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-red-300 transition-colors no-underline">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-red-300 transition-colors no-underline">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-red-300 transition-colors no-underline">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Support Links */}
          <div className="flex flex-col space-y-4">
            <a href="#" className="text-white hover:text-red-300 transition-colors text-sm no-underline">
              Help Center
            </a>
            <a href="#" className="text-white hover:text-red-300 transition-colors text-sm no-underline">
              Product Support
            </a>
            <a href="#" className="text-white hover:text-red-300 transition-colors text-sm no-underline">
              Warranty
            </a>
            <a href="#" className="text-white hover:text-red-300 transition-colors text-sm no-underline">
              Order Tracking
            </a>
            <a href="#" className="text-white hover:text-red-300 transition-colors text-sm no-underline">
              Contact Us
            </a>
          </div>

          {/* About Links */}
          <div className="flex flex-col space-y-4">
            <a href="#" className="text-white hover:text-red-300 transition-colors text-sm no-underline">
              About
            </a>
            <a href="#" className="text-white hover:text-red-300 transition-colors text-sm no-underline">
              Music with a Mission
            </a>
            <a href="#" className="text-white hover:text-red-300 transition-colors text-sm no-underline">
              Soundlab Rewards
            </a>
            <a href="#" className="text-white hover:text-red-300 transition-colors text-sm no-underline">
              Affiliates + Creators
            </a>
            <a href="#" className="text-white hover:text-red-300 transition-colors text-sm no-underline">
              Press Releases
            </a>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-red-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-300">© 2025, BELTSPOT</div>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="#" className="hover:text-red-300 transition-colors text-gray-300 no-underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-red-300 transition-colors text-gray-300 no-underline">
                Terms of Use
              </a>
              <a href="#" className="hover:text-red-300 transition-colors text-gray-300 no-underline">
                Accessibility Statement
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 