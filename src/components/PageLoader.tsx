import logo from '@/assets/looo.png';

interface PageLoaderProps {
  message?: string;
  minHeight?: string;
}

const PageLoader = ({ message = 'Loading...', minHeight = '60vh' }: PageLoaderProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ minHeight }}
    >
      {/* Logo with pulse animation */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <img
          src={logo}
          alt="Tubhyam"
          className="relative h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-xl animate-bounce-slow"
        />
      </div>

      {/* Brand name */}
      <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-gradient-gold mb-2">
        Tubhyam
      </h2>
      <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-6">
        तुम्हारे लिए
      </p>

      {/* Loading text with dots animation */}
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground">{message}</span>
        <span className="flex gap-1 ml-1">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      </div>

      {/* Progress bar shimmer */}
      <div className="mt-8 w-48 h-0.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary/60 rounded-full animate-shimmer-bar" />
      </div>
    </div>
  );
};

export default PageLoader;
