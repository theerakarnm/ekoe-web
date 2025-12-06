import { AlertCircle, CheckCircle, Leaf } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";

interface KeyIngredient {
  name: string;
  description: string;
  benefits?: string[];
  source?: string;
}

interface IngredientsData {
  keyIngredients?: KeyIngredient[];
  fullList?: string;
  allergens?: string[];
  certifications?: string[];
}

interface IngredientsTabProps {
  ingredients?: IngredientsData;
}

export function IngredientsTab({ ingredients }: IngredientsTabProps) {
  // Handle missing ingredient data gracefully
  if (!ingredients) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          Ingredient information will be added soon. Please check back later.
        </p>
      </div>
    );
  }

  const hasKeyIngredients = ingredients.keyIngredients && ingredients.keyIngredients.length > 0;
  const hasFullList = ingredients.fullList && ingredients.fullList.trim().length > 0;
  const hasAllergens = ingredients.allergens && ingredients.allergens.length > 0;
  const hasCertifications = ingredients.certifications && ingredients.certifications.length > 0;

  return (
    <div className="space-y-8">
      {/* Key Ingredients with Expandable Accordion */}
      {hasKeyIngredients && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Key Ingredients</h3>
          <Accordion type="single" collapsible className="w-full">
            {ingredients.keyIngredients!.map((ingredient, index) => (
              <AccordionItem key={index} value={`ingredient-${index}`}>
                <AccordionTrigger className="text-left">
                  <span className="font-medium">{ingredient.name}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-muted-foreground">
                    <p>{ingredient.description}</p>
                    
                    {ingredient.benefits && ingredient.benefits.length > 0 && (
                      <div>
                        <p className="font-medium text-foreground mb-2">Benefits:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {ingredient.benefits.map((benefit, idx) => (
                            <li key={idx}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {ingredient.source && (
                      <p className="text-sm">
                        <span className="font-medium text-foreground">Source:</span> {ingredient.source}
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {/* Allergens and Certifications */}
      {(hasAllergens || hasCertifications) && (
        <div className="space-y-4">
          {/* Allergen Warning */}
          {hasAllergens && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Allergen Information</AlertTitle>
              <AlertDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ingredients.allergens!.map((allergen, index) => (
                    <Badge key={index} variant="destructive">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Certifications */}
          {hasCertifications && (
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-green-900 dark:text-green-100 mb-2">
                  Certifications
                </p>
                <div className="flex flex-wrap gap-2">
                  {ingredients.certifications!.map((cert, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-white dark:bg-green-950 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300"
                    >
                      <Leaf className="h-3 w-3" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Ingredients List (ordered by concentration) */}
      {hasFullList && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Full Ingredients List</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Listed in order of concentration as required by regulations
          </p>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm leading-relaxed">{ingredients.fullList}</p>
          </div>
        </div>
      )}

      {/* Show message if no data available */}
      {!hasKeyIngredients && !hasFullList && !hasAllergens && !hasCertifications && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            Ingredient information will be added soon. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}
