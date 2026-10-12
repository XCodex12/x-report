import { useState } from 'react';
import PhotoPicker, { MAX_PHOTOS } from './PhotoPicker';
import { compressImage } from '../utils/image';
import { uploadPhotos } from '../lib/api';

export default function PhotoUploader({ issue, kind, userId, existing, onAdded, label }) {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const room = MAX_PHOTOS - existing;
  if (room <= 0) return null;

  async function handleUpload() {
    if (files.length === 0) return;
    setBusy(true);
    setError('');
    try {
      const blobs = await Promise.all(files.map((f) => compressImage(f)));
      const saved = await uploadPhotos(issue.dbId, kind, blobs, userId);
      onAdded(issue.id, saved);
      setFiles([]);
    } catch (err) {
      console.error(err);
      if (err.saved && err.saved.length > 0) onAdded(issue.id, err.saved);
      setError('Could not upload the photos. ' + (err.message || ''));
    }
    setBusy(false);
  }

  return (
    <div className="photo-block">
      <h3>{label}</h3>
      {error && <div className="notice notice-error" role="alert">{error}</div>}
      <PhotoPicker files={files} onChange={setFiles} max={room} disabled={busy} />
      {files.length > 0 && (
        <button type="button" className="btn btn-sm" onClick={handleUpload} disabled={busy}>
          {busy ? 'Uploading...' : 'Upload photos'}
        </button>
      )}
    </div>
  );
}