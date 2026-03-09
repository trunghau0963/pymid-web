'use client';

import Image from 'next/image';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BadgeGroup, BadgeType } from './verification-badge';

interface ContactInfo {
  label: string;
  value: string;
  icon: React.ReactNode;
  href?: string;
}

interface ProfileHeaderProps {
  name: string;
  title?: string;
  image?: string;
  location?: string;
  badges?: { type: BadgeType; label?: string }[];
  contactInfo?: ContactInfo[];
  description?: string;
  className?: string;
}

export function ProfileHeader({
  name,
  title,
  image,
  location,
  badges,
  contactInfo,
  description,
  className,
}: ProfileHeaderProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Avatar Section */}
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/50 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-300" />
            
            {image ? (
              <Image
                src={image}
                alt={name}
                width={160}
                height={160}
                className="relative w-28 h-28 md:w-36 md:h-36 rounded-xl object-cover border-4 border-white shadow-xl"
              />
            ) : (
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white border-4 border-white shadow-xl">
                <span className="text-4xl md:text-5xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Status Indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Name & Title */}
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 tracking-tight">
                {name}
              </h1>
              {title && (
                <p className="text-base md:text-lg text-primary font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {title}
                </p>
              )}
              {location && (
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <div className="p-1 bg-muted/60 rounded-full">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium">{location}</span>
                </div>
              )}
            </div>

            {/* Badges */}
            {badges && badges.length > 0 && (
              <div className="mb-4">
                <BadgeGroup badges={badges} />
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-2xl bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border/40">
                {description}
              </p>
            )}

            {/* Contact Info Cards */}
            {contactInfo && contactInfo.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3 shadow-sm border border-border/40 hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0 p-2 bg-primary/[0.08] rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                      {info.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-foreground truncate">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
