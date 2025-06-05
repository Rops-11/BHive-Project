import React from "react";

type FacilityIntroTextProps = {
  title?: string;
  description?: string;
  titleColor?: string;
  descriptionColor?: string;
};

export const FacilityIntroText = ({
  title = " Facilities and Amenities",
  description = "Explore the range of facilities we offer to make your stay unforgettable.",
  titleColor = "text-[#D29D30]",
  descriptionColor = "text-[#4B5563]", 
}: FacilityIntroTextProps) => {
  return (
    <div className="rounded-lg max-w-4xl mx-auto mt-64 px-16">
      <h2 className={`text-4xl font-semibold text-center ${titleColor} mb-8`}>
        {title}
      </h2>
      <p className={`text-lg ${descriptionColor} leading-relaxed text-justify`}>
        {description}
      </p>
    </div>
  );
};
