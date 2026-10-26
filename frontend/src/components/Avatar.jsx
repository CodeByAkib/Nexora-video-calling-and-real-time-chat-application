import { useState } from "react";

const getInitials = (name) =>
  (name || "N")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase() || "N";


const Avatar = ({ src, name, className = "size-10", textClassName = "text-sm" }) => {
  // Remember which src failed, so a *new* src gets a fresh chance to load.
  const [failedSrc, setFailedSrc] = useState(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 font-bold text-white ${className}`}
    >
      {showImage ? (
        <img
          src={src}
          alt={name ? `${name}'s avatar` : "User avatar"}
          onError={() => setFailedSrc(src)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className={textClassName} aria-label={name || "User"}>
          {getInitials(name)}
        </span>
      )}
    </div>
  );
};

export default Avatar;
