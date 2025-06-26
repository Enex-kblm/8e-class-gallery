import React from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, Globe, Code, Coffee, Heart } from 'lucide-react';

export const DeveloperInfo: React.FC = () => {
  const technologies = [
    'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion',
    'HTML5', 'CSS3', 'JavaScript', 'Node.js'
  ];

  const features = [
    {
      icon: <Code size={24} />,
      title: 'Modern Architecture',
      description: 'Built with React, TypeScript, and modern web standards for optimal performance and maintainability.'
    },
    {
      icon: <Coffee size={24} />,
      title: 'Performance Optimized',
      description: 'Implements lazy loading, image optimization, and efficient rendering for smooth user experience.'
    },
    {
      icon: <Heart size={24} />,
      title: 'User-Centered Design',
      description: 'Carefully crafted UI/UX with accessibility in mind and responsive design for all devices.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
         
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl">
            <Code size={48} className="text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About the Developer</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            This gallery website was crafted with passion and attention to detail, 
            showcasing the memories of Class 8E students through modern web technologies.
          </p>
        </motion.div>

        {/* Developer Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                The Class 8E Gallery is a modern, responsive web application designed to showcase 
                student photos in an elegant and user-friendly interface. Built with performance 
                and user experience as top priorities.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Globe size={20} className="text-indigo-600" />
                  <span>Responsive Design</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Mail size={20} className="text-indigo-600" />
                  <span>Optimized Performance</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Github size={20} className="text-indigo-600" />
                  <span>Modern Architecture</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Technologies Used</h3>
              <div className="grid grid-cols-2 gap-2">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium text-center"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                {feature.icon}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-center text-white mb-12"
        >
          <h3 className="text-2xl font-bold mb-4">Let's Connect</h3>
          <p className="mb-6 opacity-90">
            Interested in similar projects or have questions about this gallery?
          </p>
          
          <div className="flex justify-center space-x-4">
            <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors duration-200">
              <Mail size={20} />
              <span>Email Me</span>
            </button>
            <a
              href="https://github.com/Enex-kblm/8e-class-gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <Github size={20} />
              <span>View Code</span>
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 text-gray-500"
        >
          <p>© 2024-2025 Class 8E Gallery. Made with ❤️ for preserving memories.</p>
        </motion.div>
      </div>
    </div>
  );
};
