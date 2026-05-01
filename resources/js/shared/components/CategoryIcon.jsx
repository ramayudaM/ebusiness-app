import React from 'react';
import { Guitar, Piano, Drum, Music, Wind, MicVocal, Headphones, Settings, Wrench } from 'lucide-react';

export const CategoryIcon = ({ name, className }) => {
    const slug = name.toLowerCase();
    
    if (slug.includes('gitar') || slug.includes('bass') || slug.includes('ukulele')) {
        return <Guitar className={className} strokeWidth={1.5} />;
    }
    if (slug.includes('piano') || slug.includes('keyboard')) {
        return <Piano className={className} strokeWidth={1.5} />;
    }
    if (slug.includes('drum') || slug.includes('perkusi')) {
        return <Drum className={className} strokeWidth={1.5} />;
    }
    if (slug.includes('biola') || slug.includes('gesek')) {
        return <Music className={className} strokeWidth={1.5} />;
    }
    if (slug.includes('tiup') || slug.includes('saxophone')) {
        return <Wind className={className} strokeWidth={1.5} />;
    }
    if (slug.includes('mic') || slug.includes('vokal')) {
        return <MicVocal className={className} strokeWidth={1.5} />;
    }
    if (slug.includes('aksesoris')) {
        return <Headphones className={className} strokeWidth={1.5} />;
    }
    if (slug.includes('suku cadang') || slug.includes('sparepart')) {
        return <Wrench className={className} strokeWidth={1.5} />;
    }
    
    return <Music className={className} strokeWidth={1.5} />;
};
