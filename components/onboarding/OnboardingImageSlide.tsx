import Image from "next/image";

interface OnboardingImageSlideProps {
  imagePath: string;
  slideNumber: number;
}

export function OnboardingImageSlide({
  imagePath,
  slideNumber,
}: OnboardingImageSlideProps) {
  return (
    <>
      <div className="relative w-full aspect-13/14 mb-4 md:hidden">
        <Image
          src={"/m" + imagePath}
          alt={`온보딩 ${slideNumber}단계`}
          fill
          className="object-contain"
          priority={slideNumber === 1}
          loading={slideNumber === 1 ? undefined : "lazy"}
        />
      </div>
      <div className="relative w-full aspect-10/8 hidden md:block">
        <Image
          src={imagePath}
          alt={`온보딩 ${slideNumber}단계`}
          fill
          className="object-contain"
          priority={slideNumber === 1}
          loading={slideNumber === 1 ? undefined : "lazy"}
        />
      </div>
    </>
  );
}
