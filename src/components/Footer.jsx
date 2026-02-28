import React from 'react';
import { assets } from '../assets/assets';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ArrowUp
} from 'lucide-react';

// Subcomponent for Footer Section
const FooterSection = ({ title, links }) => (
  <div className="flex flex-col">
    <h3 className="font-bold text-base mb-2 text-white">{title}</h3>
    <ul className="space-y-1 text-sm">
      {links.map((link, index) => (
        <li key={index}>
          <a href={link.href} className="text-gray-300 hover:text-red-500 transition-colors">
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// Subcomponent for Social Links
const SocialLinks = ({ links }) => (
  <div className="flex space-x-3">
    {links.map((social, index) => {
      const Icon = social.icon;
      return (
        <a key={index} href={social.href} aria-label={social.name} className={`text-gray-300 ${social.color} transition-colors`}>
          <Icon size={20} />
        </a>
      );
    })}
  </div>
);

// Subcomponent for Contact Info
const ContactInfo = ({ info }) => (
  <div className="flex flex-col space-y-2">
    {info.map((item, index) => {
      const Icon = item.icon;
      return (
        <a key={index} href={item.href} className="flex items-center space-x-2 text-gray-300 hover:text-red-500 transition-colors">
          <Icon size={18} />
          <span className="text-sm">{item.content}</span>
        </a>
      );
    })}
  </div>
);

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const footerSections = [
    {
      title: "Khám phá",
      links: [
        { name: "Trang chủ", href: "#home" },
        { name: "Phim mới", href: "#movies" },
        { name: "Trailer", href: "#trailers" },
        { name: "Top phim", href: "#trending" }
      ]
    },
    {
      title: "Công ty",
      links: [
        { name: "Về chúng tôi", href: "#about" },
        { name: "Liên hệ", href: "#contact" },
        { name: "Tin tức", href: "#news" }
      ]
    },
    {
      title: "Hỗ trợ",
      links: [
        { name: "Trợ giúp", href: "#help" },
        { name: "Chính sách", href: "#privacy" },
        { name: "Điều khoản", href: "#terms" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", name: "Facebook", color: "hover:text-blue-500" },
    { icon: Instagram, href: "#", name: "Instagram", color: "hover:text-pink-500" },
    { icon: Twitter, href: "#", name: "Twitter", color: "hover:text-sky-500" },
    { icon: Youtube, href: "#", name: "YouTube", color: "hover:text-red-500" }
  ];

  const contactInfo = [
    { icon: Phone, title: "Hotline", content: "+84 123 456 789", href: "tel:+84123456789" },
    { icon: Mail, title: "Email", content: "contact@moviehub.vn", href: "mailto:contact@moviehub.vn" },
    { icon: MapPin, title: "Địa chỉ", content: "123 Nguyễn Huệ, Q.1", href: "#" }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-6 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Logo & Description */}
          <div>
            <img src={assets.logo} alt="MovieHub Logo" className="h-10 mb-2" />
            <p className="text-sm mb-2">Khám phá phim mới & trailer hot tại MovieHub!</p>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section, index) => (
            <FooterSection key={index} {...section} />
          ))}

          {/* Contact Section */}
          <div>
            <h3 className="font-bold text-base mb-2 text-white">Liên hệ</h3>
            <ContactInfo info={contactInfo} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-2">
          <SocialLinks links={socialLinks} />
          <p className="text-sm mt-2 md:mt-0">© {new Date().getFullYear()} MovieHub. All rights reserved.</p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
};

export default Footer;