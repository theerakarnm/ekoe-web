interface Gift {
  name?: string;
  description?: string;
  image?: string;
  value?: string;
}

interface ComplimentaryGiftProps {
  gift: Gift;
}

export function ComplimentaryGift({ gift }: ComplimentaryGiftProps) {
  return (
    <div className="bg-[#F9F5F0] p-4 rounded-lg flex gap-4 items-center border border-[#E6DCC8]">
      <div className="w-16 h-16 bg-white rounded-md overflow-hidden shrink-0 border border-gray-100">
        <img
          src={gift.image}
          alt="Gift"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#D4A373] text-white text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-medium">
            Free Gift
          </span>
          {gift.value && (
            <span className="text-xs text-gray-500 line-through">
              {gift.value}
            </span>
          )}
        </div>
        <h4 className="text-sm font-medium text-gray-900">
          {gift.name}
        </h4>
        <p className="text-xs text-gray-600 line-clamp-1">
          {gift.description}
        </p>
      </div>
    </div>
  );
}
