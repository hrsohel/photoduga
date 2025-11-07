'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  PhotoIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  TrashIcon,
  ArrowUpOnSquareIcon,
  CheckBadgeIcon,
  MinusIcon,
  PlusIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';

export default function PhotoAlbum() {
  const [images, setImages] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  // ---- SAFE NAME ---------------------------------------------------------
  const getSafeName = useCallback((img) => {
    if (!img) return 'Unknown';
    if (img.name) return img.name;
    const idPart = img.id?.split('-')[0];
    return idPart ? `image-${idPart}` : 'image-unknown';
  }, []);

  // ---- IMMUTABLE UPDATE --------------------------------------------------
  const updateSelected = useCallback((updater) => {
    setImages((prev) => {
      const selected = new Set(selectedIds);
      return prev.map((img) => {
        if (!img || !img.id || !selected.has(img.id)) return img;
        const updated = updater(img);
        return { ...img, ...updated, id: img.id, url: img.url, name: img.name };
      });
    });
  }, [selectedIds]);

  // ---- UPLOAD ------------------------------------------------------------
  const handleUpload = useCallback((e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = [];
    let loaded = 0;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const id = `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
        newImages.push({
          id,
          url: ev.target?.result || '',
          name: file.name || `image-${id.split('-')[0]}`,
          scale: 1,
          rotation: 0,
          flipH: false,
          flipV: false,
          opacity: 1,
          filter: 'none',
          mask: 'none',
          zIndex: images.length + newImages.length,
          objectFit: 'contain',
        });

        loaded++;
        if (loaded === files.length) {
          setImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [images.length]);

  // ---- SELECTION ---------------------------------------------------------
  const toggleSelect = useCallback((id) => {
    if (!id) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    const validIds = images.filter(img => img?.id).map(img => img.id);
    setSelectedIds(selectedIds.size === validIds.length ? new Set() : new Set(validIds));
  }, [images, selectedIds.size]);

  // ---- DELETE ------------------------------------------------------------
  const deleteSelected = useCallback(() => {
    setImages((prev) => prev.filter(img => img && img.id && !selectedIds.has(img.id)));
    setSelectedIds(new Set());
  }, [selectedIds]);

  // ---- EDIT FUNCTIONS ----------------------------------------------------
  const zoomIn = useCallback(() => updateSelected(img => ({ scale: img.scale + 0.1 })), [updateSelected]);
  const zoomOut = useCallback(() => updateSelected(img => ({ scale: Math.max(0.1, img.scale - 0.1) })), [updateSelected]);

  const rotateRight = useCallback(() => updateSelected(img => ({ rotation: (img.rotation + 90) % 360 })), [updateSelected]);
  const rotateLeft = useCallback(() => updateSelected(img => ({ rotation: (img.rotation - 90 + 360) % 360 })), [updateSelected]);

  const flipHorizontal = useCallback(() => updateSelected(img => ({ flipH: !img.flipH })), [updateSelected]);
  const flipVertical = useCallback(() => updateSelected(img => ({ flipV: !img.flipV })), [updateSelected]);

  const setOpacity = useCallback((value) => updateSelected(() => ({ opacity: parseFloat(value) })), [updateSelected]);

  const applyFilter = useCallback((filter) => updateSelected(() => ({ filter })), [updateSelected]);

  // ---- MASKING (PERFECT SHAPES) ------------------------------------------
  const applyMask = useCallback((mask) => {
    updateSelected(() => ({ mask }));
  }, [updateSelected]);

  const getMaskPath = (mask) => {
    const masks = {
      none: 'none',
      circle: 'circle(50%)',
      star: `polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)`,
      heart: `path('M 50 15 A 20 20 0 1 1 75 40 A 20 20 0 1 1 50 65 A 20 20 0 1 1 25 40 A 20 20 0 1 1 50 15 Z')`,
      hexagon: `polygon(30% 10%, 70% 10%, 90% 50%, 70% 90%, 30% 90%, 10% 50%)`,
      polygon: `polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)`,
    };
    return masks[mask] || 'none';
  };

  const toggleFillMode = useCallback(() => {
    const hasContain = images.some(i => selectedIds.has(i.id) && i.objectFit === 'contain');
    const newFit = hasContain ? 'cover' : 'contain';
    updateSelected(() => ({ objectFit: newFit }));
  }, [images, selectedIds, updateSelected]);

  // ---- LAYER ORDER -------------------------------------------------------
  const bringToFront = useCallback(() => {
    const maxZ = Math.max(...images.map(i => i.zIndex ?? 0), -1) + 1;
    updateSelected(() => ({ zIndex: maxZ }));
  }, [images, updateSelected]);

  const sendToBack = useCallback(() => {
    const minZ = Math.min(...images.map(i => i.zIndex ?? 0), 0) - 1;
    updateSelected(() => ({ zIndex: minZ }));
  }, [images, updateSelected]);

  const moveForward = useCallback(() => updateSelected(img => ({ zIndex: (img.zIndex ?? 0) + 1 })), [updateSelected]);
  const moveBackward = useCallback(() => updateSelected(img => ({ zIndex: (img.zIndex ?? 0) - 1 })), [updateSelected]);

  // ---- DOWNLOAD ----------------------------------------------------------
  const downloadSelected = useCallback(() => {
    images
      .filter(img => img && selectedIds.has(img.id))
      .forEach(img => {
        const a = document.createElement('a');
        a.href = img.url;
        a.download = getSafeName(img);
        a.click();
      });
  }, [images, selectedIds, getSafeName]);

  // ---- FILTERED IMAGES ---------------------------------------------------
  const filteredImages = useMemo(() => {
    return images
      .filter(img => img && img.id && img.url && getSafeName(img).toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
  }, [images, searchTerm, getSafeName]);

  // ---- TRANSFORM ---------------------------------------------------------
  const getTransform = useCallback((img) => {
    if (!img) return '';
    let t = `scale(${img.scale ?? 1}) rotate(${img.rotation ?? 0}deg)`;
    if (img.flipH) t += ' scaleX(-1)';
    if (img.flipV) t += ' scaleY(-1)';
    return t;
  }, []);

  // ---- FILTER CSS --------------------------------------------------------
  const getFilterCSS = (filter) => {
    const map = {
      none: 'none',
      grayscale: 'grayscale(100%)',
      sepia: 'sepia(100%)',
      blur: 'blur(4px)',
      brightness: 'brightness(150%)',
      contrast: 'contrast(200%)',
      invert: 'invert(100%)',
    };
    return map[filter] || 'none';
  };

  const currentOpacity = selectedIds.size > 0
    ? images.find(i => i && selectedIds.has(i.id))?.opacity ?? 1
    : 1;

  // ---- KEYBOARD ----------------------------------------------------------
  useEffect(() => {
    const handleKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const ctrl = isMac ? e.metaKey : e.ctrlKey;

      if (ctrl && e.key === 'a') { e.preventDefault(); selectAll(); }
      else if (e.key === 'Delete' || e.key === 'Backspace') { deleteSelected(); }
      else if (selectedIds.size > 0) {
        if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn(); }
        else if (e.key === '-') { e.preventDefault(); zoomOut(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); rotateRight(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); rotateLeft(); }
        else if (e.key.toLowerCase() === 'h') { e.preventDefault(); flipHorizontal(); }
        else if (e.key.toLowerCase() === 'v') { e.preventDefault(); flipVertical(); }
        else if (e.key.toLowerCase() === 'f') { e.preventDefault(); bringToFront(); }
        else if (e.key.toLowerCase() === 'b') { e.preventDefault(); sendToBack(); }
        else if (e.key === 'ArrowUp' && e.shiftKey) { e.preventDefault(); moveForward(); }
        else if (e.key === 'ArrowDown' && e.shiftKey) { e.preventDefault(); moveBackward(); }
        else if (e.key.toLowerCase() === 'o') { e.preventDefault(); toggleFillMode(); }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [
    selectedIds.size, selectAll, deleteSelected, zoomIn, zoomOut,
    rotateRight, rotateLeft, flipHorizontal, flipVertical,
    bringToFront, sendToBack, moveForward, moveBackward, toggleFillMode
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 text-xs">
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded-lg" title="Upload">
            <ArrowUpOnSquareIcon className="w-5 h-5" />
          </button>

          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1" />

          <button onClick={selectAll} className="p-2 hover:bg-gray-100 rounded-lg" title="Select All (Ctrl+A)">
            <CheckBadgeIcon className="w-5 h-5" />
          </button>

          <button onClick={toggleFillMode} disabled={selectedIds.size === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50" title="Fill/Fit (O)">
            <ArrowPathIcon className="w-5 h-5" />
          </button>

          <button onClick={zoomOut} disabled={selectedIds.size === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50" title="Zoom Out (-)">&minus;</button>
          <button onClick={zoomIn} disabled={selectedIds.size === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50" title="Zoom In (+)">+</button>

          <button onClick={rotateLeft} disabled={selectedIds.size === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50" title="Rotate Left (Left)">
            <ArrowUturnLeftIcon className="w-5 h-5" />
          </button>
          <button onClick={rotateRight} disabled={selectedIds.size === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50" title="Rotate Right (Right)">
            <ArrowUturnRightIcon className="w-5 h-5" />
          </button>

          <button onClick={flipHorizontal} disabled={selectedIds.size === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50" title="Flip H (H)">
            <ArrowsRightLeftIcon className="w-5 h-5" />
          </button>
          <button onClick={flipVertical} disabled={selectedIds.size === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50" title="Flip V (V)">
            <ArrowsUpDownIcon className="w-5 h-5" />
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={currentOpacity}
            onChange={(e) => setOpacity(e.target.value)}
            disabled={selectedIds.size === 0}
            className="w-20 disabled:opacity-50"
            title="Opacity"
          />

          <select onChange={(e) => applyFilter(e.target.value)} disabled={selectedIds.size === 0} className="px-2 py-1 text-sm border rounded disabled:opacity-50">
            <option value="none">No Effect</option>
            <option value="grayscale">Grayscale</option>
            <option value="sepia">Sepia</option>
            <option value="blur">Blur</option>
            <option value="brightness">Bright</option>
            <option value="contrast">Contrast</option>
            <option value="invert">Invert</option>
          </select>

          {/* MASK SELECTOR */}
          <select onChange={(e) => applyMask(e.target.value)} disabled={selectedIds.size === 0} className="px-2 py-1 text-sm border rounded disabled:opacity-50">
            <option value="none">No Mask</option>
            <option value="circle">Circle</option>
            <option value="star">Star</option>
            <option value="heart">Heart</option>
            <option value="hexagon">Hexagon</option>
            <option value="polygon">Polygon</option>
          </select>

          <button onClick={bringToFront} disabled={selectedIds.size === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50" title="Front (F)">
            <ArrowUpTrayIcon className="w-5 h-5" />
          </button>
          <button onClick={moveForward} disabled={selectedIds.size === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50" title="Forward (Shift+Up)">
            <ArrowUpIcon className="w-5 h-5" />
          </button>
          <button onClick={moveBackward} disabled={selectedIds.size === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50" title="Backward (Shift+Down)">
            <ArrowDownIcon className="w-5 h-5" />
          </button>
          <button onClick={sendToBack} disabled={selectedIds.size === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50" title="Back (B)">
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>

          <button onClick={downloadSelected} disabled={selectedIds.size === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50" title="Download">
            <DocumentArrowDownIcon className="w-5 h-5" />
          </button>
          <button onClick={deleteSelected} disabled={selectedIds.size === 0} className="p-2 hover:bg-red-100 text-red-600 rounded-lg disabled:opacity-50" title="Delete (Del)">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="p-6">
        {filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <PhotoIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No images. Upload to start!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredImages.map((img) => {
              if (!img || !img.id || !img.url) return null;
              const isSelected = selectedIds.has(img.id);
              return (
                <div
                  key={img.id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    isSelected ? 'border-blue-500 shadow-xl' : 'border-transparent'
                  }`}
                  style={{ zIndex: img.zIndex ?? 0 }}
                  onClick={() => toggleSelect(img.id)}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        transform: getTransform(img),
                        opacity: img.opacity ?? 1,
                        filter: getFilterCSS(img.filter),
                        clipPath: getMaskPath(img.mask),
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <img
                        src={img.url}
                        alt={getSafeName(img)}
                        className={`w-full h-full ${img.objectFit === 'cover' ? 'object-cover' : 'object-contain'}`}
                      />
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selection Counter */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          {selectedIds.size} selected
        </div>
      )}

      {/* Keyboard Help */}
      <div className="fixed bottom-16 left-4 bg-black text-white text-xs p-3 rounded-lg opacity-80 hidden md:block">
        <div><strong>Shortcuts:</strong></div>
        <div>Ctrl+A: Select All • Del: Delete</div>
        <div>+/−: Zoom • Left/Right: Rotate</div>
        <div>H/V: Flip • F/B: Front/Back</div>
        <div>Shift+Up/Down: Layer • O: Fill/Fit</div>
      </div>
    </div>
  );
}