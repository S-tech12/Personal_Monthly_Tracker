import React, { useRef } from 'react';
import '../../styles/components/Avatar.css';

export interface AvatarProps {
  imageUrl?: string | null;
  altText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onImageSelect?: (file: File) => void;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  imageUrl, 
  altText = 'User Avatar', 
  size = 'md', 
  editable = false,
  onImageSelect
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (editable) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onImageSelect) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className={`avatar-container avatar-size-${size} ${editable ? 'avatar-editable' : ''}`}>
      <div className="avatar-wrapper" onClick={handleClick}>
        {imageUrl ? (
          <img src={imageUrl} alt={altText} className="avatar-image" />
        ) : (
          <span className="material-symbols-outlined avatar-fallback">person</span>
        )}
      </div>
      
      {editable && (
        <button 
          className="avatar-edit-btn" 
          onClick={handleClick}
          aria-label="Change profile picture"
          type="button"
        >
          <span className="material-symbols-outlined">photo_camera</span>
        </button>
      )}

      {editable && (
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          className="avatar-file-input" 
          onChange={handleFileChange} 
        />
      )}
    </div>
  );
};
