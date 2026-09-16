import { useTheme } from '@/context/ThemeContext';
import { Check } from 'lucide-react';

interface ProfileFormProps {
  size: string;
  skinTone: string;
  occasion: string;
  styleMood: string;
  onSizeChange: (size: string) => void;
  onSkinToneChange: (skinTone: string) => void;
  onOccasionChange: (occasion: string) => void;
  onStyleMoodChange: (styleMood: string) => void;
}

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

const SKIN_TONES = [
  { name: 'Fair', color: '#F5D0B0' },
  { name: 'Light', color: '#E8B896' },
  { name: 'Medium', color: '#D4A574' },
  { name: 'Tan', color: '#C4956A' },
  { name: 'Honey', color: '#A67B5B' },
  { name: 'Deep', color: '#6B4423' },
];

const OCCASIONS = ['Everyday', 'Work', 'Dinner', 'Celebration'];

const STYLE_MOODS = ['Quiet Luxury', 'Modern Minimal', 'Soft Feminine', 'Statement Tailoring'];

const ProfileForm = ({
  size,
  skinTone,
  occasion,
  styleMood,
  onSizeChange,
  onSkinToneChange,
  onOccasionChange,
  onStyleMoodChange,
}: ProfileFormProps) => {
  const { isLight } = useTheme();

  const T = {
    bg: isLight ? '#FFFFFF' : '#1C1714',
    surface: isLight ? '#FAF5EF' : '#241E18',
    border: isLight ? '#E0D5C8' : 'rgba(255,211,172,0.15)',
    borderActive: '#8B5E3C',
    text: isLight ? '#1A1410' : '#FFF5EB',
    textSec: isLight ? '#6B5E52' : 'rgba(255,211,172,0.7)',
    accent: '#8B5E3C',
    gradient: 'linear-gradient(135deg, #8B5E3C 0%, #A0714D 40%, #C9A882 100%)',
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Size Selection */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: T.textSec }}>
          Usual Size
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => onSizeChange(s)}
              className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                size === s ? 'text-white shadow-md scale-105' : 'border-2 hover:scale-105'
              }`}
              style={{
                background: size === s ? T.gradient : T.surface,
                borderColor: size === s ? T.accent : T.border,
                color: size === s ? 'white' : T.text,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Skin Tone Selection */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: T.textSec }}>
          Skin Tone
        </h3>
        <div className="flex flex-wrap gap-4">
          {SKIN_TONES.map((tone) => (
            <button
              key={tone.name}
              onClick={() => onSkinToneChange(tone.name)}
              className="relative group"
              title={tone.name}
            >
              <div
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  skinTone === tone.name ? 'border-[#8B5E3C] scale-110 shadow-lg' : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ background: tone.color }}
              >
                {skinTone === tone.name && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check size={20} className="text-white drop-shadow-md" />
                  </div>
                )}
              </div>
              <p className="text-xs mt-2 text-center" style={{ color: T.textSec }}>
                {tone.name}
              </p>
            </button>
          ))}
        </div>
        {skinTone && (
          <p className="text-sm mt-3" style={{ color: T.textSec }}>
            Selected: <span className="font-semibold" style={{ color: T.text }}>{skinTone}</span>
          </p>
        )}
      </div>

      {/* Occasion Selection */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: T.textSec }}>
          Dress For
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {OCCASIONS.map((occ) => (
            <button
              key={occ}
              onClick={() => onOccasionChange(occ)}
              className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                occasion === occ ? 'text-white shadow-md' : 'border-2 hover:scale-[1.02]'
              }`}
              style={{
                background: occasion === occ ? T.gradient : T.surface,
                borderColor: occasion === occ ? T.accent : T.border,
                color: occasion === occ ? 'white' : T.text,
              }}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* Style Mood Selection */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: T.textSec }}>
          Style Mood
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {STYLE_MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => onStyleMoodChange(mood)}
              className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                styleMood === mood ? 'text-white shadow-md' : 'border-2 hover:scale-[1.02]'
              }`}
              style={{
                background: styleMood === mood ? T.gradient : T.surface,
                borderColor: styleMood === mood ? T.accent : T.border,
                color: styleMood === mood ? 'white' : T.text,
              }}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
