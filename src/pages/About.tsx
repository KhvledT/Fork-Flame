/**
 * About Page Component
 * Restaurant story, team members, and mission with improved design
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ROUTES } from '../utils/constants.ts';
import Button from '../components/ui/Button.tsx';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  specialties: string[];
}

interface Achievement {
  icon: string;
  title: string;
  description: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

const About: React.FC = () => {
  // Team members data
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Chef Michael Rodriguez',
      role: 'Head Chef & Founder',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=face',
      bio: 'Award-winning chef with 15+ years of culinary excellence. Passionate about creating memorable dining experiences.',
      specialties: ['French Cuisine', 'Mediterranean', 'Fusion']
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Pastry Chef',
      image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400&h=400&fit=crop&crop=face',
      bio: 'Master of sweet creations with a background in classical French pastry. Every dessert tells a story.',
      specialties: ['French Pastries', 'Artisan Breads', 'Chocolate Work']
    },
    {
      id: 3,
      name: 'Marcus Johnson',
      role: 'Sous Chef',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Expert in modern American cuisine and sustainable cooking practices. Loves experimenting with local ingredients.',
      specialties: ['American Cuisine', 'Farm-to-Table', 'Grilling']
    },
  ];

  // Restaurant achievements
  const achievements: Achievement[] = [
    { icon: '🏆', title: 'Michelin Star', description: 'Recognized for culinary excellence' },
    { icon: '⭐', title: '5-Star Rating', description: 'Consistently rated by customers' },
    { icon: '🥇', title: 'Best Restaurant', description: 'City\'s top choice 2023' },
    { icon: '🌱', title: 'Sustainability', description: 'Green restaurant certified' }
  ];

  // Values
  const values: Value[] = [
    {
      icon: '❤️',
      title: 'Passion',
      description: 'Every dish is crafted with love and dedication to culinary artistry.'
    },
    {
      icon: '🌿',
      title: 'Quality',
      description: 'We source only the finest, freshest ingredients from trusted local suppliers.'
    },
    {
      icon: '🤝',
      title: 'Community',
      description: 'Building lasting relationships with our guests and local community.'
    },
    {
      icon: '✨',
      title: 'Innovation',
      description: 'Constantly evolving our menu with creative and modern culinary techniques.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop"
            alt="Restaurant interior"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Our <span className="text-gradient">Story</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
              A decade of culinary excellence, passion for food, and unforgettable dining experiences
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gradient">
                The Fork & Flame Journey
              </h2>
              <div className="space-y-6 text-lg text-gray-300 dark:text-gray-300 leading-relaxed">
                <p>
                  Founded in 2014 by Chef Michael Rodriguez, Fork & Flame began as a dream to create 
                  a dining experience that would blend traditional culinary techniques with modern innovation. 
                  What started as a small 40-seat restaurant has grown into one of the city's most beloved 
                  culinary destinations.
                </p>
                <p>
                  Our journey has been guided by a simple philosophy: exceptional food, warm hospitality, 
                  and an atmosphere that makes every visit feel special. We believe that dining is not 
                  just about nourishment—it's about creating memories, celebrating life's moments, and 
                  bringing people together.
                </p>
                <p>
                  Today, we continue to push culinary boundaries while staying true to our roots. 
                  Every dish tells a story, every ingredient has a purpose, and every guest becomes 
                  part of our extended family.
                </p>
              </div>
            </motion.div>

                         {/* Image Grid */}
             <motion.div
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
               className="grid grid-cols-2 gap-4"
             >
               <div className="space-y-4">
                 <div className="rounded-2xl overflow-hidden shadow-2xl">
                   <img
                     src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
                     alt="Chef preparing food"
                     className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                     loading="lazy"
                     decoding="async"
                     sizes="(max-width: 1024px) 50vw, 25vw"
                     onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                       e.currentTarget.src = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop';
                     }}
                   />
                 </div>
                 <div className="rounded-2xl overflow-hidden shadow-2xl">
                   <img
                     src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
                     alt="Restaurant atmosphere"
                     className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                     loading="lazy"
                     decoding="async"
                     sizes="(max-width: 1024px) 50vw, 25vw"
                     onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                       e.currentTarget.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';
                     }}
                   />
                 </div>
               </div>
               <div className="space-y-4 pt-8">
                 <div className="rounded-2xl overflow-hidden shadow-2xl">
                   <img
                     src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                     alt="Fresh ingredients"
                     className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                     loading="lazy"
                     decoding="async"
                     sizes="(max-width: 1024px) 50vw, 25vw"
                     onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                       e.currentTarget.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop';
                     }}
                   />
                 </div>
                 <div className="rounded-2xl overflow-hidden shadow-2xl">
                   <img
                     src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop"
                     alt="Dining experience"
                     className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                     loading="lazy"
                     decoding="async"
                     sizes="(max-width: 1024px) 50vw, 25vw"
                     onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                       e.currentTarget.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop';
                     }}
                   />
                 </div>
               </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do at Fork & Flame
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-8 mb-6 group-hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The passionate individuals behind every exceptional dish and memorable experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 h-full">
                  <div className="relative overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=face';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {member.name}
                    </h3>
                    <p className="text-primary-light mb-4 font-medium">
                      {member.role}
                    </p>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/20 text-primary-light text-xs rounded-full border border-primary/30"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-gradient">Achievements</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Recognition of our commitment to excellence and culinary innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 h-full">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {achievement.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section-padding bg-gradient-primary">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Experience Our Story
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join us for an unforgettable dining experience that brings our passion 
              and values to life on every plate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => window.location.href = ROUTES.ORDER}
              >
                Order Online
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={() => window.location.href = ROUTES.CONTACT}
              >
                Make a Reservation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
