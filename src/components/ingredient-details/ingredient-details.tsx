import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { ingredientsSelectors } from '../../services/slices/ingredients-slice';
import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const ingredients = useSelector(ingredientsSelectors.selectIngredients);

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
