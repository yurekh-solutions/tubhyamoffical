import { useTheme } from '@/context/ThemeContext';
import { Check } from 'lucide-react';
import Mannequin from './Mannequin';

interface Look {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  items: string[];
  garmentColor: string;
}

const CURATED_LOOKS: Look[] = [
  {
    id: 'camel-column',
    number: '01',
    name: 'The Camel Column',
    tagline: 'Polished & Elongating',
    description: 'Camel high-waist wide-leg trousers, a tonal fitted knit and a softly structured longline layer.',
    items: ['Tonal knit', 'Palazzo trouser', 'Longline layer'],
    garmentColor: '#C9A882',
  },
  {
    id: 'cocoa-contrast',
    number: '02',
    name: 'Cocoa Contrast',
    tagline: 'Defined & Versatile',
    description: 'Chocolate pleated trousers balanced with an ivory shell and a refined cinched waist.',
    items: ['Ivory shell', 'Pleated trouser', 'Slim belt'],
    garmentColor: '#7A4A2D',
  },
  {
    id: 'noir-flow',
    number: '03',
    name: 'Noir Flow',
    tagline: 'Elegant & Effortless',
    description: 'A fluid black co-ord with sculpted shoulders and a clean, floor-skimming silhouette.',
    items: ['Sculpted top', 'Fluid trouser', 'Minimal heel'],
    garmentColor: '#1A1A1A',
  },
  {
    id: 'soft-sand',
    number: '04',
    name: 'Soft Sand Set',
    tagline: 'Relaxed & Refined',
    description: 'A soft taupe co-ord with a wrap-inspired top and an easy, tailored trouser.',
    items: ['Wrap top', 'Tailored trouser', 'Fine gold detail'],
    garmentColor: '#B8A88A',
  },
];

interface LookSelectorProps {
  selectedLookId: string;
  onSelectLook: (lookId: string) => void;
  profileSummary: string;
}

const LookSelector = ({ selectedLookId, onSelectLook, profileSummary }: LookSelectorProps) => {
  const { isLight } = useTheme();

  const T = {
    bg: isLight ? '#FAF5EF' : '#0F0D0B',
    surface: isLight ? '#FFFFFF' : '#1C1714',
    border: isLight ? '#E0D5C8' : 'rgba(255,211,172,0.15)',
    borderActive: '#8B5E3C',
    text: isLight ? '#1A1410' : '#FFF5EB',
    textSec: isLight ? '#6B5E52' : 'rgba(255,211,172,0.7)',
    accent: '#8B5E3C',
  };

  return (
    <div>
      {/* Profile Summary Badge */}
      {profileSummary && (
        <div className="flex justify-end mb-6">
          <div className="px-4 py-2 rounded-full text-xs font-medium" style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.textSec }}>
            {profileSummary}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CURATED_LOOKS.map((look) => {
          const isSelected = selectedLookId === look.id;
          return (
            <button
              key={look.id}
              onClick={() => onSelectLook(look.id)}
              className={`relative text-left rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${
                isSelected ? 'shadow-xl scale-[1.02]' : ''
              }`}
              style={{
                background: T.surface,
                borderColor: isSelected ? T.borderActive : T.border,
              }}
            >
              {/* Checkmark for selected */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: T.accent }}>
                  <Check size={14} className="text-white" />
                </div>
              )}

              {/* Number */}
              <div className="absolute top-3 left-3 z-10 text-xs font-bold" style={{ color: T.textSec }}>
                {look.number}
              </div>

              {/* Mini Mannequin Preview */}
              <div className="aspect-[3/4] relative overflow-hidden" style={{ background: look.garmentColor + '30' }}>
                <Mannequin
                  size="M"
                  skinTone="Medium"
                  garmentColor={look.garmentColor}
                  height={280}
                  width={200}
                />
              </div>

              {/* Look Details */}
              <div className="p-4 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: T.accent }}>
                  {look.tagline}
                </p>
                <h3 className="font-heading text-lg font-semibold" style={{ color: T.text }}>
                  {look.name}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: T.textSec }}>
                  {look.description}
                </p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {look.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-1 rounded-full"
                      style={{ background: T.bg, color: T.textSec }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LookSelector;
export { CURATED_LOOKS };
export type { Look };
