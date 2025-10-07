import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus, Shuffle } from "lucide-react";

const PhotoLayoutModal = ({ onAddGrid, onRemoveGrid, onShuffleGrids }) => {

  return (
    <div className="p-4">
      <div className="flex space-x-2 mb-4">
        <Button onClick={onAddGrid} variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
        <Button onClick={onRemoveGrid} variant="outline" size="icon">
          <Minus className="h-4 w-4" />
        </Button>
        <Button onClick={onShuffleGrids} variant="outline" size="icon">
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        Use the buttons above to add, remove, or shuffle photo grids.
      </p>
    </div>
  );
};

export default PhotoLayoutModal;