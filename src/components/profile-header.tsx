'use client';

import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
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
    <div className={cn('bg-gradient-to-b from-slate-50 to-white border-b border-slate-200', className)}>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar and Basic Info */}
          <div className="flex-shrink-0">
            {image ? (
              <Image
                src={image}
                alt={name}
                width={120}
                height={120}
                className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover border-2 border-slate-200"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                <span className="text-3xl md:text-4xl">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                {name}
              </h1>
              {title && (
                <p className="text-lg text-primary font-medium">{title}</p>
              )}
              {location && (
                <div className="flex items-center gap-2 text-slate-600 mt-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{location}</span>
                </div>
              )}
            </div>

            {/* Badges */}
            {badges && badges.length > 0 && (
              <div className="mb-6">
                <BadgeGroup badges={badges} />
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-2xl">
                {description}
              </p>
            )}

            {/* Contact Info Grid */}
            {contactInfo && contactInfo.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1 text-primary">
                      {info.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm text-primary hover:text-primary/80 transition-colors break-all"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm text-slate-900 break-all">
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
