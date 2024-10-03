export interface Product {
  id: string;
  title: string;
  sku: string;
  slug: string;
  price: number;
  pictures: string[];
  description: {
    description_short: string;
    description_long: string;
  };
  product_details: {
    category: string;
    manufacturer: string;
    hotness: number;
    weight: number;
    rating: {
      average: number;
      nr_of_reviews: number;
    };
  };
}

export const cleanHTML = (html: string): string => {
  // Remove all attributes and inline styles
  return html.replace(/<(\w+)(?:\s[^>]*)?>/g, '<$1>');
};
