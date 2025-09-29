import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImagesData: ImagePlaceholder[] = data.placeholderImages;

export const getPlaceholderImage = (id: string): ImagePlaceholder | undefined => {
    return placeholderImagesData.find((img) => img.id === id);
};
