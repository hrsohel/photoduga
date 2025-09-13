import React from "react";
import { useParams } from "react-router-dom";

const ProductDetailsPage = () => {
  const id = useParams().id;
  const category = useParams().category;

  return (
    <div>
      Product Details Page - {id} - {category}
    </div>
  );
};

export default ProductDetailsPage;
