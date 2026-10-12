import { useEffect, useRef, useState } from 'react';

export const MAX_PHOTOS = 3;

export default function PhotoPicker({ files, onChange, max = MAX_PHOTOS, disabled = false }) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  function handleSelect(e) {
    const picked = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
    onChange([...files, ...picked].slice(0, max));
    e.target.value = '';
  }

  function removeAt(index) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="picker">
      {previews.length > 0 && (
        <div className="picker-previews">
          {previews.map((url, i) => (
            <div className="preview" key={url}>
              <img src={url} alt={'Selected photo ' + (i + 1)} />
              <button
                type="button"
                onClick={() => removeAt(i)}
                disabled={disabled}
                aria-label={'Remove photo ' + (i + 1)}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length < max && (
        <>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => inputRef.current.click()}
            disabled={disabled}
          >
            {files.length === 0 ? 'Add photos' : 'Add another photo'}
          </button>
          <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleSelect} />
        </>
      )}

      <p className="fine">
        Up to {max} photos. They are resized before upload, and any location data stored inside them is removed.
      </p>
    </div>
  );
}